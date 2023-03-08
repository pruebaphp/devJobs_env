
window.onload = ()=>{
    const inputHTML = document.querySelector('.inputHTML').value;
    mostrarHTML(inputHTML);
}

const mostrarHTML = (html)=>{
    document.querySelector('.vacante-descripcion').innerHTML = html;
}
