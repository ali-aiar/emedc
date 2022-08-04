import { Sequelize } from "sequelize";
import db from "../config/db.js";
import Petugas from "./petugas_model.js";
import Dokter from "./dokter_model.js";

const { DataTypes } = Sequelize;

const Users = db.define('users',{
    name:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING
    },
    password:{
        type: DataTypes.STRING
    },
    granted:{
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    refresh_token:{
        type: DataTypes.TEXT
    }
},{
    freezeTableName:true
});

Users.hasOne(Dokter);
Users.hasOne(Petugas);

export default Users;