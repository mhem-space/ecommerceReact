import React from "react";

export const CartaProducto = (props) => {
  let codigo = props.producto.codigo;
  let descripcion = props.producto.descripcion;
  let imagen = props.producto.imagen;
  let nombre = props.producto.nombre;
  let precio = props.producto.precio;
  let stock = props.producto.stock;
  return (
    <div id="producto" className="d-flex">
      <div className="col card">
        <div className="row g-0" style={{height: "100%"}}>
          <div className="col-4 imagenCarta p-1">
            <img
              className={`img-fluid rounded-start${props.producto.stock === 0 ? " imagenProductoAgotado" : ""}`}
              src={`${process.env.PUBLIC_URL}${imagen}`}
              id={"imagen-" + codigo}
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
                <b>Precio: </b> {precio}€
              </p>
              <div className="d-flex align-items-center justify-content-between">
                <p className="card-text mb-0">
                  <small className="text-body-secondary" id={`stock-${codigo}`}>
                    <b>Stock: </b>
                    {stock}
                  </small>
                </p>
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm p-1"
                  id={`agregar-${codigo}`}
                  onClick={() => props.addToCart(props.producto)}
                  disabled={props.producto.stock === 0}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
