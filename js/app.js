// app.js
//Elaboración de la clase Producto y el inventario del kiosco
class Producto {
    constructor(id, icono, nombre, stock, precio) {
        this.id = id;
        this.icono = icono;
        this.nombre = nombre;
        this.stock = stock;
        this.precio = precio;
    }
}

const inventarioKiosco = [
    new Producto(1, "☕", "Café Americano", 15, 1.50),
    new Producto(2, "⚡", "Bebida Energética", 24, 2.75),
    new Producto(3, "🧀", "Nachos con Queso", 18, 2.50), 
    new Producto(4, "🍩", "Donas Glaseadas", 12, 1.00),
    new Producto(5, "🍟", "Churritos Picantes", 20, 0.75),
    new Producto(6, "💧", "Agua Mineral", 30, 1.25),
    new Producto(7, "🥜", "Maní Salado", 25, 0.50),
    new Producto(8, "🍪", "Galletas Surtidas", 20, 0.85),
    new Producto(9, "🍭", "Paletas de Dulce", 15, 0.60),
    new Producto(10, "🚬", "Caja de Cigarros", 10, 4.50),
    new Producto(11, "🥤", "Soda en Lata", 35, 1.00),
    new Producto(12, "🌭", "Hot Dog Clásico", 15, 2.00)
];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
// Función para renderizar el catálogo de productos en la página
function renderizarCatalogo() {
    const grid = document.querySelector('.product-grid');
    // Verificar que el contenedor exista antes de intentar agregar productos
    if (!grid) return; 

    inventarioKiosco.forEach(producto => {
        // Crear una tarjeta para cada producto
        const card = document.createElement('div');
        card.classList.add('product-card');
        // Agregar el contenido del producto a la tarjeta
        card.innerHTML = `
            <div class="product-icon">${producto.icono}</div>
            <h3 class="product-name">${producto.nombre}</h3>
            <p class="product-stock">Disponibles: <span id="stock-${producto.id}">${producto.stock}</span></p>
            <p class="product-price">$${producto.precio.toFixed(2)}</p>
            
            <div style="margin: 10px 0; display: flex; align-items: center; justify-content: center; gap: 5px;">
                <label for="cant-${producto.id}">Cant:</label>
                <input type="number" id="cant-${producto.id}" min="1" max="${producto.stock}" value="1" style="width: 60px; text-align: center; background-color: var(--bg-dark); color: var(--text-light); border: 1px solid var(--border-color); border-radius: 5px; padding: 5px; outline: none;">
            </div>
            
            <button class="btn-add" onclick="agregarAlCarrito(${producto.id})">Agregar</button>
        `;
        
        grid.appendChild(card);
    });
}

function agregarAlCarrito(idProducto) {
    const inputCantidad = document.getElementById(`cant-${idProducto}`);
    const cantidadDeseada = parseInt(inputCantidad.value);
    const productoSeleccionado = inventarioKiosco.find(p => p.id === idProducto);

    if (cantidadDeseada > productoSeleccionado.stock) {
        alert("¡No hay suficiente stock disponible!");
        return;
    }
    if (cantidadDeseada <= 0 || isNaN(cantidadDeseada)) {
        alert("Por favor ingrese una cantidad válida.");
        return;
    }

    // Aquí se podría agregar el producto al carrito (aún no implementado)

}

document.addEventListener('DOMContentLoaded', renderizarCatalogo);
