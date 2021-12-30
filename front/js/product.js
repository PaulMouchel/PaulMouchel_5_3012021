const url = new URL(window.location.href)
const productId = url.searchParams.get("id");

function getProducts(productId) {
    fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(value) {  
        document.getElementsByClassName("item__img")[0].innerHTML = `<img src=${value.imageUrl} alt=${value.altTxt}></img>`
        document.getElementById("title").innerText = value.name
        document.getElementById("price").innerText = value.price
        document.getElementById("description").innerText = value.description
        const colors = document.getElementById("colors")
        value.colors.forEach(color => {
            const option = document.createElement("option");
            const newColor = colors.appendChild(option)
            newColor.setAttribute("value", color)
            newColor.innerText = color
        });
    })
    .catch(function(err) {
        console.log(err)
        // Une erreur est survenue
    });
}

getProducts(productId)


function addToCart() {
    const quantity = parseInt(document.getElementById("quantity").value)
    const color = document.getElementById("colors").value

    let cart = [];
    const localStorageCart = localStorage.getItem('cart')
    if(localStorageCart){
        cart = JSON.parse(localStorageCart);
    }

    // Looking for the same product with same color in the cart
    const productIndex = cart.findIndex( product => product.productId === productId && product.color === color)

    if ( productIndex !== -1 ) {
        cart[productIndex].quantity += quantity
    } else {
        cart.push({productId : productId, quantity : quantity, color: color});
    }

    
    console.log(cart)
    localStorage.setItem('cart', JSON.stringify(cart));
}

document.getElementById("addToCart").addEventListener("click", addToCart)