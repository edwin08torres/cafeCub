// VARIABLES
const nav = document.querySelector(".nav");
const carrito = document.querySelector(".carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody"); //Este va ser donde se mostrara los productos agregados
const btnVaciarCarrito = document.querySelector("#vaciar_carrito"); //btn que ayudara a limpiar el contenido del carrito.
const contadorElemento = document.querySelector(".icono-car .notificacion");
const listaProductos = document.querySelector("#lista-producto"); //variable que nos ayudara a leer la información de cada producto.

const modal = document.getElementById("modal");
const btnAgregarCarrito = document.querySelector("#btnAgregarCarrito");
const cantidadInput = document.getElementById("cantidadProducto");
const mensajeError = document.getElementById("mensajeError");

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

    const totalCantidad = productoCarrito.reduce(
      (total, prod) => total + prod.cantidad,
      0
    );
    contadorElemento.innerHTML = totalCantidad;

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

    // mostrar un modal para ingresar la cantidad deseada
      Swal.fire({
        title: "Ingresa la cantidad deseada",
        input: "number",
        inputAttributes: {
          min: 1,
          step: 1,
        },
        showCancelButton: true,
        confirmButtonText: "Agregar al carrito",
        showLoaderOnConfirm: true,
        preConfirm: (cantidad) => {
          cantidad = parseInt(cantidad); // Convierte la cantidad a número entero
          if (isNaN(cantidad) || cantidad <= 0) {
            Swal.showValidationMessage(
              "La cantidad debe ser un número mayor que cero"
            );
          }
          return cantidad;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const cantidad = result.value;
          leerDatosProductos(productoSeleccionado, cantidad);
        }
      });
    }

  //   // Mostrar el modal para ingresar la cantidad deseada
  //   modal.style.display = "flex";
  //   modal.style.justifyContent = "center";
  //   modal.style.alignItems = "center";

  //   btnAgregarCarrito.addEventListener("click", () => {
  //     const cantidad = parseInt(cantidadInput.value);

  //     if (isNaN(cantidad) || cantidad <= 0) {
  //       // Mostrar mensaje de error si la cantidad no es válida
  //       mensajeError.textContent = "La cantidad debe ser mayor que cero";
  //     }

  //      const productoId = productoSeleccionado
  //        .querySelector(".detail")
  //        .getAttribute("data-id");

  //     // Aquí puedes agregar el producto al carrito si es necesario
  //     leerDatosProductos(productoId, cantidad);

  //     // Cerrar el modal
  //     modal.style.display = "none";

  //     // Limpiar el campo de entrada y el mensaje de error
  //     cantidadInput.value = "";
  //     mensajeError.textContent = "";
  //   });

  //   // Manejar el evento "Cancelar" en el modal
  //   const cancelarBtn = document.getElementById("cancelar");
  //   cancelarBtn.addEventListener("click", () => {
  //     // Cerrar el modal sin agregar el producto al carrito
  //     modal.style.display = "none";

  //     // Limpiar el campo de entrada y el mensaje de error
  //     cantidadInput.value = "";
  //     mensajeError.textContent = "";
  //   });
  // }
}

function eliminarCurso(e) {
  if (e.target.classList.contains("borrar-curso")) {
    const cursoId = e.target.getAttribute("data-id");

    productoCarrito = productoCarrito.filter((curso) => curso.id !== cursoId);

    // recalcular la cantidad total de productos y actualiza el contador
    const totalCantidad = productoCarrito.reduce(
      (total, prod) => total + prod.cantidad,
      0
    );
    contadorElemento.innerHTML = totalCantidad;

    carritoHTML();
  }
}

// funcion que leera el contenido de cada card
function leerDatosProductos(producto, cantidad) {
  // se crea un objeto donde se almacenera la info del producto
  const infoProducto = {
    img: producto.querySelector(".img img").src,
    titulo: producto.querySelector("h3").textContent,
    descripcion: producto.querySelector("span").textContent,
    precio: producto.querySelector(".price p").textContent,
    id: producto.querySelector(".detail").getAttribute("data-id"),
    cantidad: cantidad,
  };

  const existe = productoCarrito.some((prod) => prod.id == infoProducto.id);

  if (existe) {
    const productos = productoCarrito.map((prod) => {
      if (prod.id === infoProducto.id) {
        prod.cantidad += cantidad;
        return prod;
      } else {
        return prod;
      }
    });
    productoCarrito = [...productos];
  } else {
    productoCarrito = [...productoCarrito, infoProducto];
  }

  // const existe = productoCarrito.findIndex(
  //   (prod) => prod.id === infoProducto.id
  // );

  // if (existe !== -1) {
  //   // si el producto ya existe, actualiza la cantidad
  //   productoCarrito[existe].cantidad += cantidad;
  // } else {
  //   // si el producto no existe, agregalo all carrito
  //   productoCarrito.push(infoProducto);
  // }

  // actualiza el contador con la cantidad total de productos
  const totalCantidad = productoCarrito.reduce(
    (total, prod) => total + prod.cantidad,
    0
  );

  contadorElemento.innerHTML = totalCantidad;

  Swal.fire({
    position: "center",
    icon: "success",
    title: "Producto(s) agregado(s) exitosamente",
    showConfirmButton: false,
    timer: 1500,
  });

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
