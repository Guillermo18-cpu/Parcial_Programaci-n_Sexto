let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
let editIndex = null;
let deleteIndex = null;

const form = document.getElementById("contactForm");
const list = document.getElementById("contactList");
const errorMsg = document.getElementById("errorMsg");
const loading = document.getElementById("loading");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;

    const nombre = document.getElementById("nombre");
    const apellido = document.getElementById("apellido");
    const telefono = document.getElementById("telefono");
    const ciudad = document.getElementById("ciudad");
    const direccion = document.getElementById("direccion");
    const gender = document.querySelector("input[name='gender']:checked");

    document.querySelectorAll(".error").forEach(e => e.innerHTML = "");
    document.querySelectorAll(".input-custom").forEach(i => i.classList.remove("input-error"));
    document.querySelectorAll(".error").forEach(e => e.textContent = "");
    document.querySelectorAll(".input-custom").forEach(i => i.classList.remove("input-error"));


    if (nombre.value.trim() === "") {
        showError(nombre, "errorNombre", "Por favor, ingresa el nombre");
        valid = false;
    }

    if (apellido.value.trim() === "") {
        showError(apellido, "errorApellido", "El apellido es obligatorio");
        valid = false;
    }

    if (!/^[0-9]{7,10}$/.test(telefono.value)) {
        showError(telefono, "errorTelefono", "Número inválido (7-10 dígitos)");
        valid = false;
    }

    if (ciudad.value.trim() === "") {
        showError(ciudad, "errorCiudad", "La ciudad es obligatoria");
        valid = false;
    }

    if (direccion.value.trim() === "") {
        showError(direccion, "errorDireccion", "La dirección es obligatoria");
        valid = false;
    }

    if (!gender) {
        document.getElementById("errorGenero").textContent = "Selecciona un género";
        valid = false;
    }

    if (!valid) return;

    const newContact = {
        nombre: nombre.value,
        apellido: apellido.value,
        telefono: telefono.value,
        ciudad: ciudad.value,
        direccion: direccion.value,
        gender: gender.value
    };

    showLoading();

    setTimeout(() => {
        contacts.push(newContact);
        saveLocal();
        render();
        form.reset();
        hideLoading();
    }, 800);

    showSuccess("Contacto agregado correctamente");
});

function showError(input, errorId, message) {
    input.classList.add("input-error");

    document.getElementById(errorId).innerHTML = `
        <i class="bi bi-exclamation-circle-fill"></i> ${message}
    `;
}

function render() {
    list.innerHTML = "";

    contacts.forEach((c, i) => {

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
                    <i class="bi bi-pencil-square text-warning" onclick="edit(${i})"></i>
                    <i class="bi bi-trash text-danger" onclick="remove(${i})"></i>
                </div>
            </div>
        `;
    });
}


function edit(i) {
    editIndex = i;

    document.getElementById("editName").value = contacts[i].nombre;
    document.getElementById("editLastname").value = contacts[i].apellido;
    document.getElementById("editPhone").value = contacts[i].telefono;
    document.getElementById("editCity").value = contacts[i].ciudad;
    document.getElementById("editAddress").value = contacts[i].direccion;

    new bootstrap.Modal(document.getElementById("editModal")).show();
}

document.getElementById("saveEdit").addEventListener("click", () => {

    const nombre = document.getElementById("editName").value;
    const apellido = document.getElementById("editLastname").value;
    const telefono = document.getElementById("editPhone").value;
    const ciudad = document.getElementById("editCity").value;
    const direccion = document.getElementById("editAddress").value;

    contacts[editIndex] = {
        ...contacts[editIndex],
        nombre,
        apellido,
        telefono,
        ciudad,
        direccion
    };

    saveLocal();
    render();

    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();

    showSuccess("Contacto actualizado correctamente");
});

function showSuccess(message) {
    document.getElementById("successMessage").textContent = message;

    const modal = new bootstrap.Modal(document.getElementById("successModal"));
    modal.show();

    setTimeout(() => {
        modal.hide();
    }, 1500);
}

function remove(i) {
    deleteIndex = i;
    new bootstrap.Modal(document.getElementById("deleteModal")).show();
}

document.getElementById("confirmDelete").addEventListener("click", () => {
    contacts.splice(deleteIndex, 1);
    saveLocal();
    render();
    bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
});


function saveLocal() {
    localStorage.setItem("contacts", JSON.stringify(contacts));
}


function showLoading() {
    loading.classList.remove("d-none");
}

function hideLoading() {
    loading.classList.add("d-none");
}


render();