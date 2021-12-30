function getCartProducts () {
    fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(productsList) {  
        console.log(productsList)
        let cart = [];
        const localStorageCart = localStorage.getItem('cart')
        if(localStorageCart){
            cart = JSON.parse(localStorageCart);
        }

        console.log(cart)

        cart = cart.map(product => {
            const index = productsList.findIndex(item => item._id === product.productId)
            const data = productsList[index]
            return {
                ...product,
                name: data.name,
                imageUrl: data.imageUrl,
                price: data.price
            }
        })

        const htmlCart = cart.map(product => `
            <article class="cart__item" data-id="${product.productId}" data-color="${product.color}">
                <div class="cart__item__img">
                    <img src=${product.imageUrl} alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${product.name}</h2>
                        <p>${product.color}</p>
                        <p>${product.price * product.quantity} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${product.quantity}>
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>
        `).join('')

        document.getElementById("cart__items").innerHTML = htmlCart
    })
    .catch(function(err) {
        console.log(err)
        // Une erreur est survenue
    });
}

getCartProducts()