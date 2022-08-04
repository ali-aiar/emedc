import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/db.js";
import router from "./routes/routes.js";
import Users from "./models/users_model.js";
import Petugas from "./models/petugas_model.js";
import Dokter from "./models/dokter_model.js";
import Pasien from "./models/pasien_model.js";
import Data_Klinis from "./models/dataKlinis_model.js";
import Klinis_Petugas from "./models/Klinis_Petugas.js";
import Klinis_Dokter from "./models/Klinis_Dokter.js";
import Klinis_Pasien from "./models/Klinis_Pasien.js";

dotenv.config();

const app = express();

try {
  db.authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });

  Users.sync()
    .then(() => {})
    .catch((err) => {});
  Petugas.sync()
    .then(() => {})
    .catch((err) => {});
  Dokter.sync()
    .then(() => {})
    .catch((err) => {});
  Pasien.sync()
    .then(() => {})
    .catch((err) => {});
  Data_Klinis.sync()
    .then(() => {})
    .catch((err) => {});
  Klinis_Petugas.sync()
    .then(() => {})
    .catch((err) => {});
  Klinis_Dokter.sync()
    .then(() => {})
    .catch((err) => {});
  Klinis_Pasien.sync()
    .then(() => {})
    .catch((err) => {});

} catch (error) {
  console.log(error);
}

app.use(cors({ credentials: true, origin: process.env.ORIGIN })); //sesuaikan
app.use(cookieParser());
app.use(express.json());
app.use(router);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running at port ${port}`));
