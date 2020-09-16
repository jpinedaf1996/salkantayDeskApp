const urluser = 'http://localhost:3000/apiv0.1/users/';
const urlCategory = 'http://localhost:3000/apiv0.1/category/';

const redirect = (id) =>{
    switch (id) {
        case 'reportes':
            window.location.href = "reportes.ejs";
            break;
        case 'productos':
            window.location.href = "productos.ejs";
            break;
        default:
            break;
    }
}
const validarToken = async () => {
    const response = await fetch(urluser + 'validarToken', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token': sessionStorage.getItem("token")
        }

    });
    
    return response.json();
}