import Data_Klinis from "../models/dataKlinis_model.js";
import Pasien from "../models/pasien_model.js";
import Dokter from "../models/dokter_model.js";
import Users from "../models/users_model.js";
import Klinis_Petugas from "../models/Klinis_Petugas.js";
import Klinis_Pasien from "../models/Klinis_Pasien.js";
import Klinis_Dokter from "../models/Klinis_Dokter.js";

export const pendaftaran = async (req, res) => {
  const {
    pasien: {
      nama,
      NIK,
      tanggalLahir,
      tempatLahir,
      jenisKelamin,
      alamat,
      noHP,
    },
    keluhan,
    kodeDokter,
  } = req.body;

  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
    include: { all: true },
  });

  if (!user[0]) return res.sendStatus(204);
  // console.log(user);
  try {
    const userId = user[0].worker.id;

    const dokter = await Dokter.findAll({
      where: {
        id: kodeDokter,
      },
    });

    let noKunjungan;
    const date = new Date();
    const kunjunganDate =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2);

    const latestKlinis = await Data_Klinis.findAll({
      limit: 1,
      where: {},
      order: [["createdAt", "DESC"]],
    });
    // console.log(latestKlinis);
    const latestKlinisDate = !latestKlinis.length
      ? ""
      : latestKlinis[0].noKunjungan.substr(
          0,
          latestKlinis[0].noKunjungan.length - 4
        );

    if (latestKlinisDate == kunjunganDate) {
      const countKlinis = (
        "000" + String(Number(latestKlinis[0].noKunjungan.slice(-4)) + 1)
      ).slice(-4);
      noKunjungan = kunjunganDate + countKlinis;
    } else {
      noKunjungan = kunjunganDate + "0001";
    }

    const klinis1 = await Data_Klinis.create({
      noKunjungan: noKunjungan,
      keluhan: keluhan,
    });
    const peserta = await updateOrCreate(
      Pasien,
      { NIK: NIK },
      {
        nama: nama,
        NIK: NIK,
        tanggalLahir: tanggalLahir,
        tempatLahir: tempatLahir,
        jenisKelamin: jenisKelamin,
        alamat: alamat,
        noHP: noHP,
      }
    );

    const petugasKlinis = await Klinis_Petugas.create({
      workerId: userId,
      dataKliniId: klinis1.id,
      bagian: "Pendaftaran",
    });
    const pesertaKlinis = await Klinis_Pasien.create({
      pasienId: peserta.item.id,
      dataKliniId: klinis1.id,
    });
    const dokterAssign = await Klinis_Dokter.create({
      dokterId: dokter[0].id,
      dataKliniId: klinis1.id,
    });
    res.json({ peserta, klinis1 });
  } catch (error) {
    console.log(error);
  }
};

export const checkUp = async (req, res) => {
  const { noKunjungan, beratBadan, tinggiBadan, tekananDarah } = req.body;

  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
    include: { all: true },
  });

  if (!user[0]) return res.sendStatus(204);
  // console.log(user);
  const userId = user[0].worker.id;

  try {
    await Data_Klinis.update(
      {
        beratBadan: beratBadan,
        tinggiBadan: tinggiBadan,
        tekananDarah: tekananDarah,
      },
      { where: { noKunjungan: noKunjungan } }
    );

    const klinis2 = await Data_Klinis.findOne({
      where: { noKunjungan: noKunjungan },
    });

    const petugasCheckUp = await Klinis_Petugas.create({
      workerId: userId,
      dataKliniId: klinis2.id,
      bagian: "Check-Up",
    });
    res.json({ klinis2 });
  } catch (error) {
    console.log(error);
  }
};

export const dokter = async (req, res) => {
  const { noKunjungan, hasilPemeriksaan, resepDokter, catatanLain } = req.body;

  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
    include: { all: true },
  });

  if (!user[0]) return res.sendStatus(204);

  try {
    const userId = user[0].dokter.id;
  } catch (error) {
    return res.sendStatus(403);
  }

  try {
    const klinis3 = await Data_Klinis.update(
      {
        hasilPemeriksaan: hasilPemeriksaan,
        resepDokter: resepDokter,
        catatanLain: catatanLain,
      },
      { where: { noKunjungan: noKunjungan } }
    );
    const laporan = await Data_Klinis.findAll({
      where: {
        noKunjungan: noKunjungan,
      },
      include: { all: true },
    });
    res.json(laporan);
  } catch (error) {
    console.log(error);
  }
};

// export const chainUpdate = async (req, res) => {
//   const { noKunjungan, blockChainStatus } = req.body;

//   const refreshToken = req.cookies.refreshToken;
//   if (!refreshToken) return res.sendStatus(204);
//   const user = await Users.findAll({
//     where: {
//       refresh_token: refreshToken,
//     },
//     include: { all: true },
//   });

//   if (!user[0]) return res.sendStatus(204);

//   try {
//     const userId = user[0].id;
//     console.log(userId);
//     if (userId) return res.sendStatus(403);
//   } catch (error) {
//     return res.sendStatus(403);
//   }

//   try {
//     const chain = await Data_Klinis.update(
//       {
//         blockchain: blockChainStatus,
//       },
//       { where: { noKunjungan: noKunjungan } }
//     );

//     res.json(chain);
//   } catch (error) {
//     console.log(error);
//   }
// };

async function updateOrCreate(model, where, newItem) {
  const foundItem = await model.findOne({ where });
  if (!foundItem) {
    const item = await model.create(newItem);
    return { item, created: true };
  }
  await model.update(newItem, { where });
  const item = await model.findOne({ where });
  return { item, created: false };
}
