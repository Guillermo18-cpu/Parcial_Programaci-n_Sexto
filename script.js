const API_URL = "http://localhost:3000/api/contacts";

let contacts = [];
let editId = null;
let deleteId = null;

const form = document.getElementById("contactForm");
const list = document.getElementById("contactList");
const loading = document.getElementById("loading");


async function loadContacts() {

    const response = await fetch(API_URL);

    contacts = await response.json();

    render();
}


form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const telefono = document.getElementById("telefono").value;
    const ciudad = document.getElementById("ciudad").value;
    const direccion = document.getElementById("direccion").value;

    const gender = document.querySelector("input[name='gender']:checked");

    if (!gender) {
        alert("Selecciona un género");
        return;
    }

    const newContact = {
        nombre,
        apellido,
        telefono,
        ciudad,
        direccion,
        gender: gender.value
    };

    showLoading();

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newContact)
    });

    form.reset();

    hideLoading();

    showSuccess("Contacto agregado correctamente");

    loadContacts();
});


function render() {

    list.innerHTML = "";

    contacts.forEach((c) => {

        const icon = c.gender === "male"
            ? '<i class="bi bi-person-circle user-icon male"></i>'
            : '<i class="bi bi-person-circle user-icon female"></i>';

        list.innerHTML += `
            <div class="contact-item">

                <div>
                    ${icon}
                    <strong>${c.nombre} ${c.apellido}</strong><br>
                    <small>${c.ciudad}</small>
                </div>

                <div class="contact-actions">
                    <i class="bi bi-pencil-square text-warning"
                       onclick="edit(${c.id})"></i>

                    <i class="bi bi-trash text-danger"
                       onclick="removeContact(${c.id})"></i>
                </div>

            </div>
        `;
    });
}


function edit(id) {

    editId = id;

    const contact = contacts.find(c => c.id === id);

    document.getElementById("editName").value = contact.nombre;
    document.getElementById("editLastname").value = contact.apellido;
    document.getElementById("editPhone").value = contact.telefono;
    document.getElementById("editCity").value = contact.ciudad;
    document.getElementById("editAddress").value = contact.direccion;

    new bootstrap.Modal(document.getElementById("editModal")).show();
}


document.getElementById("saveEdit").addEventListener("click", async () => {

    const updatedContact = {
        nombre: document.getElementById("editName").value,
        apellido: document.getElementById("editLastname").value,
        telefono: document.getElementById("editPhone").value,
        ciudad: document.getElementById("editCity").value,
        direccion: document.getElementById("editAddress").value,
        gender: "male"
    };

    await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedContact)
    });

    bootstrap.Modal.getInstance(
        document.getElementById("editModal")
    ).hide();

    showSuccess("Contacto actualizado");

    loadContacts();
});


function removeContact(id) {

    deleteId = id;

    new bootstrap.Modal(
        document.getElementById("deleteModal")
    ).show();
}

document.getElementById("confirmDelete")
.addEventListener("click", async () => {

    await fetch(`${API_URL}/${deleteId}`, {
        method: "DELETE"
    });

    bootstrap.Modal.getInstance(
        document.getElementById("deleteModal")
    ).hide();

    showSuccess("Contacto eliminado");

    loadContacts();
});

function showLoading() {
    loading.classList.remove("d-none");
}

function hideLoading() {
    loading.classList.add("d-none");
}

function showSuccess(message) {

    document.getElementById("successMessage").textContent = message;

    const modal = new bootstrap.Modal(
        document.getElementById("successModal")
    );

    modal.show();

    setTimeout(() => {
        modal.hide();
    }, 1500);
}

loadContacts();