import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import emedc from "../assets/emedc.png";

const Navbar = () => {
  const [chain, setChain] = useState("");
  const [Id, setID] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [name, setName] = useState("");
  const [doctor, setDoctor] = useState("");

  useEffect(() => {
    refreshToken();
    // eslint-disable-next-line
  }, []);

  const history = useHistory();
// console.log(process.env)
  const Logout = async () => {
    try {
      await axios.delete(process.env.REACT_APP_API_ADDR+"/logout");
      history.push("/");
    } catch (error) {
      console.log(error);
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
        setID(decoded.userId);
        setName(decoded.name);
        setExpire(decoded.exp);
        setDoctor(decoded.doctor);
        if (Number(decoded.userId) === 0) {
          setChain("hidden");
        } else setChain("");
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
      setID(decoded.userId);
      setName(decoded.name);
      setExpire(decoded.exp);
      setDoctor(decoded.doctor);

      if (Number(decoded.userId) === 0) {
        setChain({ clicked: true });
      } else setChain({ clicked: false });
    } catch (error) {
      if (error.response) {
        history.push("/");
      }
    }
  };

  return (
    <nav
      className="navbar is-light"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <a className="navbar-item" href="/dashboard">
            <img src={emedc} alt="logo" />
          </a>

          <a
            href="/"
            role="button"
            className="navbar-burger burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <a href="/dashboard" className="navbar-item">
              Dashboard
            </a>
            <a href="/checkup" className="navbar-item">
              CheckUp
            </a>
            <div className={doctor ? "navbar-item " : "navbar-item is-hidden"}>
              <a href="/doctor" className="navbar-item">
                Doctor
              </a>
            </div>

            <div
              className={
                chain.clicked ? "navbar-item " : "navbar-item is-hidden"
              }
            >
              <a href="/admin" className="navbar-item">
                Admin
              </a>
            </div>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <button onClick={Logout} className="button is-light">
                  Log Out ( {name.split(" ")[0]} )
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
