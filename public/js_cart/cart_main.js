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
                Swal.fire(
                    'Producto Agregado',
                    'Tu producto fue agregado',
                    'succcess'
                  )
            }
        }
    })
}

