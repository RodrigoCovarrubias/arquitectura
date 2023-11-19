const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());

const db = new sqlite3.Database(
  "../base-de-datos/arquitectura.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.log(err.message);
    }
    else{
      console.log('CONEXION CON EXITO')
    }
  }
);

app.get("/estacionamientos", (req, res) => {
  db.all(
    "SELECT idPlaza, direccion, tarifa, descripcion, latitud, longitud, habilitado FROM Estacionamiento e INNER JOIN Plaza p ON p.idEstacionamiento = e.idEstacionamiento;",
    [],
    (err, rows) => {
      if (err) {
        console.error("Error al ejecutar la consulta:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }
      res.json({ estacionamientos: rows });
    }
  );
});

app.get("/datos-personales", (req, res) => {
  db.all("SELECT * FROM Persona", [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ datosPersonales: rows });
  });
});

app.get("/datos-personales/:id", (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM Persona WHERE idPersona = ${id}`, [], (err, row) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }
    res.json({ datosPersonales: row });
  });
});

app.get("/plaza/:idPlaza/habilitado", (req, res) => {
  const idPlaza = req.params.idPlaza;
  db.get(
    `SELECT habilitado FROM Estacionamiento e INNER JOIN Plaza p ON p.idEstacionamiento = e.idEstacionamiento WHERE p.idPlaza = ${idPlaza}`,
    [],
    (err, row) => {
      if (err) {
        console.error("Error al verificar disponibilidad de la plaza:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }
      if (!row) {
        res.status(404).json({ mensaje: "Plaza no encontrada" });
        return;
      }
      res.json({ habilitado: row.habilitado });
    }
  );
});

app.post("/plaza/:idPlaza/arrendar/:idPersona", (req, res) => {
  const idPlaza = req.params.idPlaza;
  const idPersona = req.params.idPersona;
  db.run(
    `UPDATE Plaza SET habilitado = 0, idPersona = ${idPersona} WHERE idPlaza = ${idPlaza}`,
    [],
    (err) => {
      if (err) {
        console.error("Error al arrendar la plaza:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }
      res.json({ mensaje: "Plaza arrendada con éxito" });
    }
  );
});

app.get("/arriendos", (req, res) => {
  db.all(
    `SELECT a.*
     FROM Arriendo a
     INNER JOIN Persona p ON a.idPersona = p.idPersona`,
    [],
    (err, rows) => {
      if (err) {
        console.error("Error al obtener los arriendos:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }
      res.json({ arriendos: rows });
    }
  );
});

app.get("/contar-plazas", (req, res) => {
  db.get(
    `SELECT COUNT(*) as cantidadPlazas
     FROM Plaza p
     INNER JOIN Estacionamiento e ON p.idEstacionamiento = e.idEstacionamiento
     WHERE p.habilitado = 1`,
    [],
    (err, row) => {
      if (err) {
        console.error("Error al obtener la cantidad de plazas:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }
      res.json({ cantidadPlazas: row.cantidadPlazas });
    }
  );
});

app.get("/info-estacionamientos/:idPersona", (req, res) => {
  const idPersona = req.params.idPersona;
  db.all(
    `SELECT e.descripcion, e.direccion, e.tarifa, p.alto, p.ancho, p.largo
     FROM Estacionamiento e
     INNER JOIN Plaza p ON e.idEstacionamiento = p.idEstacionamiento
     INNER JOIN Persona per ON per.idPersona = p.idPersona
     WHERE per.idPersona = ${idPersona}`,
    [],
    (err, rows) => {
      if (err) {
        console.error("Error al obtener la información del estacionamiento:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }
      res.json({ infoEstacionamiento: rows });
    }
  );
});

app.post("/liberar-plaza/:idPlaza", (req, res) => {
  const idPlaza = req.params.idPlaza;
  db.run(
    `UPDATE Plaza SET habilitado = 1, idPersona = null WHERE idPlaza = ${idPlaza}`,
    [],
    (err) => {
      if (err) {
        console.error("Error al liberar la plaza:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }
      res.json({ mensaje: "Plaza liberada con éxito" });
    }
  );
});

const puerto = 3000;
app.listen(puerto, () => {
  console.log(`El servidor está corriendo en http://localhost:${puerto}`);
});
