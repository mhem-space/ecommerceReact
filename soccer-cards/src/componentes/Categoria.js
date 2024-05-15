import React from "react";
import { CartaProducto } from "./CartaProducto";

export const Categoria = (props) => {
  let nombreCategoria = props.nombreCategoria;
  nombreCategoria =
    nombreCategoria.charAt(0).toUpperCase() +
    nombreCategoria.slice(1).toLowerCase();

  let collapsed = props.isExpanded ? "" : "collapsed";
  let show = props.isExpanded ? "show" : "";

  let categoriaId = "categoria" + nombreCategoria;

  let productos = props.productos;

  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button
          className={"accordion-button " + collapsed}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={"#" + categoriaId}
          aria-controls={categoriaId}
        >
          <b>{nombreCategoria}</b>
        </button>
      </h2>
      <div id={categoriaId} className={"accordion-collapse collapse " + show}>
        <div className="row row-cols-md-2 row-cols-sm-1 justify-content-around accordion-body">
          {productos.map((producto, index) => (
            <CartaProducto
              key={index}
              producto={producto}
              addToCart={props.addToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
