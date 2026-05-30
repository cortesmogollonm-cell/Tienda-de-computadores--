function guardarUsuario(user) {
    localStorage.setItem("user", user);
}

function obtenerUsuario() {
    return localStorage.getItem("user");
}

function cerrarSesion() {
    localStorage.removeItem("user");
}

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(c) {
    localStorage.setItem("carrito", JSON.stringify(c));
}