function Rastrear(){
    var OrdenID = $("#order").val();
    fetch('/tracking',{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({OrdenID})
    }).then(resp => {return resp.json()})
    .then(json => {
        if(json.status == 1){
            Swal.fire(
                'Orden en proceso',
                'Tu orden esta siendo procesada para el envio',
                'info'
              )
        }
    })
}