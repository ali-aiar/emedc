import { Sequelize } from "sequelize";
import db from "../config/db.js";
import Dokter from "./dokter_model.js";
import Data_Klinis from "./dataKlinis_model.js";

const { DataTypes } = Sequelize;

const Klinis_Dokter = db.define('Klinis_Dokter',{},{timestamps: false});

Data_Klinis.belongsToMany(Dokter, { through: Klinis_Dokter });
Dokter.belongsToMany(Data_Klinis, { through: Klinis_Dokter });

export default Klinis_Dokter;