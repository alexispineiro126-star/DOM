function actualizarcarrito(){
    let lista = document.getElementById("lista")
    lista.innerHTML = ""
    let total = 0
    carrito.forEach(panaderia =>{
        let item = document.createElement("li")
        const cantidad = panaderia.cantidad
        item.textContent = `${panaderia.nombre} - $${panaderia.precio} x ${cantidad}`
        lista.appendChild(item)
        total += panaderia.precio * cantidad
    })
    document.getElementById("total").textContent = `Total: $${total.toFixed(2)}`
}

botones.forEach((boton, index) => {
    boton.addEventListener("click", () => {
        const producto = panaderia[index]
        const productoEnCarrito = carrito.find(item => item.id === producto.id)
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += 1
        } else {
            carrito.push({...producto, cantidad: 1})
        }
        actualizarcarrito()
    })
})

vaciar.addEventListener("click",()=> {
    if(confirm("Estas seguro que deseás vaciar el carrito?")){
        carrito.length = 0
        actualizarcarrito()
    }
})

abrir.addEventListener("click", () =>{
    panelCarrito.classList.add("active")
})

cerrar.addEventListener("click", () =>{
    panelCarrito.classList.remove("active")
})

buscar.addEventListener("input",() =>{
    const textoBusqueda = buscar.value.toLowerCase()
    productos.forEach(item =>{
        const nombre = item.querySelector("h3").textContent.toLowerCase()
        item.classList.toggle("oculto", !nombre.includes(textoBusqueda))
    })
})

formulario.addEventListener("submit", (evento) =>{
    evento.preventDefault()
    const nombre = document.getElementById("nombre").value
    const precio = parseFloat(document.getElementById("precio").value)
    const cantidad = parseInt(document.getElementById("cantidad").value)
    const producto = {nombre, precio, cantidad}
    carrito.push(producto)
    actualizarcarrito()
    formulario.reset()
})