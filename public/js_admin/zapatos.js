$("#precio").change(() => {
    if($("#precio").val() < 0){
        $("#precio").val(0)
    }
})

$("#stock").change(() => {
    if($("#stock").val() < 0){
        $("#stock").val(0)
    }
})