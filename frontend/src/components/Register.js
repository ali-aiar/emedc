import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [NIK, setNIK] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [tempatLahir, setTempatLahir] = useState("");
  const [kodePegawai, setKodePegawai] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [spesialisasi, setSpesialisasi] = useState("");
  const [msg, setMsg] = useState("");
  const history = useHistory();

  const Register = async (e) => {
    e.preventDefault();
    if (jenisKelamin) {
      try {
        await axios.post(process.env.REACT_APP_API_ADDR+"/users", {
          name: name,
          email: email,
          password: password,
          confirmPassword: confPassword,
          NIK: NIK,
          tanggalLahir: tanggalLahir,
          tempatLahir: tempatLahir,
          kodePegawai: kodePegawai,
          jenisKelamin: jenisKelamin,
          spesialisasi: spesialisasi,
        });
        history.push("/");
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    }
  };

  return (
    <section className="hero has-background-grey-light is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-10-desktop">
              <form onSubmit={Register} className="box">
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
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
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
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <span className="icon is-small is-left">
                          <FontAwesomeIcon icon={faEnvelope} />
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="field is-horizontal">
                  <div className="field-label is-normal">
                    <label className="label">Specialization</label>
                  </div>
                  <div className="field-body">
                    <div className="field is-narrow">
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select
                            value={spesialisasi}
                            onChange={(e) => setSpesialisasi(e.target.value)}
                          >
                            <option>Administrasi/Perawat</option>
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
                    <label className="label">Date of Birth</label>
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
                        ></input>
                      </div>
                    </div>
                    <div className="field-label is-normal">
                      <label className="label">Place of Birth</label>
                    </div>
                    <div className="field">
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
                    <label className="label">NIK</label>
                  </div>
                  <div className="field-body">
                    <div className="field ">
                      <div className="control">
                        <input
                          className="input"
                          type="number"
                          required
                          value={NIK}
                          onChange={(e) => setNIK(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="field-label is-normal">
                      <label className="label">NIP</label>
                    </div>

                    <div className="field ">
                      <div className="control">
                        <input
                          className="input"
                          type="number"
                          required
                          value={kodePegawai}
                          onChange={(e) => setKodePegawai(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="field is-horizontal">
                  <div className="field-label is-normal">
                    <label className="label">Password</label>
                  </div>
                  <div className="field-body">
                    <div className="field is-narrow">
                      <div className="control">
                        <input
                          className="input"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="field-label is-normal">
                      <label className="label">Confirm Password</label>
                    </div>

                    <div className="field ">
                      <div className="control">
                        <input
                          className="input"
                          type="password"
                          required
                          value={confPassword}
                          onChange={(e) => setConfPassword(e.target.value)}
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
