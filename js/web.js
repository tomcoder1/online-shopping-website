import {products} from "../data/products.js"
import {cart, addToCart} from "../data/cart.js"
import {moneyDisplay} from "./utils/displayVND.js"

function renderMainPage() {
    let productsHTML = "";
    products.forEach((product) => {
        productsHTML += `
            <div class="product-block">
                <div class="product-img-block"> 
                    <img src="${product.image}">
                </div>
                <div class="product-name">${product.name}</div>
                
                <div class="product-actions">
                    <hr>
                    <div class="product-price">${moneyDisplay(product.priceVND)}</div>
                    <select id="product-quantity-${product.id}">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                    </select>
                    <button class="js-add-to-cart" 
                        data-product-id="${product.id}">
                            Add to cart
                    </button>
                </div>
            </div>
        ` ;
    });
    document.querySelector(".js-products").innerHTML = productsHTML;
}

function updateCartQuantity() {
    let cartQuantity = 0;
    cart.forEach((item) => {
        cartQuantity += item.quantity;
    });
    document.querySelector(".js-cart-quatity").innerHTML = cartQuantity;
}

function addToCartListener() {
    document.querySelectorAll('.js-add-to-cart').forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            const quantity = parseInt(document.getElementById(`product-quantity-${productId}`).value, 10);
            addToCart(productId, quantity);
            updateCartQuantity();
        });
    });
}

renderMainPage();
addToCartListener();
updateCartQuantity();
