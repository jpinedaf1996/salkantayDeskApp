const newOrden = () => $("#modalOrden").modal("show");
const modalPromo = () => $("#modalPromo").modal("show");

$(document).ready(() => {
    allProducts();
    getTableOrden();
});
let listProductsInOrden = null;

const drawTable = async (id_orden) => {
    let response = await new GetInfoByFetch(`${url.apiordendetalle}ordendetbyproducto/${id_orden}`).request();
    let content = document.getElementById("container-table-producto");
    let totalapagarcontent = document.getElementById("totalapagar");
    let totalApagar = 0;

    content.innerHTML = " ";
    totalapagarcontent.innerHTML = " ";

    response.forEach(productos => {
        
        totalApagar += parseFloat((productos.producto.precio * productos.unidades).toFixed(2));

        let detalleOrden = `<tr>
                                <td ><img src="../../image/${productos.producto.imagen}" width="50px" alt="" srcset=""> </td>
                                <td>${productos.producto.producto} - $${productos.producto.precio}</td>
                                <td>
                                <div onClick='remove(${productos.ordendetId},${productos.unidades})' class="btn btn-danger btn-sm float-left">-</div>
                                <span> ${productos.unidades} </span>
                                <div onClick='add(${productos.ordendetId},${productos.unidades})' class="btn btn-primary btn-sm float-right">+</div>
                                </td>
                                <td>
                                <strong>$${parseFloat(productos.producto.precio * productos.unidades).toFixed(2)}</strong>
                                </td>
                                <td><i onClick='deleteDatail(${productos.ordendetId})' class="fas fa-trash text-danger cursor"></i></td>
                        </tr>`;
        content.insertAdjacentHTML('beforeEnd', detalleOrden);
    });

    totalapagarcontent.innerHTML = `$${totalApagar}`;
    return listProductsInOrden = response;
}
const deleteDatail = async (detalleId) => {
    const response = await new GetInfoByFetch(
        `${url.apiordendetalle}${detalleId}`,
        'DELETE')
        .request();

    drawTable(ordenId);
}
const remove = async (detalleId, unidadesActuales) => {
    if (unidadesActuales > 1) {
        const response = await new GetInfoByFetch(
            `${url.apiordendetalle}${detalleId}`,
            'PUT',
            new URLSearchParams({
                'unidades': unidadesActuales - 1,
            })
        ).request();
        drawTable(ordenId);
    }

}
const add = async (detalleId, unidadesActuales) => {
    await new GetInfoByFetch(
        `${url.apiordendetalle}${detalleId}`,
        'PUT',
        new URLSearchParams({
            'unidades': unidadesActuales + 1,
        })
    ).request();
    drawTable(ordenId);
}

let beforElement = null; // Este elemento se actualiza con el elemento HTML seleccionado  
// para validar cual fue la ultima selecionada para que se pinte en pantalla 
// estp es pa poder quitar la clase selected-table del ultimo y agregarla a uno nuevo

let ordenId = 0; //Ninguna mesa a sido seleccionado 

const detailOrden = async (id_orden) => {

    let element = event.currentTarget; // Elemento HTML actulamento seleccionado
    ordenId = id_orden; //La mesa seleccionada se guarda ena variable global

    if (ordenId != 0) {
        drawTable(id_orden); // Se pinta la tabla en pantalla 
    }
    if (beforElement === null) {
        element.classList.add("selected-table");
        return beforElement = element;

    } else {
        beforElement.classList.remove("selected-table");
        element.classList.add("selected-table");
        return beforElement = element;
    }
}

const saveProductToOrden = async (productoId,precio) => {

    if (parseInt(ordenId) === 0) {
        return console.log("Seleccione una orden para agrehar producto");
    }
    const resultado = listProductsInOrden.find(producto => producto.productoId === productoId);
    if (typeof resultado == 'undefined') {
        await new GetInfoByFetch(
            `${url.apiordendetalle}`,
            'POST',
            new URLSearchParams({
                'ordenId': ordenId,
                'precio' : precio,
                'productoId': productoId,
                'unidades': 1,
            })
        ).request();
    } else {
        await new GetInfoByFetch(
            `${url.apiordendetalle}${resultado.ordendetId}`,
            'PUT',
            new URLSearchParams({
                'precio' : precio,
                'unidades': resultado.unidades + 1,
            })
        ).request()
    }

    drawTable(ordenId);
}
const searchByname = () => {
    const inputSearch = document.getElementById("searchByNames");
    filterItems(inputSearch.value)
}
const addToOrdenPending = async (id, estado) => {
    let response = await new GetInfoByFetch(`${url.apiordenes}/newOrden/${id}`, 'PUT', new URLSearchParams({
        'estado': estado
    })).request();
    if (response.success) {
        $("#modalTables").modal("hide");
        getTableOrden();
    }
}
const getTableOrden = async () => {

    let response = await new GetInfoByFetch(`${url.apiordenes}ordenbymesa`).request();
    let content = document.getElementById('orden-tables');
    content.innerHTML = " ";
    content.innerHTML =
        `<div class="pending-orders bg-info text-white">
            Para llevar
          </div>`;

    response.map((tables) => {
        let table = `
                <div onclick="detailOrden(${tables.ordenId});" class="pending-orders text-white">
                ${tables.mesa.num_mesa}
                </div>
            `;
        content.insertAdjacentHTML('beforeEnd', table);
    });

};
const selecTable = async () => {
    $("#modalOrden").modal("hide");
    $("#modalTables").modal("show");
    let response = await new GetInfoByFetch(`${url.apimesas}0`).request();
    let content = document.getElementById('selectTable');
    content.innerHTML = " ";

    response.map((tables) => {
        let table = `
      <div onclick="addToOrdenPending(${tables.mesaId},${tables.estado});"  class="select-table col-sm-2 bg-primary border text-white">
        ${tables.num_mesa}
          </div>
            `;

        content.insertAdjacentHTML('beforeEnd', table);
    });

}

