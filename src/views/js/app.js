const sideBar = document.getElementById("sideBar");
const contentPage = document.getElementById("contentPage");
const btnMenu = document.getElementById("btnMenu");

btnMenu.onclick = () =>{
const sideBarHasClass = sideBar.classList.contains('d-none');
const contentHasClass = contentPage.classList.contains('col-md-10'); 

if (sideBarHasClass) {
     sideBar.classList.remove("d-none"); 
     sideBar.classList.add('col-md-2');
     contentPage.classList.remove('col-md-12'); 
     contentPage.classList.add('col-md-10'); 
}else{
     
     sideBar.classList.remove("col-md-2");
     sideBar.classList.add("d-none");
     contentPage.classList.add('col-md-12');
     contentPage.classList.remove('col-md-10');
     
}

};

