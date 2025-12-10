window.onload = () => {
    CallServiceMenu("ALL");
    document.getElementById("All").onclick = () => CallServiceMenu("ALL");
    document.getElementById("MecanicaGeneral").onclick = () => CallServiceMenu("MecanicaGeneral");
    document.getElementById("Computarizado").onclick = () => CallServiceMenu("Computarizado");
    document.getElementById("CambioAceite").onclick = () => CallServiceMenu("CambioAceite");
};
/*fetch('../JSON/servicioLinea.json')
    .then(res => res.json())
    .then(data => {
        const contenedorServicios = document.getElementById("contenerdor-servicios");

        data.tienda.forEach(servicio => {
            const div = document.createElement("div");
            div.className = "col-md-4";
            div.innerHTML = `
            <div class="card fade-down mb-4 position-relative grow rotate-360">
                <img src="${servicio.imagen}" class="card-img-top" alt="${servicio.descripcion}">
                <div class="card-body">
                    <h5 class="card-title">${servicio.descripcion}</h5>
                    <p class="card-text">${servicio.precio}</p>
                    <a href="detalleTienda.html?id=${servicio.id}" class="btn btn-link text-primary">Más info →</a>
                </div>
            </div>
            `;
            contenedorServicios.appendChild(div);
        });
    })
    .catch(err => console.error("Error cargando productos:", err));

    // Observador para activar animaciones cuando aparecen en pantalla
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});*/
async function CallServiceMenu(tipo) {

    // let uriServer = "https://si0sgs.github.io/restaurantly/assets/datos/menu.json";
    // let uriServer = "assets/datos/menu.json";
    let uriServer = "JSON/servicioLinea.json";


    try {
        const response = await fetch(uriServer);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        OnSuccess(data, tipo);

    } catch (error) {
        alert("Mensaje de Error: " + error);
    }
    return false;
}

function OnSuccess(data, tipo) {
    datos = data;
    //cargarMenuString();
    cargarMenu(tipo);

}
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});
function cargarMenu(tipo) {
    const menucontainer = document.getElementById("menu-container-id");
    menucontainer.innerHTML = "";

    datos.tienda.forEach(servicio => {

        // Validación de filtro
        if (tipo.toUpperCase() !== "ALL") {
            if (servicio.clasificacion.toUpperCase() !== tipo.toUpperCase()) {
                return; // NO coincide → NO se dibuja
            }
        }

        // Crear la tarjeta con tu diseño
        const div = document.createElement("div");
        div.className = "col-md-4";
        div.innerHTML = `
            <div class="card card-servicios fade-down mb-4 position-relative grow rotate-360">
                <img src="${servicio.imagen}" class="card-img-top" alt="${servicio.descripcion}">
                <div class="card-body">
                    <h5 class="card-title">${servicio.descripcion}</h5>
                    <p class="card-text">${servicio.precio}</p>
                    
                </div>
            </div>
        `;

        menucontainer.appendChild(div);
    });
}



    /*
    
        <div class="col-lg-6 menu-item filter-starters">
            <img src="assets/img/menu/lobster-bisque.jpg" class="menu-img" alt="">
            <div class="menu-content">
                <a href="#">Lobster Bisque</a><span>$5.95</span>
            </div>
            <div class="menu-ingredients">
                Lorem, deren, trataro, filede, nerada
            </div>
        </div>    
    
    */


// Esto es del carrito para ir a pago 


document.getElementById("btnIrPago").addEventListener("click", () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (carrito.length === 0) {
        Swal.fire("Carrito vacío", "Agrega productos antes de continuar con el pago.", "info");
        return;
    }

    // Redireccionar al formulario de pago
    window.location.href = "pago.html";
});

/// Renderiza el carrito en la página de tienda.html

function renderizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contenedor = document.getElementById("carrito-contenido");
    const totalSpan = document.getElementById("carrito-total");
    contenedor.innerHTML = "";
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precioMax * item.cantidad;
        total += subtotal;

        const div = document.createElement("div");
        div.className = "carrito-item";


        div.innerHTML = `
      <div class="d-flex">
        <img src="${item.imagen}" alt="${item.descripcion}">
        <div class="info">
          <p>${item.descripcion}</p>
          <small>${item.precio} $</small>
        </div>
      </div>
      <div class="acciones">
        <button class="eliminar-servicio" data-id="${item.id}" title="Eliminar">
          🗑️
        </button>
        <select class="form-select form-select-sm w-auto" data-id="${item.id}">
          ${[...Array(10)].map((_, i) => `<option ${item.cantidad == i + 1 ? 'selected' : ''}>${i + 1}</option>`).join('')}
        </select>
      </div>
    `;

        contenedor.appendChild(div);
    });

    totalSpan.textContent = `${total.toFixed(2)} $`;

    // Cambio de cantidad
    contenedor.querySelectorAll("select").forEach(select => {
        select.addEventListener("change", (e) => {
            const id = parseInt(e.target.dataset.id);
            const nuevaCantidad = parseInt(e.target.value);
            const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

            const index = carrito.findIndex(p => p.id === id);
            if (index !== -1) {
                carrito[index].cantidad = nuevaCantidad;
                localStorage.setItem("carrito", JSON.stringify(carrito));
                renderizarCarrito();
            }
        });
    });

    // Eliminar producto
    contenedor.querySelectorAll(".eliminar-producto").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            carrito = carrito.filter(p => p.id !== id);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            renderizarCarrito();
        });
    });

}

renderizarCarrito();

// Clic en el ícono del carrito
document.getElementById("icono-carrito").addEventListener("click", (e) => {
    e.preventDefault();
    const offcanvas = new bootstrap.Offcanvas(document.getElementById('carritoOffcanvas'));
    offcanvas.show();
});

