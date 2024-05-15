import React from "react";

export const CartaProductoCarro = (props) => {
    let codigo = props.producto.codigo;
    let descripcion = props.producto.descripcion;
    let imagen = props.producto.imagen;
    let nombre = props.producto.nombre;
    let precio = props.producto.precio;
    let cantidad = props.producto.cantidad;

  return (
    <div id="productoCarrito" className="d-flex">
      <div className="col card">
        <div className="row g-0 justify-content-center" style={{height: "100%"}}>
          <div className="col-4 imagenCarta p-1">
            <img
              className="img-fluid rounded-start"
              src={`${process.env.PUBLIC_URL}${imagen}`}
              alt={nombre}
            />
          </div>
          <div className="col-8 d-flex">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="card-title">{nombre}</h5>
                <small className="text-body-secondary">Item: {codigo}</small>
              </div>
              <p className="card-text">{descripcion}</p>
              <p className="card-text">
                <b>Precio total: </b>{cantidad*precio}€
              </p>
              <div className="d-flex align-items-center justify-content-between">
                <p className="card-text mb-0">
                  <small className="text-body-secondary" id="unidades-Cen2">
                    <b>Unidades: </b>{cantidad} <b>Precio/ud: </b>{precio}€
                  </small>
                </p>
                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => props.removeFromCart(props.producto)}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
