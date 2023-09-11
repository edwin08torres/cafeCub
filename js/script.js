// VARIABLES
const nav = document.querySelector(".nav");
const carrito = document.querySelector(".carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody"); //Este va ser donde se mostrara los productos agregados
const btnVaciarCarrito = document.querySelector("#vaciar_carrito"); //btn que ayudara a limpiar el contenido del carrito.
const contadorElemento = document.querySelector(".icono-car .notificacion");
const listaProductos = document.querySelector("#lista-producto"); //variable que nos ayudara a leer la información de cada producto.
let productoCarrito = []; //nos ayudara almacenar los productos deseados

cargarEventListeners();
function cargarEventListeners() {
  // Muestra el menu mobile
  document.querySelector("#menu-btn").onclick = () => {
    nav.classList.toggle("active");
    carrito.classList.remove("active");
  };
  // Muestra el menu del carrito
  document.querySelector("#menu-carrito").onclick = () => {
    carrito.classList.toggle("active");
    nav.classList.remove("active");
  };

  listaProductos.addEventListener("click", agregarProducto);

  carrito.addEventListener("click", eliminarCurso);

  btnVaciarCarrito.addEventListener("click", (e) => {
    e.preventDefault();

    productoCarrito = [];

    limpiarCarrito();
  });
}

// FUNCTIONES

// funcion que captura la info del producto al dar 'click' al carrito
function agregarProducto(e) {
  e.preventDefault();

  if (e.target.classList.contains("add")) {
    const productoSeleccionado =
      e.target.parentElement.parentElement.parentElement.parentElement;
    console.log(productoSeleccionado);
    leerDatosProductos(productoSeleccionado);
  }
}

function eliminarCurso(e) {
  if (e.target.classList.contains("borrar-curso")) {
    const cursoId = e.target.getAttribute("data-id");

    productoCarrito = productoCarrito.filter((curso) => curso.id !== cursoId);

    carritoHTML();
  }
}

// funcion que leera el contenido de cada card
function leerDatosProductos(producto) {
  // se crea un objeto donde se almacenera la info del producto

  const infoProducto = {
    img: producto.querySelector(".img img").src,
    titulo: producto.querySelector("h3").textContent,
    descripcion: producto.querySelector("span").textContent,
    precio: producto.querySelector(".price p").textContent,
    id: producto.querySelector(".detail").getAttribute("data-id"),
    cantidad: 1,
  };

  const existe = productoCarrito.some((prod) => prod.id == infoProducto.id);
  if (existe) {
    const productos = productoCarrito.map((prod) => {
      if (prod.id === infoProducto.id) {
        prod.cantidad++;
        return prod;
      } else {
        return prod;
      }
    });
    productoCarrito = [...productos];
  } else {
    productoCarrito = [...productoCarrito, infoProducto];
  }

  console.log(productoCarrito);

  // agregando al carrito los productos.
  carritoHTML();
}

function carritoHTML() {
  // limpiamos primeramente el carrito
  limpiarCarrito();

  productoCarrito.forEach((producto) => {
    const { img, titulo, descripcion, precio, cantidad, id } = producto;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <img src="${img}">
      </td>
      <td>${titulo}</td>
      <td>${descripcion}</td>
      <td>${precio}</td>
      <td class="cantidad">${cantidad}</td>
      <td class="accion">
        <button href="#" class="borrar-curso fa-solid fa-trash"  data-id="${id}">
        </button>
        <button href="#" class="eye fa-regular fa-eye">
        </button>
      </td>
    `;

    contenedorCarrito.append(row);

    const totalCantidad = productoCarrito.reduce(
      (total, prod) => total + prod.cantidad,
      0
    );
    contadorElemento.innerHTML = totalCantidad;
  });
}

function limpiarCarrito() {
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}

window.onscroll = () => {
  nav.classList.remove("active");
  carrito.classList.remove("active");
};
