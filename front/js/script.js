function getAllProducts () {
    fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(value) {  
        document.getElementById("items").innerHTML = value.map(item => `
            <a href="./product.html?id=${item._id}">
                <article>
                    <img src=${item.imageUrl} alt=${item.altTxt}>
                    <h3 class="productName">${item.name}</h3>
                    <p class="productDescription">${item.description}</p>
                </article>
            </a>
        `).join('')
    })
    .catch(function(err) {
        console.log(err)
        // Une erreur est survenue
    });
  }

  getAllProducts()