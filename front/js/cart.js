/**
 * Display products in cart from local storage cart and api data
 */
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

        const htmlCart = cart.sort((a, b) => {
            if(a.productId < b.productId) {
                return -1
            }
            if(a.productId > b.productId) {
                return 1
            }
            return 0
        }).map(product => `
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

/**
 * Change product quantity in cart
 * @param { Event } e
 */
function changeQuantity(e) {
    const [ cart, index ] = getCartAndProductIndex(e)
    cart[index].quantity = parseInt(e.target.value)
    localStorage.setItem('cart', JSON.stringify(cart))
    getCartProducts()
}

/**
 * Remove a product from cart
 * @param { Event } e
 */
function removeFromCart(e) {
    const [ cart, index ] = getCartAndProductIndex(e)
    cart.splice(index, 1)
    localStorage.setItem('cart', JSON.stringify(cart))
    getCartProducts()
}

/**
 * get product id and color when user click on dom product children
 * @param { Event } e
 * @return { Object }
 */
function getProductIdAndColor(e) {
    return e.target.closest(".cart__item").dataset
}

/**
 * get index of a product in cart from its id and color
 * @param { Object[] } cart
 * @param { String } productId
 * @param { String } color
 * @return { Number }
 */
function getCartIndex(cart, productId, color) {
    return cart.findIndex(cartItem => cartItem.color === color && cartItem.productId === productId)
}

/**
 * get cart and product index in cart
 * @param { Event } e
 * @return { [ Object , Number] }
 */
function getCartAndProductIndex(e) {
    const { id, color } = getProductIdAndColor(e)
    
    const localStorageCart = localStorage.getItem('cart')
    if(localStorageCart){
        cart = JSON.parse(localStorageCart);
    }

    const index = getCartIndex(cart, id, color)

    return [cart, index]
}

/**
 * Check if a string has between 1 and 99 characters
 * @param { String } value
 * @return { Boolean }
 */
 function notEmptyNotTooLong (value) {
    return value.length > 0 && value.length < 100
}

/**
 * Check if a string has between 1 and 99 characters
 * @param { String } value
 * @return { Boolean }
 */
function notEmptyNotTooLongNoNumbers (value) {
    return notEmptyNotTooLong(value) && /^([^0-9]*)$/.test(value)
}

/**
 * Check if a string is a valid email address
 * @param { String } value
 * @return { Boolean }
 */
function isValidEmail (value) {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
}

/**
 * Get contact object from fields array
 * @param { Object[] } fields
 * @param { String } fields[].id field id in DOM
 * @param { Function(value<String>) } fields[].validation field validation method
 * @param { String } fields[].errorMsg Error message if invalid data in field
 * @return { Object } Contact object
 */
function getContactObject (fields) {
    return Object.fromEntries(fields.map(field => [field.id, document.getElementById(field.id).value]))
}

/**
 * Check if fields have valid data
 * @param { Object } field
 * @param { String } field.id field id in DOM
 * @param { Function(value<String>) } field.validation field validation method
 * @param { String } field.errorMsg Error message if invalid data in field
 * @return { Boolean } Valid data
 */
function fieldIsValid (field) {
    return field.validation(document.getElementById(field.id).value)
}

/**
 * handle click on form submit button
 * @param { Object } contact
 * @param { String } contact.firstName Buyer first name
 * @param { String } contact.lastName Buyer last name
 * @param { String } contact.address Buyer address
 * @param { String } contact.city Buyer city
 * @param { String } contact.email Buyer email
 */
 function handleSubmit (contact) {
    let productsIds=[]
    console.log(localStorage.cart)
    const data = JSON.parse(localStorage.cart)
    for (let i=0 ; i< data.length ; i++) {
        const item = data[i]
        productsIds.push(item.productId);
    }
    const postData = {
        contact: contact,
        products: productsIds
    }
    send(postData)
}

/**
 * Send POST request to the api with order data
 * @param { Object } postData
 * @param { Object } postData.contact
 * @param { String } postData.contact.firstName Buyer first name
 * @param { String } postData.contact.lastName Buyer last name
 * @param { String } postData.contact.address Buyer address
 * @param { String } postData.contact.city Buyer city
 * @param { String } postData.contact.email Buyer email
 * @param { String[] } postData.products Array of products ids
 */
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

getCartProducts()

const fields = [
    {
        id: "firstName",
        validation: notEmptyNotTooLongNoNumbers,
        errorMsg: "Le champ doit contenir entre 1 et 99 caractères sans chiffres"
    },
    {
        id: "lastName",
        validation: notEmptyNotTooLongNoNumbers,
        errorMsg: "Le champ doit contenir entre 1 et 99 caractères sans chiffres"
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
