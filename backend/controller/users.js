import Users from "../models/users_model.js";
import Dokter from "../models/dokter_model.js";
import Petugas from "../models/petugas_model.js";
import Pasien from "../models/pasien_model.js";
import Data_Klinis from "../models/dataKlinis_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getPasien = async (req, res) => {
  try {
    const users = await Data_Klinis.findAll({
      where: {
        hasilPemeriksaan: null,
      },
      attributes: ["id", "noKunjungan", "keluhan", "tinggiBadan"],
      include: [
        {
          model: Pasien,
          attributes: ["nama", "noHP", "jenisKelamin", "tanggalLahir"],
        },
        { model: Dokter, attributes: ["nama"] },
      ],
    });

    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const getAllUsers = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
      include: { all: true },
    });

    if (!user[0].id) {
      const users = await Users.findAll({
        include: { all: true },
      });

      res.json(users);
    }else  res.sendStatus(403);
  } catch (error) {
    console.log(error);
  }
};

export const giveGrant = async (req, res) => {
  const { userId, grantedId } = req.body;

  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
    include: { all: true },
  });

  if (!user[0]) return res.sendStatus(204);
  const grant = await Users.update(
    {
      granted: grantedId,
    },
    { where: { id: userId } }
  );
  res.sendStatus(200);
};

export const getAllDataKlinis = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
      include: { all: true },
    });

    if (!user[0].id) {
      const users = await Data_Klinis.findAll({
        include: { all: true },
      });

      res.json(users);
    }else res.sendStatus(403);
  } catch (error) {
    console.log(error);
  }
};

export const getAllDataPasien = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
      include: { all: true },
    });

    if (user[0].dokter) {
      const dokterId = user[0].dokter.id;
      const users = await Data_Klinis.findAll({
        include: [
          {
            model: Pasien,
            attributes: ["nama", "noHP", "jenisKelamin", "tanggalLahir"],
          },
          {
            model: Dokter,
            attributes: ['nama'],
            through: {
              where: {
                dokterId: dokterId,
              },
            },
          },
        ],
      });

      res.json(users);
    }else res.sendStatus(403);
  } catch (error) {
    console.log(error);
  }
};

export const getDokter = async (req, res) => {
  try {
    const users = await Dokter.findAll({
      attributes: ["id", "nama", "spesialisasi"],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const register = async (req, res) => {
  const {
    name,
    email,
    password,
    confirmPassword,
    NIK,
    tanggalLahir,
    tempatLahir,
    kodePegawai,
    jenisKelamin,
    spesialisasi,
  } = req.body;
  if (password != confirmPassword) {
    return res
      .status(400)
      .json({ msg: "Password and confirmation password are not the same" });
  }

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    if (spesialisasi) {
      await Users.create(
        {
          name: name,
          email: email,
          password: hashPassword,
          dokter: {
            nama: name,
            NIK: NIK,
            tanggalLahir: tanggalLahir,
            tempatLahir: tempatLahir,
            kodePegawai: kodePegawai,
            spesialisasi: spesialisasi,
            jenisKelamin: jenisKelamin,
          },
        },
        { include: Dokter }
      );
    } else {
      await Users.create(
        {
          name: name,
          email: email,
          password: hashPassword,
          worker: {
            nama: name,
            NIK: NIK,
            tanggalLahir: tanggalLahir,
            tempatLahir: tempatLahir,
            kodePegawai: kodePegawai,
            jenisKelamin: jenisKelamin,
          },
        },
        { include: Petugas }
      );
    }

    res.json({ msg: "Account has been created" });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
        granted: 1,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });
    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;
    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "1800s",
      }
    );
    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: "1d",
      }
    );
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "Email not found" });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};
