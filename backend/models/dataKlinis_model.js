import { Sequelize } from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const Data_Klinis = db.define(
  "dataKlinis",
  {
    noKunjungan: {
      type: DataTypes.STRING,
    },
    keluhan: {
      type: DataTypes.TEXT,
    },
    beratBadan: {
      type: DataTypes.STRING,
    },
    tinggiBadan: {
      type: DataTypes.STRING,
    },
    tekananDarah: {
      type: DataTypes.STRING,
    },
    hasilPemeriksaan: {
      type: DataTypes.TEXT,
    },
    resepDokter: {
      type: DataTypes.TEXT,
    },
    catatanLain: {
      type: DataTypes.TEXT,
    }
    // ,
    // blockchain: {
    //   type: DataTypes.BOOLEAN,
    // }
  },
  {
    freezeTableName: true,
  }
);

export default Data_Klinis;
