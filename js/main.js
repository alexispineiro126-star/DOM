const productos = [
    { id: 1, nombre: "pan", marca: "baguettes", precio: 1000, stock: 50 },
    { id: 2, nombre: "galletitas", marca: "Diversión", precio: 2000, stock: 50 },
    { id: 3, nombre: "facturas", marca: "central", precio: 1400, stock: 12 },
    { id: 4, nombre: "chipitas", marca: "Doña Laura", precio: 1200, stock: 5 },
    { id: 5, nombre: "torta", marca: "todo dulce", precio: 1500, stock: 4 }
]

const listaProductos = document.getElementById("productos")
const listaCarrito = document.getElementById("lista")
const panelCarrito = document.querySelector(".carrito")
const busqueda = document.getElementById("busqueda")
const totalCarrito = document.getElementById("total")

let carrito = []
const carritoGuardado = localStorage.getItem("carrito")

const productosGuardados = carritoGuardado !== null
    ? JSON.parse(carritoGuardado) : []

productosGuardados.forEach(({ id, cantidad }) => {
    const producto = productos.find((item) => item.id === id)
    if (producto !== undefined && cantidad > 0) {
        const cantidadFinal = cantidad > producto.stock
            ? producto.stock
            : cantidad
        carrito.push({
            id: producto.id,
            cantidad: cantidadFinal
        })
    }
})

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito))
    actualizarCarrito()
}

function buscarEnCarrito(id) {
    return carrito.find( (item) => {
        return item.id === id
    })
}

function agregarAlCarrito(id) {
    const producto = productos.find( (item) => {
        return item.id === id
    })
    const productoEnCarrito = buscarEnCarrito(id)

if (productoEnCarrito !== undefined) {
    if (productoEnCarrito.cantidad < producto.stock) {
        productoEnCarrito.cantidad++
    }
} else if (producto.stock > 0) {
    carrito.push({ id: producto.id, cantidad: 1 })
}
guardarCarrito()
}

function cambiarCantidad(id, cambio) {
    const producto = productos.find( (item) => {
        return item.id === id
    })
    const productoEnCarrito = buscarEnCarrito(id)
    if (productoEnCarrito === undefined) {
        return
    }

productoEnCarrito.cantidad += cambio

if (productoEnCarrito.cantidad <= 0) {
    eliminarDelCarrito(id)
    return
}

if (productoEnCarrito.cantidad > producto.stock) {
    productoEnCarrito.cantidad = producto.stock
}
guardarCarrito()
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter( (item) =>{
        return item.id !== id
    })
    guardarCarrito()
}

function renderizarProductos() {
    listaProductos.replaceChildren()
    productos.forEach( (producto) => {
        const tarjeta = document.createElement("article")
        tarjeta.className = "box"
        const nombre = document.createElement("h3")
        nombre.textContent = producto.nombre
        const marca = document.createElement("p")
        marca.textContent = `Marca: ${producto.marca}`
        const precio = document.createElement("p")
        precio.className = "precio"
        precio.textContent = `Precio: $${producto.precio.toLocaleString("es-AR")}`
        const stock = document.createElement("p")
        stock.textContent = `Disponible: ${producto.stock}`
        const boton = document.createElement("button")
        boton.className = "btn"
        boton.type = "button"
        boton.textContent = "+ Agregar al carrito"
        boton.addEventListener("click", () => {
            if (producto.stock === 0){
                return
            }
            agregarAlCarrito(producto.id)
        })
        tarjeta.append(nombre, marca, precio, stock, boton)
        listaProductos.appendChild(tarjeta)
    })
    filtrarProductos()
}

function actualizarCarrito() {
    listaCarrito.replaceChildren()
    let total = 0
    carrito.forEach( (item) => {
        const producto = productos.find( (productoCatalogo) => {
            return productoCatalogo.id === item.id
        })
        if(producto === undefined) {
            return
        }
        const elemento = document.createElement("li")
        const descripcion = document.createElement("span")
        descripcion.textContent = `${producto.nombre} - $${producto.precio.toLocaleString("es-AR")}`
        const controles = document.createElement("div")
        controles.className = "controles-cantidad"
        const botonRestar = document.createElement("button")
        botonRestar.type = "button"
        botonRestar.textContent = "−"
        botonRestar.addEventListener("click", () => {
            cambiarCantidad(producto.id, -1)
        })

        const cantidad = document.createElement("span")
        cantidad.textContent = item.cantidad
        const botonSumar = document.createElement("button")
        botonSumar.type = "button"
        botonSumar.textContent = "+"
        botonSumar.addEventListener("click", () => {
            if (item.cantidad >= producto.stock) {
                return
            }
            cambiarCantidad(producto.id, 1)
        })

        const botonEliminar = document.createElement("button")
        botonEliminar.type = "button"
        botonEliminar.className = "btn-eliminar"
        botonEliminar.textContent = "Eliminar"
        botonEliminar.addEventListener("click", () => {
            eliminarDelCarrito(producto.id)
        })
        controles.append(botonRestar, cantidad, botonSumar)
        elemento.append(descripcion, controles, botonEliminar)
        listaCarrito.appendChild(elemento)
        total += producto.precio * item.cantidad
    })
    totalCarrito.textContent = `Total: $${total.toLocaleString("es-AR")}`
}

function filtrarProductos() {
    const texto = busqueda.value.toLocaleLowerCase()
    const tarjetas = listaProductos.querySelectorAll(".box")

    tarjetas.forEach( (tarjeta) => {
        const nombre = tarjeta.querySelector("h3").textContent.toLocaleLowerCase()
        tarjeta.classList.toggle("oculto", !nombre.includes(texto))
    })
}

document.getElementById("vaciar").addEventListener("click", () => {
    carrito = []
    guardarCarrito()
})

document.getElementById("ver-carrito").addEventListener("click", () => {
    panelCarrito.classList.add("active")
})

document.querySelector(".cerrar").addEventListener("click", () => {
    panelCarrito.classList.remove("active")
})

busqueda.addEventListener("input", filtrarProductos)

renderizarProductos()
actualizarCarrito()
