function addToCart(productId, qty) {
  var data = { productId, qty };
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(data),
  };
  fetch("/users/addtocart", options)
    .then(async (response) => {
      response = await response.json();
      if (response.productAddedtoCart) {
        const cartCount = document.getElementById("cartCount");
        var count = parseInt(cartCount.innerText);
        cartCount.innerText = count + 1;
      }
    })
    .catch(() => {
      window.location.href = "/users/login";
    });
}

function changeCartItemQty(productId, qty, productPrice) {
  var data = { productId, qty };
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(data),
  };

  fetch("/users/addtocart", options)
    .then(async (response) => {
      response = await response.json();
      if (response.productAddedtoCart) {

        const cartCount = document.getElementById("qty-" + productId);
        const cartItemTotel = document.getElementById("totel-" + productId);
        const cartSumCell = document.getElementById("cartSum");

        var count = parseInt(cartCount.innerText);
        var currentTotel = parseInt(cartItemTotel.innerText);
        var cartSum = parseInt(cartSumCell.innerText);

        cartCount.innerText = count + qty;
        cartItemTotel.innerText = currentTotel + (qty * productPrice);
        cartSumCell.innerText = cartSum + (qty * productPrice);
        
      } else if (response.productDeletedFromCart) {
        const cartItem = document.getElementById("product-" + productId);
        cartItem.remove();
      }
    })
    .catch(() => {
      window.location.href = "/users/login";
    });
}
