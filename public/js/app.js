const listaSkills = document.querySelectorAll('.lista-conocimientos li');
const skillsDeVacante =document.querySelector('#skills');
let skillsSeleccionadas=[];

window.onload = ()=>{
    const skills = document.querySelector('.lista-conocimientos');

    if(skills){
        skills.addEventListener('click',agregarSkills)
    }

    if(skillsDeVacante){
    skillsSeleccionadas = JSON.parse(skillsDeVacante.value);
    }
    ActivarSkillsDeVacantes(listaSkills);
    cargarInputSkills(skillsSeleccionadas);
    eliminarAlertas();

}

function cargarInputSkills(skillsSeleccionadas){
    if(skillsDeVacante){
    skillsDeVacante.value = skillsSeleccionadas;
}
}


function ActivarSkillsDeVacantes(listaSkills){
    listaSkills.forEach(element => {
        skillsSeleccionadas.forEach(skill=>{
            console.log(`${element.textContent} == ${skill}`)
            if(element.textContent===skill){
                element.classList.add('activo');
           };
        })

    });
}


function agregarSkills(e){
   if(e.target.tagName==='LI'){
       if(e.target.classList.contains('activo')){
            e.target.classList.remove('activo');
            skillsSeleccionadas = skillsSeleccionadas.filter(elemento => elemento != e.target.textContent);
            
       }else{
            e.target.classList.add('activo');
            if(!skillsSeleccionadas.some(elemento => elemento == e.target.textContent)){
                skillsSeleccionadas.push(e.target.textContent);
            }
            
       }
       
       console.log(skillsSeleccionadas);
   }

   document.querySelector('#skills').value = skillsSeleccionadas;
}

const eliminarAlertas = ()=>{
    const divAlertas = document.querySelector('.alertas');

    if(divAlertas){
        setTimeout(() => {
            divAlertas.remove();
        }, 5000);
    }
}