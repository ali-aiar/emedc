import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Pemeriksaan = () => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");

  const [pasiens, setPasien] = useState([]);
  const [modal, setModal] = useState("");
  const [tinggi, setTinggi] = useState("");
  const [msg, setMsg] = useState("");
  const [berat, setBerat] = useState("");

  const [namePasien, setNamePasien] = useState("");
  const [usia, setUsia] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [dokterAssign, setDokterAssign] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [keluhan, setKeluhan] = useState("");
  const [noKunjungan, setNoKunjungan] = useState("");
  const [hasilPemeriksaan, setHasilPemeriksaan] = useState("");
  const [resepDokter, setResepDokter] = useState("");
  const [catatanLain, setCatatanLain] = useState("");


  const history = useHistory();

  useEffect(() => {
    refreshToken();
    getPasiens();
    // eslint-disable-next-line
  }, []);

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get(process.env.REACT_APP_API_ADDR+"/token");
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setName(decoded.name);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const refreshToken = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_ADDR+"/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        history.push("/");
      }
    }
  };

  const getPasiens = async () => {
    const response = await axiosJWT.get(process.env.REACT_APP_API_ADDR+"/pasiens", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data)
    setPasien(response.data);
  };

  const addPasien = async (e) => {
    setModal({
      clicked: true,
    });
    for (let i = 0; i < pasiens.length; i++) {
        if (pasiens[i].id === Number(e.target.value)) {
          setNamePasien(pasiens[i].pasiens[0].nama);
          setUsia(
            new Date(Date.now()).getFullYear() -
              new Date(pasiens[i].pasiens[0].tanggalLahir).getFullYear()
          );
          setKeluhan(pasiens[i].keluhan);
          setDokterAssign(pasiens[i].dokters[0].nama);
          setJenisKelamin(
            pasiens[i].pasiens[0].jenisKelamin === "pria" ? "Male" : "Female"
          );
          setNoKunjungan(pasiens[i].noKunjungan);
          setTinggi(pasiens[i].tinggiBadan)
          setBerat(pasiens[i].beratBadan)
          setBloodPressure(pasiens[i].tekananDarah)
          return;
        }
      }
   
  };
  const closeModal = async () => {
    setModal({
      clicked: false,
    });
  };

  const Register = async (e) => {
    e.preventDefault();
    try {
        await axiosJWT.patch(
          process.env.REACT_APP_API_ADDR+"/pemeriksaan",
          {
            noKunjungan: noKunjungan,
            hasilPemeriksaan: hasilPemeriksaan,
            resepDokter: resepDokter,
            catatanLain: catatanLain,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHasilPemeriksaan("");
      setResepDokter("");
      setCatatanLain("");
      getPasiens();
        setModal({
            clicked: false,
          });
  }  catch (error) {
    if (error.response) {
      setMsg(error.response.data.msg);
    }
  }
  }
  return (
    <div className="container mt-5">
       <div className="field-body">
                  <div className="field">
      <button onClick={getPasiens} className="button is-info">
        Get Users
      </button></div></div>

      <div className={modal.clicked ? "modal is-active" : "modal"}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Patient Registration</p>
            <button
              className="delete"
              id="closetop"
              aria-label="close"
              onClick={closeModal}
            ></button>
          </header>
          <section className="modal-card-body">
            <form onSubmit={Register}>
              <p className="has-text-centered">{msg}</p>
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">From</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <p className="control is-expanded has-icons-left">
                      <input
                        className="input"
                        type="text"
                        placeholder="Name"
                        value={namePasien}
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faUser} />
                      </span>
                    </p>
                  </div>
                  <div className="field has-addons is-narrow">
                    <p className="control is-expanded">
                      <input
                        className="input is-success"
                        type="text"
                        placeholder="Age"
                        value={usia}
                      />
                    </p>
                    <p className="control">
                      <span className="button is-static">years old</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">Illness</label>
                </div>
                <div className="field-body">
                  <div className="field ">
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        required
                        value={keluhan}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <div className="control">
                      <label className="radio">
                        <input type="radio" name="member" checked="checked" />
                        {jenisKelamin}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">Doctor</label>
                </div>
                <div className="field-body">
                  <div className="field is-narrow">
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select>
                          <option>{dokterAssign}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">Height and Weight</label>
                </div>
                <div className="field-body">
                  <div className="field has-addons is-narrow">
                    <p className="control is-expanded">
                      <input
                        className="input is-success"
                        type="number"
                        placeholder="Height"
                        value={tinggi}
                        required
                      />
                    </p>
                    <p className="control">
                      <span className="button is-static">Cm</span>
                    </p>
                  </div>
                  <div className="field has-addons is-narrow">
                    <p className="control is-expanded">
                      <input
                        className="input is-success"
                        type="number"
                        placeholder="Weight"
                        value={berat}
                        required
                      />
                    </p>
                    <p className="control">
                      <span className="button is-static">Kg</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">Blood Pressure</label>
                </div>
                <div className="field-body">
                  <div className="field has-addons is-narrow">
                    <p className="control is-expanded">
                      <input
                        className="input is-success"
                        type="text"
                        placeholder="diastole/sistole"
                        value={bloodPressure}
                        required
                      />
                    </p>
                    <p className="control">
                      <span className="button is-static">mmHg</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">Result</label>
                </div>
                <div className="field-body">
                  <div className="field  ">
                    <p className="control is-expanded">
                    <textarea className="textarea is-fullwidth" placeholder="Diagnosis" rows="2" value={hasilPemeriksaan}
                     onChange={(e) => setHasilPemeriksaan(e.target.value)} required></textarea>
                    </p>
                  </div>
                </div>
              </div>

              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">Prescription</label>
                </div>
                <div className="field-body">
                  <div className="field  ">
                    <p className="control is-expanded">
                    <textarea className="textarea is-fullwidth" placeholder="Treatment/Prescription" rows="2" value={resepDokter}
                     onChange={(e) => setResepDokter(e.target.value)} required></textarea>
                    </p>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">Notes</label>
                </div>
                <div className="field-body">
                  <div className="field  ">
                    <p className="control is-expanded">
                    <textarea className="textarea is-fullwidth" placeholder="Other Notes" rows="2" value={catatanLain}
                     onChange={(e) => setCatatanLain(e.target.value)} required></textarea>
                    </p>
                  </div>
                </div>
              </div>

              <div className="field mt-5">
                <button className="button is-success is-fullwidth">
                  Register
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>Visit ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Illness</th>
            <th>Doctor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pasiens
            .filter((a) => {
              return !a.hasilPemeriksaan  && a.tinggiBadan !== null;
            })
            .map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.noKunjungan}</td>
                <td>{user.pasiens[0].nama}</td>
                <td>
                  {new Date(Date.now()).getFullYear() -
                    new Date(user.pasiens[0].tanggalLahir).getFullYear()}
                </td>
                <td>
                  {user.pasiens[0].jenisKelamin === "pria" ? "Male" : "Female"}
                </td>
                <td>{user.keluhan}</td>
                <td>{user.dokters[0].nama}</td>
                <td>
                  <button value={user.id} onClick={addPasien} className="button is-success is-small">
                  Treat
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
export default Pemeriksaan;
