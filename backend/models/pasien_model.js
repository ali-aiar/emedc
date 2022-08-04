import { Sequelize } from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const Pasien = db.define('pasien',{
    nama:{
        type: DataTypes.STRING
    },
    NIK:{
        type: DataTypes.STRING
    },
    tanggalLahir:{
        type: DataTypes.DATE
    },
    tempatLahir:{
        type: DataTypes.STRING
    },
    jenisKelamin:{
        type: DataTypes.STRING
    },
    alamat:{
        type: DataTypes.TEXT
    },
    noHP:{
        type: DataTypes.STRING
    }
},{
    freezeTableName:true
});

export default Pasien;