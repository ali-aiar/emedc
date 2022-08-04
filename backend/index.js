import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/db.js";
import router from "./routes/routes.js";

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

  // await Users.sync();
  // await Petugas.sync();
  // await Dokter.sync();
  // await Pasien.sync();
  // await Data_Klinis.sync();
  // await Klinis_Petugas.sync();
  // await Klinis_Dokter.sync();
  // await Klinis_Pasien.sync();
} catch (error) {
  console.log(error);
}

app.use(cors({ credentials: true, origin: true /* process.env.ORIGIN */ })); //sesuaikan
app.use(cookieParser());
app.use(express.json());
app.use(router);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running at port ${port}`));
