import React, { useState, useEffect } from "react";

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Home } from "./Home";
import { Admin } from "./Admin";
import { Login } from "./Login";

export const NavBar = () => {
  const [adminSession, setAdminSession] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("adminSession");
    setAdminSession(session === "active");
  }, []);

  const comprobarPermisos = () => {
    if (!adminSession) {
      alert(
        "No tienes permisos para acceder a esta página. Inicia sesión como administrador."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("adminSession");
    setAdminSession(false);
    window.location.href = "/";
    alert("Sesión cerrada correctamente.");
  };

  return (
    <BrowserRouter>
      <div>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container">
            <Link className="navbar-brand" to="/">
              <b>SoccerCards</b>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                </li>
              </ul>
              <ul className="navbar-nav ms-auto">
                <li className="nav-item" onClick={comprobarPermisos}>
                  {adminSession ? (
                    <Link className="nav-link" id="adminPageLink" to="/admin">
                      Admin
                    </Link>
                  ) : (
                    <Link className="nav-link" id="adminPageLink" to="">
                      Admin
                    </Link>
                  )}
                </li>
                {adminSession ? (
                  <li className="nav-item">
                    <button className="nav-link btn btn-link" onClick={logout}>
                      Logout
                    </button>
                  </li>
                ) : (
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>
      <div>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/admin" element={<Admin />}></Route>
          <Route path="/" element={<Home />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};
