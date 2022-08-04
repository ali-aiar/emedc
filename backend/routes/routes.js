import express from "express";
import {
  getPasien,
  register,
  login,
  logout,
  getDokter,
  getAllDataPasien,
  getAllDataKlinis,
  getAllUsers,
  giveGrant,
} from "../controller/users.js";
import { verifyToken } from "../middleware/verify_token.js";
import { refreshToken } from "../controller/refresh_token.js";
import {
  checkUp,
  pendaftaran,
  dokter,
} from "../controller/klinis.js";

const router = express.Router();

router.get("/pasien", verifyToken, getPasien);
router.post("/users", register);
router.post("/login", login);
router.get("/token", refreshToken);
router.delete("/logout", logout);
router.post("/pendaftaran", verifyToken, pendaftaran);
router.patch("/checkup", verifyToken, checkUp);
router.patch("/pemeriksaan", verifyToken, dokter);
router.get("/dokter", verifyToken, getDokter);
router.get("/pasiens", verifyToken, getAllDataPasien);
router.get("/data-klinis", verifyToken, getAllDataKlinis);
// router.patch("/upload-chain", verifyToken, chainUpdate);
router.patch("/grant", verifyToken, giveGrant);
router.get("/users", verifyToken, getAllUsers);

export default router;
