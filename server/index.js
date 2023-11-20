const config = require("./src/config");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const { getEdr, rutaLlamada } = require("./src/controllers/estadoDeResultado");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");

  next();
});

//-------------------- Programar para que se haga automaticamente el estado de resultado --------------------------------//

const tarea = cron.schedule("50 23 * * *", () => {
  // Aca se programa para que la tarea se ejecute a las 11:50pm todos los dias si no se llama la ruta
  if (!rutaLlamada) {
    getEdr();
  } else {
    tarea.stop();
  }
});

// Tarea para restablecer la rutaLlamada al inicio del dia
cron.schedule("0 0 0 * * *", () => {
  rutaLlamada = false;
}); // Aca se programa para que la tarea se ejecute a las 12:00am todos los dias

//-----------------------------------------------------------------------------------------------------------------------//

app.use(morgan("dev"));
app.use("/api", require("./src/routes"));

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
