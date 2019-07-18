function AddToCart(id, cantidad){
    const item = {
        producto:id,
        cantidad
    }
    fetch('/Cart/add', {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(item)
    }).then(resp =>{
        return resp.json();
    }).then(json =>{
        if(json.err){
            if(json.err === "0x403"){
                Swal.fire({
                    type: 'error',
                    title: 'No haz iniciado sesión',
                    text: 'Para poder agregar a tu carrito, inicia sesión',
                    footer: '<a href="/login">Inciar Sesión</a>'
                })
            }
        }
        if(json.status){
            
            if(json.status === "0x200"){
                let items_carrito = json.carrito.items
                for(let i = 0; i< items_carrito.length; i++){
                    $("#sub_"+items_carrito[i].idProducto).text("$"+items_carrito[i].subtotal.toFixed(2))
                }
                $("#sub_carrito").text("$"+json.carrito.subtotal.toFixed(2))
                $("#iva_carrito").text("$"+json.carrito.iva.toFixed(2))
                $("#total_carrito").text("$"+json.carrito.total.toFixed(2))

                Swal.fire(
                    'Producto Agregado',
                    'Tu producto fue agregado',
                    'success'
                  )
            }
        }
    })
}

function RemoveToCart(id, cantidad){
    const item = {
        producto:id,
        cantidad
    }
    fetch('/Cart/remove', {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(item)
    }).then(resp =>{
        return resp.json();
    }).then(json =>{
        if(json.err){
            if(json.err === "0x403"){
                Swal.fire({
                    type: 'error',
                    title: 'No haz iniciado sesión',
                    text: 'Para poder agregar a tu carrito, inicia sesión',
                    footer: '<a href="/login">Inciar Sesión</a>'
                })
            }
        }
        if(json.status){
            
            if(json.status === "0x200"){
                let items_carrito = json.carrito.items
                for(let i = 0; i< items_carrito.length; i++){
                    $("#sub_"+items_carrito[i].idProducto).text("$"+items_carrito[i].subtotal.toFixed(2))
                }
                $("#sub_carrito").text("$"+json.carrito.subtotal.toFixed(2))
                $("#iva_carrito").text("$"+json.carrito.iva.toFixed(2))
                $("#total_carrito").text("$"+json.carrito.total.toFixed(2))

                Swal.fire(
                    'Producto removido',
                    'Tu producto fue removido',
                    'info'
                  )
            }
        }
    })
}

