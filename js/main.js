const panaderia = [
    { id: 1, nombre: "pan", marca: "baguettes", precio: 1000, stock: 50 },
    { id: 2, nombre: "galletitas", marca: "Diversión", precio: 2000, stock: 50 },
    { id: 3, nombre: "facturas", marca: "central", precio: 1400, stock: 12 },
    { id: 4, nombre: "chipitas", marca: "Doña Laura", precio: 1200, stock: 5 },
    { id: 5, nombre: "torta", marca: "todo dulce", precio: 1500, stock: 4 }
]

const carrito = []
const listaProductos = document.getElementById("productos")
const listaCarrito = document.getElementById("lista")
const panelCarrito = document.querySelector(".carrito")
const formularioProducto = document.getElementById("formulario-producto")
const busqueda = document.getElementById("busqueda")

function renderizarProductos() {
    listaProductos.replaceChildren()
panaderia.forEach(producto => {
const tarjeta = document.createElement("article")
    tarjeta.className = "box"
const nombre = document.createElement("h3")
    nombre.textContent = producto.nombre
const marca = document.createElement("p")
    marca.textContent = `Marca: ${producto.marca}`
const precio = document.createElement("p")
    precio.className = "precio"
    precio.textContent = `Precio: $${producto.precio.toLocaleString("es-AR")}`
const boton = document.createElement("button")
    boton.className = "btn"
    boton.type = "button"
    boton.textContent = "+ Agregar al carrito"
    boton.addEventListener("click", () => agregarAlCarrito(producto))
    tarjeta.append(nombre, marca, precio, boton)
    listaProductos.appendChild(tarjeta)
    })
}

function agregarAlCarrito(producto, cantidad = 1) {
    const productoEnCarrito = carrito.find(item => item.id === producto.id)
    if (productoEnCarrito) {
        productoEnCarrito.cantidad += cantidad
    } else {
        carrito.push({ ...producto, cantidad })
    }
    actualizarCarrito()
}

function actualizarCarrito() {
    listaCarrito.replaceChildren()
    let total = 0
    carrito.forEach(producto => {
        const item = document.createElement("li")
        item.textContent = `${producto.nombre} - $${producto.precio.toLocaleString("es-AR")} x ${producto.cantidad}`
        listaCarrito.appendChild(item)
        total += producto.precio * producto.cantidad
    });
    document.getElementById("total").textContent = `Total: $${total.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`
}

document.getElementById("vaciar").addEventListener("click", () => {
    if (carrito.length > 0 && confirm("¿Estás seguro que deseas vaciar el carrito?")) {
        carrito.length = 0
        actualizarCarrito()
    }
})

document.getElementById("ver-carrito").addEventListener("click", () => {
    panelCarrito.classList.add("active")
})

document.querySelector(".cerrar").addEventListener("click", () => {
    panelCarrito.classList.remove("active")
})

formularioProducto.addEventListener("submit", evento => {
    evento.preventDefault()
    const nombre = document.getElementById("nombre-producto").value
    const marca = document.getElementById("marca-producto").value
    const precio = Number(document.getElementById("precio-producto").value)
    const stock = Number(document.getElementById("stock-producto").value)
    if (!nombre || !Number.isFinite(precio) || precio < 1 || !Number.isInteger(stock) || stock < 0) {
        return
    }
    const id = panaderia.length
        ? Math.max(...panaderia.map(producto => producto.id)) + 1 : 1
    panaderia.push({
        id,
        nombre,
        marca: marca || "Sin marca",
        precio,
        stock
    })
    renderizarProductos()
    filtrarProductos()
    formularioProducto.reset()
})

function filtrarProductos() {
    const texto = busqueda.value.toLocaleLowerCase()
    listaProductos.querySelectorAll(".box").forEach(tarjeta => {
        const nombre = tarjeta.querySelector("h3").textContent.toLocaleLowerCase()
        tarjeta.classList.toggle("oculto", !nombre.includes(texto))
    })
}

busqueda.addEventListener("input", filtrarProductos)

renderizarProductos()
