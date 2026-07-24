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
let editingIndex = null;

const listaProductos = document.getElementById('listaProductos');
const listaComentarios = document.getElementById('listaComentarios');
const formProducto = document.getElementById('formProducto');

function renderProductos() {
    listaProductos.innerHTML = '';

    productos.forEach((producto, index) => {
        const row = document.createElement('div');
        row.className = 'product-row';

        if (editingIndex === index) {
            row.innerHTML = `
                <div class="product-edit">
                    <input type="text" data-field="nombre" value="${producto.nombre}">
                    <input type="text" data-field="precio" value="${producto.precio}">
                    <input type="text" data-field="imagen" value="${producto.imagen}">
                </div>
                <div class="actions">
                    <button type="button" data-index="${index}" class="btnGuardarProducto">Guardar</button>
                    <button type="button" data-index="${index}" class="btnCancelarProducto">Cancelar</button>
                </div>
            `;
        } else {
            row.innerHTML = `
                <div>
                    <strong>${producto.nombre}</strong><br>
                    <span class="muted">${producto.precio}</span>
                </div>
                <div class="actions">
                    <button type="button" data-index="${index}" class="btnModificarProducto">Modificar</button>
                    <button type="button" data-index="${index}" class="btnEliminarProducto danger">Eliminar</button>
                </div>
            `;
        }

        listaProductos.appendChild(row);
    });
}

function renderComentarios() {
    listaComentarios.innerHTML = '';

    comentarios.forEach((comentario, index) => {
        const row = document.createElement('div');
        row.className = 'comment-row';
        row.innerHTML = `
            <div>
                <strong>${comentario.nombre}</strong>
            </div>
            <textarea data-index="${index}" rows="3">${comentario.texto}</textarea>
            <div class="actions">
                <button type="button" data-index="${index}" class="btnGuardarComentario">Modificar</button>
                <button type="button" data-index="${index}" class="btnEliminarComentario danger">Eliminar</button>
            </div>
        `;
        listaComentarios.appendChild(row);
    });
}

formProducto.addEventListener('submit', (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombreProducto').value.trim();
    const precio = document.getElementById('precioProducto').value.trim();
    const imagen = document.getElementById('imagenProducto').value.trim();

    if (!nombre || !precio) {
        alert('Completa nombre y precio del producto.');
        return;
    }

    productos.push({ nombre, precio, imagen: imagen || 'imagenes/default.jpg' });
    localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productos));
    formProducto.reset();
    renderProductos();
});

listaProductos.addEventListener('click', (event) => {
    const index = Number(event.target.dataset.index);

    if (event.target.classList.contains('btnModificarProducto')) {
        editingIndex = index;
        renderProductos();
        return;
    }

    if (event.target.classList.contains('btnCancelarProducto')) {
        editingIndex = null;
        renderProductos();
        return;
    }

    if (event.target.classList.contains('btnGuardarProducto')) {
        const row = event.target.closest('.product-row');
        const nombre = row.querySelector('[data-field="nombre"]').value.trim();
        const precio = row.querySelector('[data-field="precio"]').value.trim();
        const imagen = row.querySelector('[data-field="imagen"]').value.trim();

        if (!nombre || !precio) {
            alert('Completa nombre y precio del producto.');
            return;
        }

        productos[index] = {
            nombre,
            precio,
            imagen: imagen || 'imagenes/default.jpg'
        };

        localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productos));
        editingIndex = null;
        renderProductos();
        return;
    }

    if (event.target.classList.contains('btnEliminarProducto')) {
        productos.splice(index, 1);
        localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productos));
        renderProductos();
    }
});

listaComentarios.addEventListener('click', (event) => {
    const index = Number(event.target.dataset.index);

    if (event.target.classList.contains('btnEliminarComentario')) {
        comentarios.splice(index, 1);
        localStorage.setItem(COMENTARIOS_KEY, JSON.stringify(comentarios));
        renderComentarios();
    }

    if (event.target.classList.contains('btnGuardarComentario')) {
        const textarea = document.querySelector(`textarea[data-index="${index}"]`);
        comentarios[index].texto = textarea.value.trim();
        localStorage.setItem(COMENTARIOS_KEY, JSON.stringify(comentarios));
        renderComentarios();
    }
});

renderProductos();
renderComentarios();
