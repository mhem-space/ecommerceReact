import React from 'react'

export const Login = () => {

  const handleSubmit = (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === "admin" && password === "admin") {
      localStorage.setItem("adminSession", "active");
      window.location.href = "/admin";
      alert("Inicio de sesión correcto.");
    } else {
      alert("Usuario o contraseña incorrectos.");
    }
  }

  return (
    <div className="container mt-5 principal p-5" style={{maxWidth:"30%"}}>
        <h2 className="mt-5">Inicio de Sesión</h2>
        <form id="loginForm" onSubmit={handleSubmit} >
          <div className="mb-3">
            <label for="username" className="form-label">Usuario</label>
            <input type="text" className="form-control" id="username" required></input>
          </div>
          <div className="mb-3">
            <label for="password" className="form-label">Contraseña</label>
            <input type="password" className="form-control" id="password" required></input>
          </div>
          <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
        </form>
    </div>
  )
}
