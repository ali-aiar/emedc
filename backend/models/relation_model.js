// // import { Sequelize } from "sequelize";
// // import db from "../config/db.js";
// import Users from "./users_model.js";
// import Petugas from "./petugas_model.js";
// import Dokter from "./dokter_model.js";
// import Pasien from "./pasien_model.js";
// import Data_Klinis from "./dataKlinis_model.js";

// // const { DataTypes } = Sequelize;

// Petugas.belongsTo(Users);
// Dokter.belongsTo(Users)
// // Users.hasOne(Petugas);
// // Users.hasOne(Dokter);

// Data_Klinis.belongsToMany(Petugas, { through: 'Klinis_Petugas' });
// Petugas.belongsToMany(Data_Klinis, { through: 'Klinis_Petugas' });

// Data_Klinis.belongsToMany(Dokter, { through: 'Klinis_Dokter' });
// Dokter.belongsToMany(Data_Klinis, { through: 'Klinis_Dokter' });

// Data_Klinis.belongsToMany(Pasien, { through: 'Klinis_Pasien' });
// Pasien.belongsToMany(Data_Klinis, { through: 'Klinis_Pasien' });

// export {Users,Pasien,Petugas,Dokter,Data_Klinis};