//Constantes a utilizar
const contenedorProductos = document.querySelector("#contenedorProductos")
const contenedorCarrito = document.getElementById("carrito-contenedor")
const contadorCarrito = document.querySelector("#contadorCarrito")
const botonVaciar = document.querySelector("#vaciarCarrito")
const precioTotal = document.querySelector("#precioTotal")
const botonConfirmar = document.querySelector("#confirmBuy")

let carrito = []

//JSON GET
document.addEventListener('DOMContentLoaded', () => {
localStorage.getItem('carrito')? (carrito = JSON.parse(localStorage.getItem('carrito')), actualizarCarrito()): null
})

//Inyecto HTML al DOM
fetch("Productos.json")
    .then((resp)=>resp.json())
    .then((Productos)=>{
        Productos.forEach((producto)=>{
            const div = document.createElement("div")
            div.classList.add("producto")
            div.innerHTML = `
            <div class="p-2 border-product">
            <img src="${producto.img}" alt="" class="w-100 d-block" id="cortina1Info">
            <h2>${producto.nombre}</h2>
            <label for="">Precio: $${producto.precio}</label>
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
    })
})
.catch((err)=>console.log("err")) 

//Función para agregar al carrito (Valga la redundancia)
const agregarAlCarrito = (prodID) =>{
//Verifica si no se ha añadido el mismo producto anteriormente
    fetch("Productos.json")
    .then((resp)=>resp.json())
    .then((Productos)=>{
        const existe = carrito.some(prod => prod.id === prodID)
        let prod;
        let item;
        existe? (prod = carrito.map (prod => {
            if(prod.id === prodID) prod.cant++
        })):(item = Productos.find ((producto) => producto.id === prodID), carrito.push(item))
        actualizarCarrito()
    })
}



//Elimina todo el pedido de un producto 
const eliminarDelCarrito = (prodID) =>{
    const item = carrito.find ((prod) => prod.id === prodID)
    const i = carrito.indexOf(item)
    carrito.splice(i, 1)
    actualizarCarrito()
}

//Suma un porducto al carrito
const sumar = (prodID) =>{
    agregarAlCarrito(prodID)
}

//Resta de un producto
const restar = (prodID) =>{
    const item = carrito.find ((prod) => prod.id === prodID)
    item.cant--
    if (item.cant === 0) {
        eliminarDelCarrito(prodID)
    }
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
        <button onclick="restar(${prod.id})" class="">-</button>
        <button onclick="eliminarDelCarrito(${prod.id})" class="">X</button>
        <button onclick="sumar(${prod.id})" class="">+</button>
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

//Confirma la compra desde compras.html
botonConfirmar.addEventListener("click",()=>{
    //Verifico que haya algo en el carrito antes de pedir datos
    if(carrito.length>0){
        (async () => {
            const { value: formValues } = await Swal.fire({
                footer: 'Debes rellenar TODOS los campos',
                title: 'Datos de tarjeta y usuario',
                html:
                    '<h4>Nombre completo</h4>'+
                    '<input type="text" id="swal-input1" class="swal2-input" placeholder="Fulanito de tal" required>'+
                    '<h4>DNI</h4>'+
                    '<input type="number" id="swal-input2" class="swal2-input" placeholder="12345678" required>'+
                    '<h4>Email</h4>'+
                    '<input type="email" id="swal-input3" class="swal2-input" placeholder="example@example.com" required>' +
                    '<h4>Código de la tarjeta</h4>'+
                    '<input type="number" id="swal-input4" class="swal2-input" placeholder="0000-0000-0000-0000" required>'+
                    '<h4>CCV</h4>'+
                    '<input type="password" id="swal-input5" class="swal2-input" placeholder="123" required>' +
                    '<h4>Vencimiento</h4>'+
                    '<input type="date"id="swal-input6" class="swal2-input" placeholder="10/10/2022" required>'+
                    '<h4>Domicilio</h4>'+
                    '<input type="text" id="swal-input7" class="swal2-input" placeholder="Avenida Siempreviva 742" required>',
                focusConfirm: true,
                preConfirm: () => {
                    return [
                ]
            } 
            })
            
            if (formValues) {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger'
                    },
                    buttonsStyling: false
                    })
                    swalWithBootstrapButtons.fire({
                        title: 'Estás por finalizar la compra ¿desea confirmar?',
                        text: "Verifique los datos de su tarjeta para proceder correctamente",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Si, comprar!',
                        cancelButtonText: 'No, aún no!',
                        reverseButtons: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                        swalWithBootstrapButtons.fire(
                            'Confirmado',
                            'Tu pedido será preparado para el envío 🥳',
                            'success',
                        )
                            carrito.length = 0
                            contadorCarrito.innerText = 0
                            precioTotal.innerText = 0
                            actualizarCarrito()
                    } else if (result.dismiss === Swal.DismissReason.cancel){
                        swalWithBootstrapButtons.fire(
                        'Todo joya! 🤙',
                        'Podés seguir comprando!',
                        'error'
                    )}
                }) 
            }
        })
        ()
    }else{
        Toastify({
            text: "Primero sumá algo al carrito!",
            duration: 3000,
            gravity: 'bottom',
            position: 'right',
            style: {
                background: "red",
            },
        }).showToast();
    }
}) 