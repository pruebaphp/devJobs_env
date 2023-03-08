

document.addEventListener('DOMContentLoaded',function(){
    verificarAlertas();
})

function verificarAlertas(){
    const alertas = document.querySelector('.alertas');

    if(alertas){
        setTimeout(() => {
            alertas.remove();
        }, 5000);
    }
}