const cartList = document.querySelector(".cart-list");
const totalPriceElem=document.querySelectorAll('.total-price');
const cartForm=document.querySelector('.cart-form')
const emptyCart=document.querySelector('.empty-cart');
let cart = [];
let products = [];
const addCartToHTML = () => {
  if (cart.length>0) {
    emptyCart.classList.add('hidden');
    let totalPrice = 0;
    cartList.innerHTML='';
    cart.forEach((item) => {
      let prod = products.find((value) => value.id == item.productId);
      totalPrice += prod.price * item.quantity;
      cartList.insertAdjacentHTML("beforeend",`
      <div class="product-item" data-id=${prod.id}>
        <div class="cart-thumb cart-title">
          <img src=${prod.thumbnail} alt="" />
          <div class="product-info">
            <div class="product-name">${prod.title}</div>
          </div>
        </div>
        <div class="cart-price">${prod.price}LE</div>
        <div class="cart-quantity">
          <input
            type="number"
            name="quantity"
            class="quantity"
            min="1"
            value=${item.quantity}
          />
        </div>
        <div class="cart-total">${(prod.price * item.quantity).toFixed(2)}LE</div>
        <div class="remove">
          <i class="far fa-trash-alt rmv-icon"></i>
        </div>
      </div>
      `
      );
    });
    totalPriceElem.forEach(elem=>elem.textContent=totalPrice.toFixed(2)+" LE");
  }
  else if(cart.length===0){
    cartForm.classList.add('hidden');
    emptyCart.classList.remove('hidden');

  }
};
const updateCart = (id,val) => {
  let indexProdInCart = cart.findIndex((val) => val.productId === id);
  cart[indexProdInCart].quantity=val;
  addCartToMemory();
  addCartToHTML();
};
const deleteFromCart=(id)=>{
  let indexProdInCart = cart.findIndex((val) => val.productId === id);
  cart.splice(indexProdInCart, 1);
  addCartToHTML();
  addCartToMemory();
}
const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};
async function  fetchAllDate() {
 
  await fetch("products.json")
    .then((res) => res.json())
    .then((json) => (products = json));

}
const init = async() => {
      await fetchAllDate();
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
        addCartToHTML();
      }
};
cartList.addEventListener('click',e=>{
  if(e.target.classList.contains('rmv-icon')){
    let id=e.target.closest('.product-item').dataset.id;
    e.target.closest('.product-item').remove();
    console.log("hello");
    deleteFromCart(id)
  }
})
cartList.addEventListener('change',e=>{
  if (e.target.classList.contains('quantity')) {
    let id=e.target.closest('.product-item').dataset.id;
    if(e.target.value>=1)
      updateCart(id,e.target.value);
  }
})
init();