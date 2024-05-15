import React from "react";
import { useEffect, useState } from "react";
import { listaBaseDeProductos, carritoBase } from "./constantes";
import { IsNullOrEmpty } from "./utils";
import { Modal, Button, Form } from "react-bootstrap";

export const Admin = () => {
  const [listaDeProductos, setlistaDeProductos] = useState(
    JSON.parse(localStorage.getItem("listaDeProductos"))
  );
  const [estadoCarrito, setEstadoCarrito] = useState(
    JSON.parse(localStorage.getItem("estadoCarrito"))
  );
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

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
  }, [estadoCarrito]);

  useEffect(() => {
    localStorage.setItem("listaDeProductos", JSON.stringify(listaDeProductos));
  }, [listaDeProductos]);

  const agregarCategoria = (nombreCategoria) => {
    // Lógica para añadir una categoría
    const categoriaExistente = listaDeProductos.some(
      (cat) => cat.nombre === nombreCategoria
    );
    if (categoriaExistente) {
      alert("La categoría ya existe.");
      return;
    }

    const nuevaCategoria = {
      nombre: nombreCategoria,
      productos: [],
    };

    setlistaDeProductos([...listaDeProductos, nuevaCategoria]);
  };

  const eliminarCategoria = (e) => {
    // Lógica para eliminar una categoría
    let nombreCategoria = e.target.getAttribute("data-categoria");
    const nuevaLista = listaDeProductos.filter(
      (cat) => cat.nombre !== nombreCategoria
    );
    setlistaDeProductos(nuevaLista);
    alert(`La categoría ${nombreCategoria} se ha eliminado correctamente.`);
  };

  const agregarProducto = () => {
    // Lógica para añadir un producto
    let nombre = document.getElementById("nombreProducto").value;
    let descripcion = document.getElementById("descripcionProducto").value;
    let categoria = document.getElementById("categoriaProducto").value;
    let precio = document.getElementById("precioProducto").value;
    let stock = document.getElementById("stockProducto").value;
    let imagenInput = document.getElementById("imagenProducto");

    let indiceCategoria = listaDeProductos.findIndex(
      (cat) => cat.nombre === categoria
    );

    let reader = new FileReader();
    reader.onload = function (e) {
      let imagen = e.target.result; // Imagen en base64
      let codigo =
        categoria.substring(0, 3).toLowerCase() +
        (listaDeProductos.find((cat) => cat.nombre === categoria).productos
          .length +
          1);
      let nuevoProducto = {
        codigo: codigo.charAt(0).toUpperCase() + codigo.slice(1),
        nombre: nombre,
        descripcion: descripcion,
        precio: parseFloat(precio),
        stock: parseInt(stock),
        imagen: imagen,
      };
      // Añade el producto a la categoría
      setlistaDeProductos((prevProductos) => {
        return prevProductos.map((cat, index) => {
          if (index === indiceCategoria) {
            return {
              ...cat,
              productos: [...cat.productos, nuevoProducto],
            };
          }
          return cat;
        });
      });
    };

    if (imagenInput.files[0]) {
      reader.readAsDataURL(imagenInput.files[0]);
    }
  };

  const eliminarProducto = (e) => {
    // Lógica para eliminar un producto
    let codigoProducto = e.target.getAttribute("data-codigo");
    let nuevaLista = listaDeProductos.map((cat) => {
      return {
        ...cat,
        productos: cat.productos.filter(
          (prod) => prod.codigo !== codigoProducto
        ),
      };
    });
    setlistaDeProductos(nuevaLista);
    // logica para eliminar producto del carrito si existe
    setEstadoCarrito((prevCarrito) => {
      const productoIndex = prevCarrito.items.findIndex(
        (item) => item.codigo === codigoProducto
      );
      if (productoIndex !== -1) {
        let newItems = [...prevCarrito.items];
        newItems = newItems.filter((item) => item.codigo !== codigoProducto);

        let precioProducto = prevCarrito.items[productoIndex].precio;
        let cantidadProducto = prevCarrito.items[productoIndex].cantidad;

        const newTotal = prevCarrito.total - precioProducto * cantidadProducto;
        const newCantidad = prevCarrito.cantidad - cantidadProducto;
        return {
          items: newItems,
          total: newTotal,
          cantidad: newCantidad,
        };
      }
      return prevCarrito;
    });
    alert(
      `El producto con código ${codigoProducto} se ha eliminado correctamente.`
    );
  };

  return (
    <div className="container my-5 principal" style={{ maxWidth: "90%" }}>
      {/* Modal para añadir categoría */}
      <Modal
        show={showAddCategoryModal}
        onHide={() => setShowAddCategoryModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Añadir nueva categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            id="nombreNuevaCategoria"
            placeholder="Nombre de la categoría"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddCategoryModal(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              // Lógica para guardar la categoría
              agregarCategoria(
                document.getElementById("nombreNuevaCategoria").value
              );
              setShowAddCategoryModal(false);
            }}
          >
            Guardar categoría
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal para añadir producto */}
      <Modal
        show={showAddProductModal}
        onHide={() => setShowAddProductModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Añadir Nuevo Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre del producto"
                id="nombreProducto"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripción del producto"
                id="descripcionProducto"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Control as="select" id="categoriaProducto">
                {listaDeProductos.map((categoria, index) => (
                  <option key={index} value={categoria.nombre}>
                    {categoria.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                placeholder="Precio"
                id="precioProducto"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Stock"
                id="stockProducto"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imagen</Form.Label>
              <Form.Control type="file" id="imagenProducto" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddProductModal(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              // Lógica para guardar el producto
              agregarProducto();
              setShowAddProductModal(false);
            }}
          >
            Guardar Producto
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Tabla para Categorías */}
      <div className="p-2 mb-5">
        <h2>Categorías</h2>
        <table className="table border border-2 border-black">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre de la Categoría</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody id="tablaCategorias">
            {listaDeProductos.map((categoria, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{categoria.nombre}</td>
                <td>
                  <button
                    className="btn btn-danger eliminarCategoria"
                    data-categoria={categoria.nombre}
                    onClick={eliminarCategoria}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="btn btn-primary"
          id="añadirCategoria"
          onClick={() => setShowAddCategoryModal(true)}
        >
          Añadir Categoría
        </button>
      </div>

      {/* Tabla para Productos */}
      <div className="p-2">
        <h2>Productos</h2>
        <table className="table border border-2 border-black">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre del Producto</th>
              <th scope="col">Categoría</th>
              <th scope="col">Precio</th>
              <th scope="col">Stock</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody id="tablaProductos">
            {listaDeProductos.map((categoria, index) =>
              categoria.productos.map((producto, indice) => (
                <tr key={indice}>
                  <th scope="row">{producto.codigo}</th>
                  <td>{producto.nombre}</td>
                  <td>{categoria.nombre}</td>
                  <td>{producto.precio}€</td>
                  <td>{producto.stock}</td>
                  <td>
                    <button
                      className="btn btn-danger eliminarProducto"
                      data-codigo={producto.codigo}
                      onClick={eliminarProducto}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <button
          className="btn btn-primary"
          id="añadirProducto"
          onClick={() => setShowAddProductModal(true)}
        >
          Añadir Producto
        </button>
      </div>
    </div>
  );
};
