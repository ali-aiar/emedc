import { Sequelize } from "sequelize";
import db from "../config/db.js";
import Pasien from "./pasien_model.js";
import Data_Klinis from "./dataKlinis_model.js";

const { DataTypes } = Sequelize;

const Klinis_Pasien = db.define('Klinis_Pasien',{},{timestamps: false});

Data_Klinis.belongsToMany(Pasien, { through: Klinis_Pasien });
Pasien.belongsToMany(Data_Klinis, { through: Klinis_Pasien });

export default Klinis_Pasien;