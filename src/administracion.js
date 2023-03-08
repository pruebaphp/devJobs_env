import axios from "axios";
import Swal from "sweetalert2";

const btnsEliminar = document.querySelectorAll('.btn-rojo');

window.onload = ()=>{

    btnsEliminar.forEach(e=>{
        e.addEventListener('click',eliminarVacante);
    })

}

function eliminarVacante(e){
    e.preventDefault();
    const idVacante = e.target.getAttribute('data-id');

    //preguntando si quiere o no eliminar la vacante


    Swal.fire({
        title: 'Confirmar Eliminación?',
        text: "Una vez eliminada, no se puede recuperar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
            //enviar peticion con axios
            const url = `${location.origin}/vacantes/eliminar/${idVacante}`;
            console.log(url);
            //Axions para eliminar el registro
            axios.delete(url,{params:{url}})
                .then(function(respuesta){
                    if(respuesta.status === 200){
                        Swal.fire(
                            'Buen trabajo!',
                            respuesta.data,
                            'success'
                          )

                        //eliminando dicho div, para que sea más dinámico
                        const elementoPadreDiv = e.target.parentElement.parentElement;
                        elementoPadreDiv.remove();
                    }
                })
                .catch(()=>{
                    Swal.fire(
                        'Algo salió mal',
                        'Hubo un error',
                        'error',
                    )
                })



       
        }
      })



    const btnEliminar = document.querySelector('.btn-rojo')

    if(!btnEliminar){
        setTimeout(() => {
            alert('Ya no hay más vacantes');
        }, 2000);
        
    }
}