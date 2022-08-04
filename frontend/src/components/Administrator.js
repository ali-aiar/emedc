import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";

const Administrator = () => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [users, setUsers] = useState([]);

  const history = useHistory();
  useEffect(() => {
    refreshToken();
    getUsers();
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

  const getUsers = async () => {
    const response = await axiosJWT.get(process.env.REACT_APP_API_ADDR+"/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data)
    setUsers(response.data);
  };

  const setHandler = async (e) => {
    e.preventDefault();
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === Number(e.target.value)) {
        try {
          await axiosJWT.patch(
            process.env.REACT_APP_API_ADDR+"/grant",
            {
              grantedId: !users[i].granted,
              userId: e.target.value,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          e.target.className = users[i].granted
            ? "button is-danger"
            : "button is-success";
          getUsers();
        } catch (error) {
          console.log(error);
        }
        break;
      }
    }
  };

  return (
    <div className="container mt-5">
      <button onClick={getUsers} className="button is-info">
        Get Users
      </button>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>Id</th>
            <th>Email</th>
            <th>Name</th>
            <th>NIP</th>
            <th>Specialization</th>
            <th>Granted Access</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((a) => {
              return a.id;
            })
            .sort((a, b) => (a.id > b.id ? 1 : -1))
            .map((user, index) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>
                  {user.worker
                    ? user.worker.kodePegawai
                    : user.dokter.kodePegawai}
                </td>
                <td>
                  {user.worker
                    ? "Administrasi/Perawat"
                    : user.dokter.spesialisasi}
                </td>
                <td>
                  <button
                    value={user.id}
                    onClick={setHandler}
                    className={
                      user.granted ? "button is-success" : "button is-danger"
                    }
                  >
                    {user.granted ? "Granted" : "Pending"}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Administrator;
