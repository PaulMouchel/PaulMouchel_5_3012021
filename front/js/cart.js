function getCartProducts () {
    fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(productsList) {  
        let cart = [];
        const localStorageCart = localStorage.getItem('cart')
        if(localStorageCart){
            cart = JSON.parse(localStorageCart);
        }

        cart = cart.map(product => {
            const index = productsList.findIndex(item => item._id === product.productId)
            const data = productsList[index]
            return {
                ...product,
                name: data.name,
                imageUrl: data.imageUrl,
                price: data.price,
                totalPrice: data.price * product.quantity
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
                        <p>${product.totalPrice} €</p>
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

        const quantityList = document.getElementsByClassName("itemQuantity");
        for (let item of quantityList) {
            item.addEventListener("change", changeQuantity)
        }

        const deleteList = document.getElementsByClassName("deleteItem");
        for (let item of deleteList) {
            item.addEventListener("click", removeFromCart)
        }

        document.getElementById("totalQuantity").innerText = cart.reduce((acc , val) => acc + val.quantity, 0)
        document.getElementById("totalPrice").innerText = cart.reduce((acc , val) => acc + val.totalPrice, 0)
    })
    .catch(function(err) {
        console.log(err)
        // Une erreur est survenue
    });
}

getCartProducts()

function changeQuantity(e) {
    const [ cart, index ] = getCartAndProductIndex(e)
    cart[index].quantity = parseInt(e.target.value)
    localStorage.setItem('cart', JSON.stringify(cart))
    getCartProducts()
}

function removeFromCart(e) {
    const [ cart, index ] = getCartAndProductIndex(e)
    cart.splice(index, 1)
    localStorage.setItem('cart', JSON.stringify(cart))
    getCartProducts()
}

function getProductIdAndColor(e) {
    return e.target.closest(".cart__item").dataset
}

function getCartIndex(cart, productId, color) {
    return cart.findIndex(cartItem => cartItem.color === color && cartItem.productId === productId)
}

function getCartAndProductIndex(e) {
    const { id, color } = getProductIdAndColor(e)
    
    const localStorageCart = localStorage.getItem('cart')
    if(localStorageCart){
        cart = JSON.parse(localStorageCart);
    }

    const index = getCartIndex(cart, id, color)

    return [cart, index]
}

function notEmptyNotTooLong (value) {
    return value.length > 0 && value.length < 100
}

function isValidEmail (value) {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
}

function getContactObject (fields) {
    return Object.fromEntries(fields.map(field => [field.id, document.getElementById(field.id).value]))
}

function fieldIsValid (field) {
    return field.validation(document.getElementById(field.id).value)
}

const fields = [
    {
        id: "firstName",
        validation: notEmptyNotTooLong,
        errorMsg: "Le champ doit contenir entre 1 et 99 caractères"
    },
    {
        id: "lastName",
        validation: notEmptyNotTooLong,
        errorMsg: "Le champ doit contenir entre 1 et 99 caractères"
    },
    {
        id: "address",
        validation: notEmptyNotTooLong,
        errorMsg: "Le champ doit contenir entre 1 et 99 caractères"
    },
    {
        id: "city",
        validation: notEmptyNotTooLong,
        errorMsg: "Le champ doit contenir entre 1 et 99 caractères"
    },
    {
        id: "email",
        validation: isValidEmail,
        errorMsg: "Cet email n'est pas valide"
    }
]

fields.forEach(field => {
    document.getElementById(field.id).addEventListener('input', (e) => {
        const value = e.target.value
        document.getElementById(`${field.id}ErrorMsg`).innerText = field.validation(value) ? "" : field.errorMsg
    });
})

const submitButton = document.getElementById("order")

submitButton.addEventListener('click',function(e){
    e.preventDefault()
    const fieldsAreValid = fields.every(field => fieldIsValid(field))
    if (fieldsAreValid) {
        const contact = getContactObject(fields)
        handleSubmit(contact)
    }
})
    
function handleSubmit (contact) {
    let productsIds=[]
    console.log(localStorage.cart)
    const data = JSON.parse(localStorage.cart)
    for (let i=0 ; i< data.length ; i++) {
        const item = data[i]
        // for (let j=1 ; j<= item.quantity ; j++) {
            productsIds.push(item.productId);
        // }
    }
    const postData = {
        contact: contact,
        products: productsIds
    }
    send(postData)
}

function send(postData) {

    fetch('http://localhost:3000/api/products/order', {
        method : "POST",
        headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData),
    }) 
    .then(function(res){
        if(res.ok){
            return res.json()
        }       
    })
    .then(function(value){
        localStorage.clear();
        document.location.href=`confirmation.html?orderId=${value.orderId}`
    })
    .catch(function(err){
        console.log(`erreur ${err}`)
    })
}