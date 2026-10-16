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
const formulario = document.getElementById("formulario")
const selecionProducto = document.getElementById("producto-compra")
const busqueda = document.getElementById("busqueda")

function renderizarProductos() {
    listaProductos.replaceChildren()
    selecionProducto.replaceChildren()
panaderia.forEach(producto => {
    const opcion = document.createElement("option")
    opcion.value = producto.id
    opcion.textContent = producto.nombre
    selecionProducto.appendChild(opcion)
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

busqueda.addEventListener("input", () => {
    const texto = busqueda.value.toLocaleLowerCase()
    listaProductos.querySelectorAll(".box").forEach(tarjeta => {
        const nombre = tarjeta.querySelector("h3").textContent.toLocaleLowerCase()
        tarjeta.classList.toggle("oculto", !nombre.includes(texto))
    })
})

formulario.addEventListener("submit", evento => {
    evento.preventDefault();
    const producto = panaderia.find(item => item.id === Number(selecionProducto.value))
    const cantidad = Number(document.getElementById("cantidad").value)
    if (!producto || !Number.isInteger(cantidad) || cantidad < 1) {
        return;
    }
    agregarAlCarrito(producto, cantidad)
    formulario.reset()
})
renderizarProductos()
