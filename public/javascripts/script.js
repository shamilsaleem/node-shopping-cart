function addToCart(productId) {
  var data = { productId };
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(data),
  };
  fetch("/users/addtocart", options)
    .then((response) => response.json())
    .then((data=> console.log(data)))
}
