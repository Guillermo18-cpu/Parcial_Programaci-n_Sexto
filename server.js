const express = require("express");
const cors = require("cors");

const db = require("./bdd");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;


app.get("/api/contacts", (req, res) => {

    const sql = "SELECT * FROM contacts";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
});


app.post("/api/contacts", (req, res) => {

    const {
        nombre,
        apellido,
        telefono,
        ciudad,
        direccion,
        gender
    } = req.body;

    const sql = `
        INSERT INTO contacts
        (nombre, apellido, telefono, ciudad, direccion, gender)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [nombre, apellido, telefono, ciudad, direccion, gender],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Contacto agregado",
                id: result.insertId
            });
        }
    );
});


app.put("/api/contacts/:id", (req, res) => {

    const { id } = req.params;

    const {
        nombre,
        apellido,
        telefono,
        ciudad,
        direccion,
        gender
    } = req.body;

    const sql = `
        UPDATE contacts
        SET
            nombre = ?,
            apellido = ?,
            telefono = ?,
            ciudad = ?,
            direccion = ?,
            gender = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            nombre,
            apellido,
            telefono,
            ciudad,
            direccion,
            gender,
            id
        ],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Contacto actualizado"
            });
        }
    );
});


app.delete("/api/contacts/:id", (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM contacts WHERE id = ?";

    db.query(sql, [id], (err) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Contacto eliminado"
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});