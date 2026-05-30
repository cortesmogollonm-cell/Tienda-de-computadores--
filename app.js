const productos = [
    { id: 1, nombre: "HP Pavilion", marca: "HP", precio: 2500, img: "IMG/HP.avif" },
    { id: 2, nombre: "Dell XPS", marca: "Dell", precio: 3500, img: "IMG/Dell.jpg" },
    { id: 3, nombre: "Lenovo ThinkPad", marca: "Lenovo", precio: 3000, img: "IMG/Lenovo.avif" },
    { id: 4, nombre: "Asus ROG", marca: "Asus", precio: 5000, img: "IMG/Rog.jpg" },
    { id: 5, nombre: "MacBook Pro", marca: "Apple", precio: 7000, img: "IMG/MacBook.jpg" }
];

const contenedor = document.getElementById("productos");

// MENSAJES
function mensaje(txt, tipo) {
    const m = document.getElementById("mensaje");
    m.innerText = txt;
    m.className = tipo;
    m.style.display = "block";
    setTimeout(() => m.style.display = "none", 2000);
}

// LOGIN
function login() {
    const u = document.getElementById("usuario").value;
    const p = document.getElementById("password").value;

    if (u === "admin" && p === "1234") {
        guardarUsuario(u);
        iniciar();
        mensaje("✅ Bienvenido", "exito");
    } else {
        mensaje("❌ Usuario incorrecto", "error");
    }
}

function logout() {
    cerrarSesion();
    location.reload();
}

function iniciar() {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("tienda").classList.remove("hidden");
    mostrarProductos(productos);
    renderCarrito();
}

// PRODUCTOS
function mostrarProductos(lista) {
    contenedor.innerHTML = "";
    lista.forEach(p => {
        contenedor.innerHTML += `
        <div>
            <div class="img-container">
                <img src="${p.img}">
            </div>
            <h3>${p.nombre}</h3>
            <p>${p.marca}</p>
            <p>$${p.precio}</p>
            <button onclick="agregar(${p.id})">Agregar</button>
        </div>`;
    });
}

// FILTRO
function filtrar() {
    let texto = document.getElementById("busqueda").value.toLowerCase();
    let marca = document.getElementById("marca").value;

    let filtrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(texto) &&
        (marca === "" || p.marca === marca)
    );

    mostrarProductos(filtrados);
}

// CARRITO
function agregar(id) {
    let carrito = obtenerCarrito();
    let prod = productos.find(p => p.id === id);
    let existe = carrito.find(p => p.id === id);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...prod, cantidad: 1 });
    }

    guardarCarrito(carrito);
    renderCarrito();
}

function renderCarrito() {
    let carrito = obtenerCarrito();
    let html = "";
    let total = 0;

    carrito.forEach(p => {
        total += p.precio * p.cantidad;
        html += `
        <li>
            ${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}
            <button onclick="cambiar(${p.id},1)">+</button>
            <button onclick="cambiar(${p.id},-1)">-</button>
            <button onclick="eliminar(${p.id})">x</button>
        </li>`;
    });

    document.getElementById("carrito").innerHTML = html;
    document.getElementById("total").innerText = "Total: $" + total;
}

function cambiar(id, delta) {
    let carrito = obtenerCarrito();
    let p = carrito.find(x => x.id === id);

    p.cantidad += delta;

    if (p.cantidad <= 0) {
        carrito = carrito.filter(x => x.id !== id);
    }

    guardarCarrito(carrito);
    renderCarrito();
}

function eliminar(id) {
    let carrito = obtenerCarrito().filter(p => p.id !== id);
    guardarCarrito(carrito);
    renderCarrito();
}

function finalizarCompra() {

    // ✅ verificar si está logueado
    if (!obtenerUsuario()) {
        mensaje("⚠️ Debes iniciar sesión primero", "error");
        return;
    }

    let carrito = obtenerCarrito();

    if (carrito.length === 0) {
        mensaje("❌ Carrito vacío", "error");
        return;
    }

    abrirModal();
}


function abrirModal() {
    document.getElementById("modal").classList.add("active");

    let carrito = obtenerCarrito();
    let total = 0;

    carrito.forEach(p => {
        total += p.precio * p.cantidad;
    });

    document.getElementById("total-modal").innerText = "Total: $" + total;
}

function cerrarModal() {
    document.getElementById("modal").classList.remove("active");
}

function confirmarCompra() {
    let nombre = document.getElementById("nombre").value;
    let correo = document.getElementById("correo").value;
    let pago = document.getElementById("pago").value;

    if (nombre === "" || correo === "" || pago === "") {
        mensaje("⚠️ Completa todos los campos", "error");
        return;
    }

    localStorage.setItem("cliente", JSON.stringify({ nombre, correo, pago }));

    mensaje("✅ Compra exitosa", "exito");

    setTimeout(() => {
        window.location = "factura.html";
    }, 1500);
}

function iniciar() {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("tienda").classList.remove("hidden");
    document.body.style.background = "#f1f3f6"; // asegura fondo correcto

    mostrarProductos(productos);
    renderCarrito();
}