const links = {
     urluser: 'http://localhost:3000/apiv0.1/users/',
     products: 'http://localhost:3000/apiv0.1/products/',
     urlCategory: 'http://localhost:3000/apiv0.1/category/'
}

const closeSesion=()=>{
     window.location.href = "index.ejs";
     sessionStorage.setItem('token',0);
}
const redirect = (id) => {
     switch (id) {
          case 'reportes':
               window.location.href = `${id}.ejs`;
               break;
          case 'productos':
               
               window.location.href = `${id}.ejs`;
               break;
          default:
               window.location.href = "index.ejs";
               break;
     }
}

const validarToken = async () => {
     const response = await fetch(links.urluser + 'validarToken', {
          method: 'GET',
          headers: {
               'Content-Type': 'application/json',
               'token': sessionStorage.getItem("token")
          }

     });

     return response.json();
}

const btnMenu = document.getElementById("btnMenu");

if (btnMenu) {
     btnMenu.onclick = () => {
          const sideBar = document.getElementById("sideBar");
          const contentPage = document.getElementById("contentPage");
          const sideBarHasClass = sideBar.classList.contains('d-none');

          if (sideBarHasClass) {
               sideBar.classList.remove("d-none");
               sideBar.classList.add("col-md-2");
               contentPage.classList.remove('col-md-12');
               contentPage.classList.add('col-md-10');

          } else {

               sideBar.classList.remove("col-md-2");
               sideBar.classList.add("d-none");
               contentPage.classList.add('col-md-12');
               contentPage.classList.remove('col-md-10');

          }

     };

}



