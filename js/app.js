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

// cargar inventario de localStorage si existe, de lo contrario usar valores iniciales
let inventarioKiosco = [];
function cargarInventario() {
    const datos = localStorage.getItem('inventario');
    if (datos) {
        // reconstruir objetos Producto
        const parsed = JSON.parse(datos);
        inventarioKiosco = parsed.map(p => new Producto(p.id, p.icono, p.nombre, p.stock, p.precio));
    } else {
        inventarioKiosco = [
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
        guardarInventario();
    }
}

function guardarInventario() {
    localStorage.setItem('inventario', JSON.stringify(inventarioKiosco));
}

// inicializa inventario desde almacenamiento cuando se cargue el script
cargarInventario();
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
function actualizarContador() {
    const contador = document.getElementById("contadorCarrito");
    if (!contador) return;

    let totalProductos = 0;

    carrito.forEach(producto => {
        totalProductos += producto.cantidad;
    });

    contador.textContent = totalProductos;
}
// Función para renderizar el catálogo de productos en la página
function renderizarCatalogo() {
    const grid = document.querySelector('.product-grid');
    // Verificar que el contenedor exista antes de intentar agregar productos
    if (!grid) return; 

    // limpiar grid antes de volver a dibujar
    grid.innerHTML = '';

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
        
        // si no hay stock, desactivar el botón
        const boton = card.querySelector('.btn-add');
        if (producto.stock === 0) {
            boton.disabled = true;
            boton.textContent = 'Agotado';
            boton.style.backgroundColor = '#888';
            boton.style.cursor = 'not-allowed';
        }

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

    //Restar el stock
    productoSeleccionado.stock -= cantidadDeseada;
    //Guardar inventario actualizado para que persista al recargar
    guardarInventario();

    //Actualiza el número que aparece en la pantalla
    document.getElementById(`stock-${idProducto}`).textContent = productoSeleccionado.stock;
    //Agregar carrito
    carrito.push({
        id: productoSeleccionado.id,
        nombre: productoSeleccionado.nombre,
        precio: productoSeleccionado.precio,
        cantidad: cantidadDeseada
    });

    //Guardar en LocalStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();
    alert("Producto agregado al carrito 🛒");

}

document.addEventListener('DOMContentLoaded', () => {
    renderizarCatalogo();
    actualizarContador();
});


// js/factura.js

const TASA_IMPUESTO = 0.13; 

let carritoCompra = JSON.parse(localStorage.getItem("carrito")) || [];

function cargarFactura() {
    const tablaBody = document.getElementById("tablaProductosBody");
    const contenidoFactura = document.getElementById("contenido-factura");
    const mensajeVacio = document.getElementById("mensaje-vacio");
    const btnFinalizar = document.getElementById("btnFinalizar");
    
    // Validar si el carrito está vacío
    if (carritoCompra.length === 0) {
        contenidoFactura.style.display = "none";
        mensajeVacio.style.display = "block";
        btnFinalizar.disabled = true;
        btnFinalizar.style.opacity = "0.5";
        btnFinalizar.style.cursor = "not-allowed";
        return;
    }

    document.getElementById("fechaFactura").textContent = new Date().toLocaleDateString();
    document.getElementById("numTransaccion").textContent = "TX-" + Math.floor(Math.random() * 1000000);

    let subtotalGeneral = 0;
    tablaBody.innerHTML = "";

    // Construir las filas de la tabla
    carritoCompra.forEach(producto => {
        const totalLinea = producto.precio * producto.cantidad;
        subtotalGeneral += totalLinea;

        const fila = `
            <tr>
                <td>${producto.nombre}</td>
                <td class="texto-derecha">${producto.cantidad}</td>
                <td class="texto-derecha">$${producto.precio.toFixed(2)}</td>
                <td class="texto-derecha">$${totalLinea.toFixed(2)}</td>
            </tr>
        `;
        tablaBody.innerHTML += fila;
    });

    // Calcular impuestos y total final
    const impuestos = subtotalGeneral * TASA_IMPUESTO;
    const totalPagar = subtotalGeneral + impuestos;

    // Actualizar el DOM con los nuevos IDs en español
    document.getElementById("montoSubtotal").textContent = "$" + subtotalGeneral.toFixed(2);
    document.getElementById("montoImpuesto").textContent = "$" + impuestos.toFixed(2);
    document.getElementById("montoTotalGeneral").textContent = "$" + totalPagar.toFixed(2);
}

function registrarHistorico(detalles) {
    const hist = JSON.parse(localStorage.getItem('historico')) || [];
    hist.push(detalles);
    localStorage.setItem('historico', JSON.stringify(hist));
}

function finalizarCompra() {
    if (carritoCompra.length === 0) return;

    if (confirm("¿Confirmar compra y finalizar?")) {
        // calcular montos nuevamente para guardar en historial
        let subtotal = 0;
        carritoCompra.forEach(p => subtotal += p.precio * p.cantidad);
        const impuestos = subtotal * TASA_IMPUESTO;
        const totalPagar = subtotal + impuestos;

        const detalles = {
            fecha: new Date().toLocaleString(),
            transaccion: document.getElementById("numTransaccion").textContent,
            items: carritoCompra,
            subtotal: subtotal,
            impuestos: impuestos,
            total: totalPagar
        };
        registrarHistorico(detalles);

        localStorage.removeItem("carrito");
        alert("¡Compra realizada con éxito! Gracias por su preferencia.");
        window.location.href = "index.html";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    cargarFactura();
    
    const btnFinalizar = document.getElementById("btnFinalizar");
    if (btnFinalizar) {
        btnFinalizar.addEventListener("click", finalizarCompra);
    }
});