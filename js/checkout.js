import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {cart, clearAllItems, clearOneItem, updateQuantity} from "../data/cart.js";
import {productInfo} from "./utils/returnProductInfo.js";
import {moneyDisplay} from "./utils/displayVND.js";

function renderCheckoutPage() {
    let cartHTML = '';
    if (cart.length === 0) {
        cartHTML = `
            <div> 
                You have no item in your cart. Please add the items to your cart in <span><a href="index.html">here</a></span>.
            </div>
        `;
    } else {
        cart.forEach((item) => {
            const product = productInfo(item.productId);
            cartHTML += `
                <div class="cart-item-box">
                    <div class="delivery-date-text">
                        <span class="important-text js-delivery-date-${item.productId}"></span>
                    </div>
                    <div class="item-summary-grid">
                        <div>
                            <img class="cart-item-image" src="${product.image}">
                        </div>
                        <div>
                            <div class="heading-cart-item-box">${product.name}</div>
                            <hr>
                            <div><span class="important-text">${moneyDisplay(product.priceVND)}</span></div>
                            <div>Quantity: <span class="important-text">${item.quantity}</span></div>
                            <div class="js-update-delete-item-buttons">
                                <span><button class="js-update-item-quantity" data-product-id="${product.id}">Update</button></span> 
                                <span><button class="js-delete-item" data-product-id="${product.id}">Delete</button></span>
                            </div>
                        </div>
                        <div>
                            <div class="heading-cart-item-box">Choose delivery option:</div>
                            <div>
                                <label>
                                    <input type="radio" name="option-${item.productId}" value="1">
                                    <span>Freeship</span>
                                </label>
                                <label>
                                    <input type="radio" name="option-${item.productId}" value="2">
                                    <span>Airplane</span>
                                </label>
                                <label>
                                    <input type="radio" name="option-${item.productId}" value="3" checked>
                                    <span>Rocket ship</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        cartHTML += `
            <div class="clear-all-items-wrapper">
                <button class="js-clear-all-items">
                    Clear All Items
                </button>
            </div>
        `;
    }
    document.querySelector(".js-cart-summary").innerHTML = cartHTML;
}
function renderDeliveryDate(productId) {
    const today = dayjs();
    let shipOption = document.querySelector(`input[name="option-${productId}"]:checked`)?.value;

    let dayDelta;
    if (shipOption === "1") dayDelta = 7;
    else if (shipOption === "2") dayDelta = 5;
    else dayDelta = 3;

    let returnString ="Delivery date: " + today.add(dayDelta, 'day').format('dddd, MMMM D');
    document.querySelector(`.js-delivery-date-${productId}`).innerHTML = returnString;
}
function clearItemButtonListener() {
    document.querySelector(".js-clear-all-items").addEventListener('click', () => {
        clearAllItems();
        renderPage();
    });
}
function renderPrice() {
    if (cart.length === 0) {
        document.querySelector(".js-price-items").innerHTML = moneyDisplay(0);
        document.querySelector(".js-price-shipping").innerHTML = moneyDisplay(0);
        document.querySelector(".js-price-total-notax").innerHTML = moneyDisplay(0);
        document.querySelector(".js-price-tax").innerHTML = moneyDisplay(0);
        document.querySelector(".js-price-total").innerHTML = moneyDisplay(0);
        return;
    }
    let itemsPrice = 0;
    let shipPrice = 0;
    let totalNoTax = 0;
    let tax = 0;
    let totalPrice = 0;
    cart.forEach((item) => {
        const product = productInfo(item.productId);

        itemsPrice += item.quantity * product.priceVND;
        
        let shipOption = document.querySelector(`input[name="option-${item.productId}"]:checked`)?.value || "1";
        if (shipOption == "2")
            shipPrice += 20000;
        else if (shipOption == "3")
            shipPrice += 30000;
    });
    totalNoTax = itemsPrice + shipPrice;
    tax = totalNoTax / 10;
    totalPrice = totalNoTax + tax;

    document.querySelector(".js-price-items").innerHTML = moneyDisplay(itemsPrice);
    document.querySelector(".js-price-shipping").innerHTML = moneyDisplay(shipPrice);
    document.querySelector(".js-price-total-notax").innerHTML = moneyDisplay(totalNoTax);
    document.querySelector(".js-price-tax").innerHTML = moneyDisplay(tax);
    document.querySelector(".js-price-total").innerHTML = moneyDisplay(totalPrice);
}
function shipOptionListener() {
    cart.forEach((item) => {
        const radioButtons = document.querySelectorAll(`input[name="option-${item.productId}"]`);
        radioButtons.forEach((radio) => {
            radio.addEventListener("change", () => {
                renderPrice();
                renderDeliveryDate(item.productId);
            });
        });
    });
}
function updateItemListener() {
    const buttons = document.querySelectorAll(".js-update-delete-item-buttons");
    buttons.forEach((button) => {
        button.querySelector(".js-update-item-quantity").addEventListener("click", () => {
            const id = button.querySelector(".js-update-item-quantity").dataset.productId;
            button.innerHTML = `
                <div>
                    <input class="js-input-update-${id}">
                    <button class="js-input-enter-${id}">
                        Enter
                    </button>
                </div> 
            `;
            updateInputListener(id);
        }); 
    });
}
function updateInputListener(productID) {
    document.querySelector(`.js-input-enter-${productID}`).addEventListener('click', () => {
        let updatedValue = parseInt(document.querySelector(`.js-input-update-${productID}`).value);
        if (!Number.isInteger(updatedValue) || updatedValue <= 0) {
            alert("Invalid quantity");
            return;
        }
        updateQuantity(productID, updatedValue);
        renderPage();
    });
}
function deleteItemButtonListener() {
    const buttons = document.querySelectorAll(".js-update-delete-item-buttons");
    buttons.forEach((button) => {
        button.querySelector(".js-delete-item").addEventListener("click", () => {
            const id = button.querySelector(".js-delete-item").dataset.productId;
            clearOneItem(id);
            renderPage();
        }); 
    });
}
function getShippingSelections() {
    const selectedOptions = {};
    cart.forEach((item) => {
        const selected = document.querySelector(`input[name="option-${item.productId}"]:checked`);
        if (selected)
            selectedOptions[item.productId] = selected.value;
    });
    return selectedOptions;
}
function restoreShippingSelections(selections) {
    cart.forEach((item) => {
        const value = selections[item.productId];
        if (value) {
            const selector = `input[name="option-${item.productId}"][value="${value}"]`;
            const radio = document.querySelector(selector);
            if (radio)
                radio.checked = true;
        }
        renderDeliveryDate(item.productId);
    });
}
function placeOrderButtonListener() {
    document.querySelector('.js-place-order').addEventListener('click', () => {
        if (cart.length === 0) return;
        
        let orderPage = document.querySelector(".ordered");
        orderPage.style.visibility = "visible";
        setTimeout(() => {
            orderPage.style.visibility = "hidden";
            clearAllItems();
            renderPage();
        }, 5000);
    });
}
function renderPage() {
    const shippingSelections = getShippingSelections();
    renderCheckoutPage();
    restoreShippingSelections(shippingSelections);
    renderPrice();
    if (cart.length != 0) {
        clearItemButtonListener();
        shipOptionListener();
        updateItemListener();
        deleteItemButtonListener();   
        placeOrderButtonListener();
    }
}
renderPage();