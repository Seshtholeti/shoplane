var idParams = location.search;
var param = new URLSearchParams(idParams);
var productId = param.get("productId");
 
 

var ajax = new XMLHttpRequest();
ajax.open("GET","https://5d76bf96515d1a0014085cf9.mockapi.io/product/"+productId,true);
ajax.send();
ajax.addEventListener("readystatechange",productdetails);

function productdetails(e){
    if (e.target.readyState === 4 && e.target.status === 200) {

      var productData = JSON.parse(e.target.responseText);

  var container = document.createElement("div");
container.classList.add("sec");
var mainContainer = document.getElementById("mainpdp")
mainContainer.append(container);

var previewImageContainer = document.createElement("div");
previewImageContainer.classList.add("div1");

var detailsContainer = document.createElement("div");
detailsContainer.classList.add("div2");

container.append(previewImageContainer, detailsContainer);

var previewImg = document.createElement("img");
previewImg.classList.add("mainimg");
previewImg.src = productData.photos[0];
previewImageContainer.append(previewImg);

var productName = document.createElement("p");
productName.innerText = productData.name;
productName.classList.add("p1");
var brand = document.createElement("p");
brand.innerText = productData.brand;
productName.classList.add("p2");

var priceContainer = document.createElement("p");
priceContainer.classList.add("price-container");
var span = document.createElement('span');
span.innerText = productData.price;
span.classList.add("number");
priceContainer.innerText = "Price: RS ";
priceContainer.classList.add("p3");
priceContainer.append(span);

var descHeading = document.createElement("p");
descHeading.innerText = "Description";
descHeading.classList.add("p5");
var descriptionText = document.createElement("p");
descriptionText.innerText = productData.description;
descriptionText.classList.add("p5");

var productOverviewHeading = document.createElement("p");
productOverviewHeading.innerText = "Product preview";
productOverviewHeading.classList.add("p6")

var productImgContainer = document.createElement("div");
productImgContainer.classList.add("imagesDiv");

var productImages = productData.photos;

for (var counter = 0; counter < productImages.length; counter++) {
  var productImg = document.createElement("img");
  productImg.classList.add("images");
  productImg.src = productImages[counter];
  productImg.addEventListener("click", onProductImgClick);

  productImgContainer.append(productImg);
}

var atcBtn = document.createElement("button");
atcBtn.innerText = "Add to Cart";
atcBtn.classList.add("btn");
atcBtn.addEventListener('click', onAddToCart);

// var miniCart = document.createElement('span');
// miniCart.innerText = 0;

detailsContainer.append(
  productName,
  brand,
  priceContainer,
  descHeading,
  descriptionText,
  productOverviewHeading,
  productImgContainer,
  atcBtn
//   miniCart
);

productImgContainer.childNodes[0].classList.add("active");

function onProductImgClick(e) {
  previewImg.src = e.target.src;

  var images = productImgContainer.childNodes;
  for (var counter = 0; counter < images.length; counter++) {
    images[counter].classList.remove("active");
  }

  e.target.classList.add("active");
}
var itemCount = document.getElementById("cart-count");
var itemsInCart = 0;
function onAddToCart() {
  itemsInCart++;
  
  
  itemCount.innerText = itemsInCart;
}
}
}









   
  

  


  


