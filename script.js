const PRODUCTOS_KEY = 'restaurante_productos';
const COMENTARIOS_KEY = 'restaurante_comentarios';

const productosBase = [
    { nombre: 'Filete a la Parrilla', precio: '$18.00', imagen: 'imagenes/images.jpg' },
    { nombre: 'Pasta Alfredo', precio: '$14.00', imagen: 'imagenes/pasta.jpg' },
    { nombre: 'Pollo Asado', precio: '$15.00', imagen: 'imagenes/pollo.jpg' },
    { nombre: 'Ensalada César', precio: '$10.00', imagen: 'imagenes/ensalada.jpg' },
    { nombre: 'Pastel de Chocolate', precio: '$7.00', imagen: 'imagenes/pastel.jpg' },
    { nombre: 'Café', precio: '$3.00', imagen: 'imagenes/cafe.JPG' }
];

const comentariosBase = [
    { nombre: 'Ana', texto: 'Muy rica la comida.' },
    { nombre: 'Luis', texto: 'Excelente atención.' }
];

function obtenerDatos(key, fallback) {
    const datos = localStorage.getItem(key);

    if (!datos) {
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
    }

    try {
        return JSON.parse(datos);
    } catch {
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
    }
}

let productos = obtenerDatos(PRODUCTOS_KEY, productosBase);
let comentarios = obtenerDatos(COMENTARIOS_KEY, comentariosBase);

function renderMenu() {
    const menuList = document.getElementById('menuList');

    if (!menuList) {
        return;
    }

    menuList.innerHTML = '';

    productos.forEach((producto, index) => {
        const detalleId = `detalle${index + 1}`;

        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.onclick = function () {
            mostrarImagen(detalleId);
        };
        menuItem.innerHTML = `
            <span>${producto.nombre}</span>
            <span>${producto.precio}</span>
        `;

        const detalle = document.createElement('div');
        detalle.id = detalleId;
        detalle.className = 'detalle';
        detalle.innerHTML = `<img src="${producto.imagen}" alt="${producto.nombre}">`;

        menuList.appendChild(menuItem);
        menuList.appendChild(detalle);
    });
}

function renderComentarios() {
    const listaComentarios = document.getElementById('listaComentarios');

    if (!listaComentarios) {
        return;
    }

    listaComentarios.innerHTML = '';

    comentarios.forEach((comentario) => {
        const item = document.createElement('div');
        item.className = 'comentario';
        item.innerHTML = `<strong>${comentario.nombre}</strong><br><br>${comentario.texto}`;
        listaComentarios.appendChild(item);
    });
}

function agregarComentario(){

    let nombre = document.getElementById("nombre").value.trim();
    let comentario = document.getElementById("comentario").value.trim();

    if(nombre==="" || comentario===""){
        alert("Completa todos los campos.");
        return;
    }

    comentarios.push({ nombre, texto: comentario });
    localStorage.setItem(COMENTARIOS_KEY, JSON.stringify(comentarios));

    document.getElementById("nombre").value="";
    document.getElementById("comentario").value="";

    renderComentarios();
}

function abrirAdmin() {
    let password = prompt("Ingrese la contraseña para entrar al panel de administrador:");

    if (password === "admin123") {
        window.location.href = "admin.html";
    } else {
        alert("Contraseña incorrecta.");
    }
}

function mostrarImagen(id) {
    const detalle = document.getElementById(id);
    const detalles = document.querySelectorAll('.detalle');

    if (!detalle) {
        console.error("No se encontró el elemento con id:", id);
        return;
    }

    detalles.forEach((item) => {
        if (item !== detalle) {
            item.style.maxHeight = '0';
        }
    });

    if (detalle.style.maxHeight === "350px") {
        detalle.style.maxHeight = "0";
    } else {
        detalle.style.maxHeight = "350px";
    }
}

renderMenu();
renderComentarios();