let listProducts = null;

const filterItems = query => {
    const content = document.getElementById('container-productos');
    content.innerHTML = " ";
    document.getElementById('container-list-product').innerHTML = " ";

    return listProducts.filter((item) =>
        item.producto.toLowerCase().indexOf(query.toLowerCase()) > -1
    ).map(item => {
        const products = `
            <div id="productCard" class="card product text-dark animate__animated animate__bounce" style="width: 11rem;">
                <img   class="card-img-top" height="125px" src="http://localhost:3000/previews/${item.imagen}" alt="Card image cap">
                <div onClick='saveProductToOrden(${item.productoId},${item.precio});' class="card-body text-center"  >
                    <p class="card-text"><strong>${item.producto.toUpperCase()}(${item.desc})</strong></p>
                    <p class="card-text"><strong><span class="badge badge-text-size badge-info">$${item.precio}</span></strong></p>
                </div>
            </div>               
                `;
        content.insertAdjacentHTML('beforeEnd', products);
    })
}

const productsByCategory = async () => {
    let response = await new GetInfoByFetch(url.apicategory).request();
    document.getElementById('container-productos').innerHTML = " ";
    document.getElementById('container-list-product').innerHTML = " ";

    response.map((category) => {
        const categoria = `
            <div id="${category.categoriaId}" onclick="getProductsByCategory(${category.categoriaId})" class="animate__animated animate__bounce text-warning  col-sm-2 card-category border border-warning">
                <p class="text-category" >${category.categoria.toUpperCase()}</p>
                
            </div>`;
        document.getElementById('container-productos').insertAdjacentHTML('beforeEnd', categoria);

    })
};

let selectedCat = null;

const getProductsByCategory = async (id) => {
    const content = document.getElementById('container-list-product');
    let response = await new GetInfoByFetch(`${url.products}productosBycategori/${id}`).request();
    //HACE EL FOCUS AL HACER CLICK A UNA TARGETA DE CATEGORIAS
    if (selectedCat === null) {
        $(`#${id}`).addClass("selected");
        selectedCat = id
    } else {
        $(`#${selectedCat}`).removeClass("selected")
        $(`#${id}`).addClass("selected")
        selectedCat = id
    }
    if (response.length > 0) {
        content.innerHTML = " ";
        response.map((productos) => {
            const products = `
            <div id="productCard" class="card product text-dark animate__animated animate__bounce" style="width: 11rem;">
                <img   class="card-img-top" height="125px" src="http://localhost:3000/previews/${productos.imagen}" alt="Card image cap">
                <div onClick='saveProductToOrden(${productos.productoId},${productos.precio});' class="card-body text-center"  >
                    <p class="card-text"><strong>${productos.producto.toUpperCase()}(${productos.desc})</strong></p>
                    
                </div>
                <p class="card-text"><span class="badge badge-text-size badge-info">$${productos.precio}</span></p>
            </div>               
                `;
            content.insertAdjacentHTML('beforeEnd', products);

        });
        //alertify.success("Producto agregado con exito!");
    } else {
        content.innerHTML = "SIN PRODUCTOS"
    }
}

const allProducts = async () => {
    const content = document.getElementById('container-productos');
    document.getElementById('container-list-product').innerHTML = " ";
    let response = await new GetInfoByFetch(`${url.products}`).request();

    if (response.length > 0) {
        content.innerHTML = " ";

        response.map((productos) => {
            const products = `
                <div onClick='saveProductToOrden(${productos.productoId},${productos.precio});' id="productCard" class="card product text-dark animate__animated animate__bounce" style="width: 11rem;">
                    <img   class="card-img-top" height="125px" src="http://localhost:3000/previews/${productos.imagen}" alt="Card image cap">
                    <div  class="card-body"  >
                        <p class="card-text">
                        <strong>${productos.producto.toUpperCase()}</strong><br>
                        (${productos.desc})
                        </p>
                        <p class="card-text"><span class="badge badge-text-size badge-info">$${productos.precio}</span></p>
                    </div>
                </div>               
                `;
            content.insertAdjacentHTML('beforeEnd', products);

        });
        //alertify.success("Producto agregado con exito!");
        return listProducts = response;

    } else {
        content.innerHTML = "SIN PRODUCTOS"
    }

}
