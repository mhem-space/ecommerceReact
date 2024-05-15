import React from "react";
import { listaBaseDeProductos, carritoBase } from "./constantes";
import { useEffect, useState } from "react";
import { Categoria } from "./Categoria";
import { CartaProductoCarro } from "./CartaProductoCarro";
import { IsNullOrEmpty } from "./utils";

export const Home = () => {
  const [listaDeProductos, setlistaDeProductos] = useState(
    JSON.parse(localStorage.getItem("listaDeProductos"))
  );
  const [estadoCarrito, setEstadoCarrito] = useState(
    JSON.parse(localStorage.getItem("estadoCarrito"))
  );
  const [carritoVacio, setCarritoVacio] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const productosGuardados = JSON.parse(
      localStorage.getItem("listaDeProductos")
    );
    const carritoGuardado = JSON.parse(localStorage.getItem("estadoCarrito"));

    if (IsNullOrEmpty(productosGuardados) || IsNullOrEmpty(carritoGuardado)) {
      localStorage.setItem(
        "listaDeProductos",
        JSON.stringify(listaBaseDeProductos)
      );
      localStorage.setItem("estadoCarrito", JSON.stringify(carritoBase));
      setlistaDeProductos(listaBaseDeProductos);
      setEstadoCarrito(carritoBase);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("estadoCarrito", JSON.stringify(estadoCarrito));
    if(!IsNullOrEmpty(estadoCarrito)){
      setCarritoVacio(estadoCarrito.cantidad === 0);
    }
  }, [estadoCarrito]);

  useEffect(() => {
    localStorage.setItem("listaDeProductos", JSON.stringify(listaDeProductos));
  }, [listaDeProductos]);

  const agregarAlCarrito = (producto) => {
    setEstadoCarrito((prevCarrito) => {
      const productoIndex = prevCarrito.items.findIndex(
        (item) => item.codigo === producto.codigo
      );
      let newItems = [...prevCarrito.items];

      if (productoIndex !== -1) {
        newItems[productoIndex] = {
          ...newItems[productoIndex],
          cantidad: newItems[productoIndex].cantidad + 1,
        };
      } else {
        newItems.push({ ...producto, cantidad: 1 });
      }

      const newTotal = prevCarrito.total + producto.precio;
      const newCantidad = prevCarrito.cantidad + 1;

      // Actualizar el stock del producto
      setlistaDeProductos((prevProductos) => {
        return prevProductos.map((cat) => ({
          ...cat,
          productos: cat.productos.map((p) =>
            p.codigo === producto.codigo ? { ...p, stock: p.stock - 1 } : p
          ),
        }));
      });

      return {
        items: newItems,
        total: newTotal,
        cantidad: newCantidad,
      };
    });
    setCarritoVacio(false);
  };

  const eliminarDelCarrito = (producto) => {
    setEstadoCarrito((prevCarrito) => {
      const productoIndex = prevCarrito.items.findIndex(
        (item) => item.codigo === producto.codigo
      );
      let newItems = [...prevCarrito.items];

      if (newItems[productoIndex].cantidad > 1) {
        newItems[productoIndex] = {
          ...newItems[productoIndex],
          cantidad: newItems[productoIndex].cantidad - 1,
        };
      } else {
        newItems = newItems.filter((item) => item.codigo !== producto.codigo);
      }

      const newTotal = prevCarrito.total - producto.precio;
      const newCantidad = prevCarrito.cantidad - 1;

      // Actualizar el stock del producto
      setlistaDeProductos((prevProductos) => {
        return prevProductos.map((cat) => ({
          ...cat,
          productos: cat.productos.map((p) =>
            p.codigo === producto.codigo ? { ...p, stock: p.stock + 1 } : p
          ),
        }));
      });

      return {
        items: newItems,
        total: newTotal,
        cantidad: newCantidad,
      };
    });
    setCarritoVacio(estadoCarrito.cantidad === 0);
  };

  const comprarProductos = () => {
    setEstadoCarrito({
      items: [],
      total: 0,
      cantidad: 0,
    });
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); // El toast desaparece después de 3 segundos
  };

  return (
    <div className="container mt-5 principal" style={{ maxWidth: "90%" }}>
      <div className="row justify-content-between p-2">
        <div className="col-xxl-7 col-xl-8 col-auto mt-1">
          <h2>Productos</h2>
          <div className="accordion" id="productos">
            {!IsNullOrEmpty(listaDeProductos) && listaDeProductos.map((categoria, index) => (
              <Categoria
                key={index}
                nombreCategoria={categoria.nombre}
                productos={categoria.productos}
                isExpanded={index === 0}
                addToCart={agregarAlCarrito}
              />
            ))}
          </div>
        </div>
        <div className="col-xl-4 col-12 mt-1">
          <h2>
            <div className="d-flex gap-3 justify-content-center">
              <span>Cesta</span>
              <i className="fas fa-shopping-cart fa-xs"></i>
            </div>
          </h2>
          <div className="row justify-content-between w-100 mb-3">
            <span className="badge text-bg-info col-5" id="contadorItems">
              Items: {!IsNullOrEmpty(estadoCarrito) && estadoCarrito.cantidad}
            </span>
            <span className="badge text-bg-success col-5" id="contadorPrecio">
              Total de la cesta: {!IsNullOrEmpty(estadoCarrito) && estadoCarrito.total}€
            </span>
          </div>
          <div
            className="row row-cols-xl-1 row-cols-md-2 row-cols-sm-1 justify-content-around"
            id="carrito"
          >
            {!IsNullOrEmpty(estadoCarrito) &&
              estadoCarrito.items.map((producto, index) => (
                <CartaProductoCarro
                  key={index}
                  producto={producto}
                  removeFromCart={eliminarDelCarrito}
                />
              ))}
            {!carritoVacio && (
              <button
                type="button"
                className="btn btn-danger mt-2 w-100"
                id="comprarProductos"
                onClick={comprarProductos}
              >
                Comprar
              </button>
            )}
          </div>
          <div
            aria-live="polite"
            aria-atomic="true"
            className="position-relative"
          >
            <div
              id="toastContainer"
              className="toast-container position-absolute end-0 p-3"
            >
              <div
                className={`toast align-items-center text-white bg-success border-0${showToast ? " show" : ""}`}
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
              >
                <div className="d-flex">
                  <div className="toast-body">¡Gracias por tu compra!</div>
                  <button
                    type="button"
                    className="btn-close btn-close-white me-2 m-auto"
                    data-bs-dismiss="toast"
                    aria-label="Close"
                  ></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
