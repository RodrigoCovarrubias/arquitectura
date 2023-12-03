const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require('body-parser');
const webpay = require('./webpay/index')

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.post("/estacionamientos", (req, res) => {
  const id = req.body.idPersona;
  db.all(
    `SELECT idPlaza, direccion, tarifa, descripcion, latitud, longitud, habilitado FROM Estacionamiento e INNER JOIN Plaza p ON p.idEstacionamiento = e.idEstacionamiento WHERE e.idPersona != ${id}`,
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

app.post("/arrendar", (req, res) => {
  const { idPlaza, idPersona, fechaHoraLlegada } = req.body;

  if (!idPlaza || !idPersona || !fechaHoraLlegada) {
    return res.status(400).json({ mensaje: "Se requieren idPlaza, idPersona y fechaHoraLlegada" });
  }

  // const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' '); // Obtiene la fecha y hora actual en formato 'YYYY-MM-DD HH:MM:SS'

  const [fecha, hora] = fechaHoraLlegada.split('T');

  db.run(
    `INSERT INTO ARRIENDO (
      horaLLegada,
      idPlaza,
      idPersona,
      fechaArriendo
    ) VALUES (
      ?,
      ?,
      ?,
      ?
    );`,
    [hora.slice(0, 5), idPlaza, idPersona, fecha],
    (err) => {
      if (err) {
        console.error("Error al arrendar la plaza:", err);
        return res.status(500).json({ mensaje: "Error interno del servidor" });
      }
      else{
        res.json({ mensaje: "Plaza arrendada con éxito" });
        db.run(
          `UPDATE Plaza SET habilitado = 0 WHERE idPlaza = ${idPlaza}`
        )
      }
      
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

app.post("/contar-plazas", (req, res) => {
  const {idPersona} = req.body;
  db.get(
    `SELECT COUNT(*) as cantidadPlazas
     FROM Plaza p
     INNER JOIN Estacionamiento e ON p.idEstacionamiento = e.idEstacionamiento
     WHERE p.habilitado = 1
     AND e.idPersona != ${idPersona}`,
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

app.post("/info/estacionamientos", (req, res) => {
  const { idPersona } = req.body;

  if (!idPersona) {
    return res.status(400).json({ mensaje: "Se requiere el ID de Persona" });
  }

  db.all(
    `SELECT e.descripcion, e.direccion, e.tarifa, p.alto, p.ancho, p.largo, a.horaLlegada, a.idArriendo, p.idPlaza
    FROM Estacionamiento e
    INNER JOIN Plaza p ON e.idEstacionamiento = p.idEstacionamiento
    INNER JOIN Arriendo a ON p.idPlaza = a.idPlaza
    WHERE a.idPersona = ${idPersona}
    AND a.horaSalida IS NULL`,
    (err, rows) => {
      if (err) {
        console.error("Error al obtener la información del estacionamiento:", err);
        return res.status(500).json({ mensaje: "Error interno del servidor" });
      }
      res.json({ infoEstacionamiento: rows });
    }
  );
});

app.post("/liberar/plaza", async (req, res) => {
  const idPlaza = req.body.idPlaza;
  db.run(
    `UPDATE Plaza SET habilitado = 1 WHERE idPlaza = ${idPlaza}`,
    [],
    async (err) => {
      if (err) {
        console.error("Error al liberar la plaza:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }
    }
  );
});

app.post("/persona/info", (req, res) => {
  const { email } = req.body;

  db.get(`SELECT idPersona, nombre, rut, paterno, email, fechaNacimiento FROM Persona WHERE email = '${email}'`, [], (err, row) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }
    res.json({ datosPersonales: row });
  });
});

app.post("/finalizar/arriendo", (req, res) => {
  const { idArriendo, horaSalida } = req.body;

  // Utilizando placeholders para evitar SQL Injection
  db.run("UPDATE Arriendo SET horaSalida = ? WHERE idArriendo = ?", [horaSalida, idArriendo], function (err) {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      res.status(500).send("Error interno del servidor");
      return res;
    }
    res.json({ mensaje: "Finalizado con exito" });
  });
});

app.post("/arriendo/pagar", async (req, res) => {
  const idPlaza = req.body.idPlaza;
  const monto = req.body.monto;
  const idArriendo = req.body.idArriendo;
  const horaSalida = req.body.horaSalida;

  const urlRetorno = `${req.protocol}://${req.get("host")}/webpay/confirmar`;

  const webpayData = await webpay.crearTransaccionWebpay(urlRetorno, monto)

  db.run("INSERT INTO transacciones_pago VALUES(?,?,?,?,?,?)", [webpayData.token, webpayData.buyOrder, idPlaza, idArriendo, horaSalida, monto], function (err) {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      res.status(500).send("Error interno del servidor");
      return res;
    }
    res.json({ 
      urlWebpay: webpayData.urlWebpay,
      tokenWebpay: webpayData.token
    });
  });
})

app.get("/webpay/confirmar", async (req, res) => {
  const token = req.query.token_ws;
  const tbkToken = req.query.TBK_TOKEN;
  const tbkOrdenCompra = req.query.TBK_ORDEN_COMPRA;
  const tbkIdSesion = req.query.TBK_ID_SESION;

  if (token && !tbkToken) {
    db.get(`SELECT * FROM transacciones_pago WHERE token = ?`, [token], async (err, transaccion) => {
      if (err) {
        console.error("Error al ejecutar la consulta:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }
      const respuestaConfirmacion = await webpay.confirmarTransaccion(token)
  
      const urlExito = `http://localhost:3000/pago/exito?monto=${respuestaConfirmacion.amount}&fechaTransaccion=${respuestaConfirmacion.transaction_date}&codigoAutorizacion=${respuestaConfirmacion.authorization_code}`
    
      db.run("UPDATE Arriendo SET horaSalida = ? WHERE idArriendo = ?", [transaccion.horaSalida, transaccion.idArriendo], function (err) {
        if (err) {
          console.error("Error al ejecutar la consulta:", err);
          res.status(500).send("Error interno del servidor");
          return res;
        }
        
        db.run(
          `UPDATE Plaza SET habilitado = 1 WHERE idPlaza = ?`,
          [transaccion.idPlaza],
          async (err) => {
            if (err) {
              console.error("Error al liberar la plaza:", err);
              res.status(500).send("Error interno del servidor");
              return;
            }
            res.redirect(urlExito)
          }
        )
  
      });
    });  
  } else {
    let motivo = ""
    if (!tbkToken) {
      motivo = "El pago fue anulado por tiempo de espera.";
    }
    else if (tbkToken && tbkOrdenCompra && tbkIdSesion) {
      motivo = "El pago fue anulado por el usuario.";
    }
    else {
      motivo = "El pago es inválido.";
    }
  
    const urlFallido = `http://localhost:3000/pago/fallido?motivo=${motivo}&ordenCompra=${tbkOrdenCompra}`
    res.redirect(urlFallido)
  }
})

const puerto = 8091;
app.listen(puerto, () => {
  console.log(`El servidor está corriendo en http://localhost:${puerto}`);
});
