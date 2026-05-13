const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "lista_de_contactos",
    port: 3307
});

connection.connect((err) => {

    if (err) {
        console.log("Error de conexión:", err);
        return;
    }

    console.log("Conectado a MySQL");
});

module.exports = connection;