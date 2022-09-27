
//Stock
const Productos = [
    {id:1, nombre: "Cortina 1", precio: 5500, stock: 5, descripcion:"Roja, 2x4m", tipo :"cortina", img: 'imagenes/cortinas/cortina1.jpg', cant:1},
    {id:2, nombre: "Cortina 2", precio: 27500, stock: 0, descripcion:"Celeste, 2.5x4m", tipo :"cortina", img: 'imagenes/cortinas/cortina2.jpg', cant:1},
    {id:3, nombre: "Cortina 3", precio: 1850, stock: 6, descripcion:"Gris 2.5x3m", tipo :"cortina", img: 'imagenes/cortinas/cortina3.jpg', cant:1},
    {id:4, nombre: "Mantel 1", precio: 2350, stock: 8, descripcion:"Blanco, 3x2m", tipo: "mantel", img: 'imagenes/manteles/mantel1.jpg', cant:1},
    {id:5, nombre: "Mantel 2", precio: 2850, stock: 3, descripcion:"Cuadriculado 3x2m", tipo: "mantel", img: 'imagenes/manteles/mantel2.jpg', cant:1},
    {id:6, nombre: "Mantel 3", precio: 23500, stock: 2, descripcion:"Gris 3x2m", tipo: "mantel", img: 'imagenes/manteles/mantel3.jpg', cant:1},
]

//Constantes a utilizar
const contenedorProductos = document.querySelector("#contenedorProductos")
const contenedorCarrito = document.getElementById("carrito-contenedor")
const contadorCarrito = document.querySelector("#contadorCarrito")
const botonVaciar = document.querySelector("#vaciarCarrito")
const precioTotal = document.querySelector("#precioTotal")

let carrito = [] //carrito

//JSON GET
//operador avanzado if
document.addEventListener('DOMContentLoaded', () => {
localStorage.getItem('carrito')? (carrito = JSON.parse(localStorage.getItem('carrito')), actualizarCarrito()): null
})

//Inyecto HTML al DOM
Productos.forEach((producto) => {
    const div = document.createElement("div")
    div.classList.add("producto")
    div.innerHTML = `
        <div class="p-2 border-product">
        <img src="${producto.img}" alt="" class="w-100 d-block" id="cortina1Info">
        <h2>${producto.nombre}</h2>
        <label for="">Precio: $${producto.precio}</label>
        <!--<p id="stock${producto.id}" style="font-size: 1rem;">Stok: ${producto.stock} ${producto.tipo} </p> AQUÍ VA UNA FUNCION A FUTURO-->
        <p  style="font-size: 1rem;"> ${producto.tipo} ${producto.descripcion} </p>
        <div class="container">
            <div class="row">
                <div class="col text-center">
                    <a class="btn btn-green my-2" id="agregar${producto.id}">Añadir al carrito</a>
                </div>
            </div>
        </div>
    </div>
    `
    contenedorProductos.appendChild(div)
//Boton para agregar al carrito
    const boton = document.querySelector(`#agregar${producto.id}`)
    boton.addEventListener("click", () => {
        agregarAlCarrito(producto.id);
        Toastify({
            text: "Añadido al carrito",
            duration: 3000,
            gravity: 'bottom',
            position: 'right'
        }).showToast();
    }); 
}); 


//Función para agregar al carrito (Valga la redundancia)
const agregarAlCarrito = (prodID) =>{
//Verifica si no se ha añadido el mismo producto anteriormente
    const existe = carrito.some(prod => prod.id === prodID)
    //defino las variables antes porque dentro del operador ternario no me deja
    let prod;
    let item;
    existe? (prod = carrito.map (prod => {
        if(prod.id === prodID) prod.cant++
    })):(item = Productos.find ((producto) => producto.id === prodID), carrito.push(item))
    actualizarCarrito()
}

//Elimina todo el pedido de un producto 
const eliminarDelCarrito = (prodID) =>{
    const item = carrito.find ((prod) => prod.id === prodID)
    const i = carrito.indexOf(item)
    carrito.splice(i, 1)
    actualizarCarrito()
}

//Actualiza el estado del carrido despues de cada interacción
const actualizarCarrito = () => {
    contenedorCarrito.innerHTML = ""
    carrito.forEach((prod) => {
        const div = document.createElement('div')
        div.className = ('productoEnCarrito')
        div.innerHTML = `
        <p>${prod.nombre}</p>
        <p>Precio:$${prod.precio}</p>
        <p>Cantidad: <span id="cantidad">${prod.cant}</span></p>
        <button onclick="eliminarDelCarrito(${prod.id})" class="boton-eliminar">X</button>
        `
        contenedorCarrito.appendChild(div);
        localStorage.setItem('carrito', JSON.stringify(carrito));//JSON setItem backupea al agregar cada producto
    })
    contadorCarrito.innerText = carrito.length //Actualiza el contador de productos
    precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.precio * prod.cant, 0) //Suma el precio
    localStorage.setItem('carrito', JSON.stringify(carrito))//JSON setItem backupea al ELIMINAR todos los productos
}

//Vacía TOTALMENTE el carrito
botonVaciar.addEventListener("click",()=>{
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: '¿Estás seguro de querer vaciar el carrito?',
            text: "Despues de acptar no habrá vuelta atrás!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, vaciar!',
            cancelButtonText: 'No, era joda!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
            swalWithBootstrapButtons.fire(
                'Vaciado!',
                'Tu carrito fue devalijado 😱',
                'success',
                
            )
                carrito.length = 0
                contadorCarrito.innerText = 0
                precioTotal.innerText = 0
                actualizarCarrito()
        } else if (
          /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire(
            'Todo joya! 🤙',
            'tu carrito está a salvo :)',
            'error'
        )
        }
    })





   
})