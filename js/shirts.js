const prodContainer = document.querySelector(".products");
const categories = document.querySelector(".categories");
const overlay = document.querySelector(".overlay");
const iconCart = document.querySelector(".icon-cart");
const cartTab = document.querySelector(".cart-tab");
const closeBtn = document.querySelector(".close");
const listCartHTML = document.querySelector(".list-cart");
const iconCartSpan = document.querySelector(".icon-cart span");
const dropDown = document.querySelector(".drop-down");
const viewBy=document.querySelector('.view-by');

let products = [],cart = [],wishlist = [],shirts=[];
async function fetchAllDate() {

  await fetch("shirts.json")
    .then((res) => res.json())
    .then((json) => (products = json));

    shirts=products;
}
const addProductHTML = (prod) => {
  prodContainer.innerHTML = "";
  prod.forEach((elem) => {
    let icon = "regular";
    if (wishlist.length > 0)
      icon =
        wishlist.findIndex((val) => val === elem.id) > -1 ? "solid" : "regular";
    prodContainer.insertAdjacentHTML(
      "beforeend",
      `
    <div class="item" id=${elem.id}>
    <div class="image">
      <img src=${elem.image} alt="">
        <i class="fa-${icon} fa-heart wishlist"></i>
        <div class="box">
          <div class="btns">
            <a href="#" class="add-to-cart"><span> Add to Cart </span></a>
            </div>
        </div>
    </div>
    <div class="content">
      <div>${elem.name}</div>
      <div>${elem.price}.00 LE</div>
    </div>
  </div>
    `
    );
  });
};
////////////////////////////////////////////
//Cart Functions
const addToCart = (id) => {
  let indexProdInCart = cart.findIndex((val) => val.productId === id);
  if (cart.length === 0) {
    cart = [
      {
        productId: id,
        quantity: 1,
      },
    ];
  } else if (indexProdInCart < 0) {
    cart.push({
      productId: id,
      quantity: 1,
    });
  } else cart[indexProdInCart].quantity++;
  addCartToHTML();
  addCartToMemory();
};
const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};
const addCartToHTML = () => {
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;
  if (cart.length > 0) {
    cart.forEach((item) => {
      totalQuantity += +item.quantity;
      let positionProduct = products.findIndex(
        (value) => value.id == item.productId
      );
      let info = products[positionProduct];
      listCartHTML.insertAdjacentHTML(
        "beforeend",
        `
      <div class="item" data-id=${info.id}>
          <div class="image">
                <img src="${info.image}">
          </div>
          <div class="name">
              ${info.name}
          </div>
          <div class="totalPrice">${info.price * item.quantity}LE</div>
          <div class="quantity">
            <span class="minus"><</span>
            <span>${item.quantity}</span>
            <span class="plus">></span>
          </div>
      </div>
      `
      );
    });
  }
  iconCartSpan.innerText = totalQuantity;
};
const changeQuantityCart = (id, type) => {
  let positionItemInCart = cart.findIndex((value) => value.productId == id);
  if (positionItemInCart > -1) {
    if (type === "plus") cart[positionItemInCart].quantity++;
    else if (type === "minus") {
      let changeQuantity = cart[positionItemInCart].quantity - 1;
      if (changeQuantity > 0) {
        cart[positionItemInCart].quantity = changeQuantity;
      } else {
        cart.splice(positionItemInCart, 1);
      }
    }
    addCartToHTML();
    addCartToMemory();
  }
};
////////////////////////////////////////////////
//Wishlist Functions
const updateWishlist = (id) => {
  if (wishlist.length===0) {
    wishlist = [id];
  } else {
    let indexProd = wishlist.findIndex((val) => val === id);
    if (indexProd === -1) wishlist.push(id);
    else wishlist.splice(indexProd, 1);
  }
  addWishlistToMemory();
};
const addWishlistToMemory = () => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
};
///////////////////////////////////////////////////////
// initializer Function
const init = async () => {
  await fetchAllDate();
  if (JSON.parse(localStorage.getItem("wishlist")))
    wishlist = JSON.parse(localStorage.getItem("wishlist"));
  addProductHTML(shuffle(shirts));
  if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
    addCartToHTML();
  }
};
init();
/////////////////////////////////////////
//other function
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}
///////////////////////////////////////////////
//add to Cart Event
overlay.addEventListener("click", () => {
  overlay.classList.remove("show");
  cartTab.classList.remove("showCart");
});
iconCart.addEventListener("click", (e) => {
  cartTab.classList.toggle("showCart");
  overlay.classList.add("show");
});
closeBtn.addEventListener("click", (e) => {
  cartTab.classList.remove("showCart");
  overlay.classList.remove("show");
});
listCartHTML.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("minus") ||
    e.target.classList.contains("plus")
  ) {
    let id = e.target.closest(".item").dataset.id;
    let type = e.target.classList.contains("plus") ? "plus" : "minus";
    changeQuantityCart(id, type);
  }
});
prodContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    addToCart(e.target.closest(".item").id);
  } else if (e.target.classList.contains("wishlist")) {
    if (e.target.classList.contains("fa-regular")) {
      e.target.classList.remove("fa-regular");
      e.target.classList.add("fa-solid");
    } else {
      e.target.classList.add("fa-regular");
      e.target.classList.remove("fa-solid");
    }
    updateWishlist(e.target.closest(".item").id);
  }
});
//drop menu Event
dropDown.addEventListener("click", (e) => {
  dropDown.querySelector(".drop-down-menu").classList.toggle("show");
  let angleIcon=dropDown.querySelector(" i");
  if (angleIcon.classList.contains("fa-angle-down"))
    angleIcon.classList.replace("fa-angle-down", "fa-angle-up");
  else
    angleIcon.classList.replace("fa-angle-up", "fa-angle-down");
  if (e.target.classList.contains("link")) {
    if (e.target.classList.contains("price-low"))
      shirts.sort((a, b) => a.price - b.price);
    else if (e.target.classList.contains("price-high"))
      shirts.sort((a, b) => b.price - a.price);
    else if (e.target.classList.contains("alpha-asc"))
      shirts.sort((a, b) => a.title.localeCompare(b.title));
    else if (e.target.classList.contains("alpha-desc"))
      shirts.sort((a, b) => b.title.localeCompare(a.title));
    else 
      shirts = shuffle(shirts);
    addProductHTML(shirts);
    dropDown.querySelector(".drop-down span").textContent =e.target.textContent;
    dropDown.querySelectorAll('.link').forEach(link=>link.classList.remove('active'));
    e.target.classList.add('active');
  }
});

//////////////////////////////////////////////////
viewBy.addEventListener('click',e=>{
  if (e.target.classList.contains('view-grid')) {
    prodContainer.className='';
    if (e.target.classList.contains('view-2')) 
      prodContainer.classList.add('view-2');
    else if(e.target.classList.contains('view-3') )  
      prodContainer.classList.add('view-3');
    else if(e.target.classList.contains('view-4') )  
      prodContainer.classList.add('view-4');
    else if(e.target.classList.contains('view-5') )  
      prodContainer.classList.add('view-5');
    else if(e.target.classList.contains('view-6') )  
      prodContainer.classList.add('view-6');
    prodContainer.classList.add('products');

  }
})