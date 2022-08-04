import { Sequelize } from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const Petugas = db.define('worker',{
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
    kodePegawai:{
        type: DataTypes.STRING
    },
    jenisKelamin:{
        type: DataTypes.STRING
    }
},{
    freezeTableName:true
});

export default Petugas;