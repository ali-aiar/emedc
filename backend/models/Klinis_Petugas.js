import { Sequelize } from "sequelize";
import db from "../config/db.js";
import Petugas from "./petugas_model.js";
import Data_Klinis from "./dataKlinis_model.js";

const { DataTypes } = Sequelize;

const Klinis_Petugas = db.define(
  "Klinis_Petugas",
  {
    bagian: { type: DataTypes.STRING },
  },
  { timestamps: false }
);

Data_Klinis.belongsToMany(Petugas, { through: Klinis_Petugas });
Petugas.belongsToMany(Data_Klinis, { through: Klinis_Petugas });

export default Klinis_Petugas;
