function CambiarStatus(id){
    fetch('/Ventas/Cambiar/'+id, {
        method:"GET"
    }).then(res => { alert('Status cambiado')})
}