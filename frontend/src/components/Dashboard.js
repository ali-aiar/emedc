/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faIdCard } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [modal, setModal] = useState("");
  const [noHP, setNoHP] = useState("");
  const [msg, setMsg] = useState("");
  const [category, setCategory] = useState("");

  const [namePasien, setNamePasien] = useState("");
  const [NIK, setNIK] = useState("");
  const [dokterAssign, setDokterAssign] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [keluhan, setKeluhan] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [tempatLahir, setTempatLahir] = useState("");
  const [alamat, setAlamat] = useState("");
  const [doctor,setDoctor]= useState(null);

  const [users, setPasien] = useState([]);
  const [dokters, setDokters] = useState([]);
  const history = useHistory();

  useEffect(() => {
    refreshToken();
    getUsers();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_ADDR+"/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp);
      setDoctor(decoded.doctor)
    } catch (error) {
      if (error.response) {
        history.push("/");
      }
    }
  };

  const Register = async (e) => {
    e.preventDefault();
    if (jenisKelamin) {
      try {
        await axiosJWT.post(
          process.env.REACT_APP_API_ADDR+"/pendaftaran",
          {
            pasien: {
              nama: namePasien,
              NIK: NIK,
              tanggalLahir: tanggalLahir,
              tempatLahir: tempatLahir,
              jenisKelamin: jenisKelamin,
              alamat: alamat,
              noHP: noHP,
            },
            keluhan: keluhan,
            kodeDokter: dokterAssign,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNamePasien("");
        setNIK("");
        setDokterAssign("");
        setKeluhan("");
        setTanggalLahir("");
        setTempatLahir("");
        setAlamat("");
        setNoHP("");
        setCategory("");
        setModal({
          clicked: false,
        });
        getUsers();
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    }
  };

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
        setDoctor(decoded.doctor)
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getUsers = async () => {
    const response = await axiosJWT.get(process.env.REACT_APP_API_ADDR+"/pasien", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setPasien(response.data);
  };

  const addPasien = async () => {
    setModal({
      clicked: true,
    });
    const response = await axiosJWT.get(process.env.REACT_APP_API_ADDR+"/dokter", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setDokters(response.data);
    getUsers();
  };
  const closeModal = async () => {
    setModal({
      clicked: false,
    });
  };

  return (
    <div className="container mt-5">
      <div className="field is-horizontal">
        <div className="field-body">
          <div className="field">
            <button onClick={getUsers} className="button is-info">
              Get Pasien
            </button>
          </div>
          <button onClick={addPasien} className={doctor ? "button is-info is-hidden":"button is-info "}>
            Add Pasien
          </button>
        </div>{" "}
      </div>
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
                        onChange={(e) => setNamePasien(e.target.value)}
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faUser} />
                      </span>
                    </p>
                  </div>
                  <div className="field">
                    <p className="control is-expanded has-icons-left has-icons-right">
                      <input
                        className="input is-success"
                        type="number"
                        placeholder="NIK"
                        value={NIK}
                        onChange={(e) => setNIK(e.target.value)}
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faIdCard} />
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="field is-horizontal">
                <div className="field-label"></div>
                <div className="field-body">
                  <div className="field is-expanded">
                    <div className="field has-addons">
                      <p className="control">
                        <span className="button is-static">+62</span>
                      </p>
                      <p className="control is-expanded">
                        <input
                          className="input"
                          type="tel"
                          value={noHP}
                          onChange={(e) => setNoHP(e.target.value)}
                          placeholder="Phone number"
                        />
                      </p>
                    </div>
                    <p className="help">Do not enter the first zero</p>
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
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option>Category</option>
                          <option>Penyakit Dalam</option>
                          <option>Anak</option>
                          <option>Saraf</option>
                          <option>Kandungan dan Ginekologi</option>
                          <option>Anak</option>
                          <option>Bedah</option>
                          <option>Kulit dan Kelamin</option>
                          <option>THT</option>
                          <option>Mata</option>
                          <option>Psikiater</option>
                          <option>THT</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="field ">
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select
                          value={dokterAssign}
                          onChange={(e) => setDokterAssign(e.target.value)}
                        >
                          <option>Choose Doctor</option>
                          {dokters
                            .filter((dokter) => {
                              return dokter.spesialisasi === category;
                            })
                            .map((dokter, index) => (
                              <option value={dokter.id}>{dokter.nama}</option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="field is-horizontal">
                <div className="field-label ">
                  <label className="label">Gender</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <div className="control">
                      <label className="radio">
                        <input
                          type="radio"
                          name="member"
                          value="pria"
                          onChange={(e) => setJenisKelamin(e.target.value)}
                        />
                        Male
                      </label>
                      <label className="radio">
                        <input
                          type="radio"
                          name="member"
                          value="wanita"
                          onChange={(e) => setJenisKelamin(e.target.value)}
                        />
                        Female
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">Birth</label>
                </div>
                <div className="field-body">
                  <div className="field is-narrow">
                    <div className="control">
                      <input
                        className="input"
                        type="date"
                        required
                        value={tanggalLahir}
                        onChange={(e) => setTanggalLahir(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="field ">
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        placeholder="City"
                        required
                        value={tempatLahir}
                        onChange={(e) => setTempatLahir(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">Address</label>
                </div>
                <div className="field-body">
                  <div className="field ">
                    <div className="control">
                      <input
                        className="input"
                        type="tetx"
                        required
                        value={alamat}
                        onChange={(e) => setAlamat(e.target.value)}
                      />
                    </div>
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
                        type="tetx"
                        required
                        value={keluhan}
                        onChange={(e) => setKeluhan(e.target.value)}
                      />
                    </div>
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
            <th>Gender</th>
            <th>Phone Number</th>
            <th>Doctor</th>
            <th>Status (Go To)</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.noKunjungan}</td>
              <td>{user.pasiens[0].nama}</td>
              <td>
                {user.pasiens[0].jenisKelamin === "pria" ? "Male" : "Female"}
              </td>
              <td>{user.pasiens[0].noHP}</td>
              <td>{user.dokters[0].nama}</td>
              <td>{user.tinggiBadan !== null ? "Doctor" : "CheckUp"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
