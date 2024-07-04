const shopContent = document.getElementById("shopContent");
const vistaCarrito = document.getElementById("vistaCarrito");
const modalBoxContainter = document.getElementById("modalBoxcontainer");
const cantCarrito = document.getElementById("cantCarrito");

let carrito = JSON.parse(localStorage.getItem("carro")) || []

const getProducts = async () => {
    const respuesta = await fetch("data.json");
    const data = await respuesta.json();

    data.forEach((product) => {
        let content = document.createElement("div");
        content.className = "card"
        content.innerHTML = `
            <img src= "${product.imagen}">
            <h3>${product.nombre}</h3>
            <p class="price">${product.precio} $</p>
        `;
    
        shopContent.append(content);
    
        let comprar = document.createElement("button")
        comprar.innerText = "comprar";
        comprar.className = "comprar";
    
        content.append(comprar);
    
        comprar.addEventListener("click",() => {
            
            const repeat = carrito.some((repeatProduct) => repeatProduct.id === product.id);
    
            if (repeat) {
                carrito.map((prod) => {
                    if(prod.id === product.id) {
                        prod.cantidad++;
                    }    
                })
            }   else {
                carrito.push({
                id: product.id,
                imagen: product.imagen,
                nombre: product.nombre,
                precio: product.precio,
                cantidad : product.cantidad,
                });
            }
            console.log(carrito)
        
            carritoContador()
            guardarLocal();
        });
    });
    
    
    const dibujarCarrito = () => {
        modalBoxContainer.innerHTML = "";
        modalBoxContainer.style.display = "flex"
        const modalHeader = document.createElement("div")
        modalHeader.className= "modal-header"
        modalHeader.innerHTML = `
        <h1 class="Modal-header-title">Carrito</h1>
        `;
    
        modalBoxContainer.append(modalHeader);
    
        const modalbutton = document.createElement("h1")
        modalbutton.innerText ="x";
        modalbutton.className = "modal-header-button";
    
        modalbutton.addEventListener("click", () => {
            modalBoxContainer.style.display = "none";
        })

       
        modalHeader.append(modalbutton);
    
        carrito.forEach((product) => {
        let carritoContent = document.createElement("div")
        carritoContent.className = "modal-content";
        carritoContent.innerHTML = `
            <img src="${product.imagen}">
            <h3>${product.nombre}</h3>
            <p>${product.precio} $</p>
            <span class="resta"> - </span> 
            <p>cantidad: ${product.cantidad}</p>
            <span class="suma"> + </span>
            <p>total: ${product.cantidad * product.precio}</p>
            `;
    
        modalBoxContainer.append(carritoContent)
        
        let productrestar = carritoContent.querySelector(".resta")
        productrestar.addEventListener("click", () => {
            if (product.cantidad  !==1) {
                product.cantidad--;
            }
            guardarLocal();
            dibujarCarrito();
        });
        
        let productSumar = carritoContent.querySelector(".suma");
        productSumar.addEventListener("click", () => {
            product.cantidad++;
            guardarLocal();
            dibujarCarrito();
        });
    
    
    
        let descartar = document.createElement("span"); 
        descartar.innerText = "🗑";
        descartar.className = "descartar-product"
        carritoContent.append(descartar);
    
        descartar.addEventListener("click", descartarProducto);
        }); 
    
        const total = carrito.reduce((acc,el) => acc + el.precio * el.cantidad, 0);
    
        const totalBuy = document.createElement("div");
        totalBuy.className = "total-content";
        totalBuy.innerHTML = `Total a pagar: ${total} $`;
        modalBoxContainer.append(totalBuy);
        
    };
    
    vistaCarrito.addEventListener("click", dibujarCarrito);
    
    const descartarProducto = () => {
        const foundId = carrito.find((element) => element.id);
    
        carrito = carrito.filter((carritoId) => {
            return carritoId !== foundId;
        });
    
        carritoContador();
        guardarLocal();
        dibujarCarrito();
    }
};
    
getProducts();

// configuracion local storage
const guardarLocal = () => {
    localStorage.setItem("carro", JSON.stringify(carrito));
};

const carritoContador = () => {
    cantCarrito.style.display = "block"
    
    const carritoLength = carrito.length;

    localStorage.setItem("carritoLength", JSON.stringify(carritoLength));
    cantCarrito.innerText = JSON.parse(localStorage.getItem("carritoLength"));
}

carritoContador();
