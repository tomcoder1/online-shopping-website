export let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantity) {
    let matchingItem = null;

    cart.forEach((item) => {
        if (productId === item.productId) {
            matchingItem = item;
        }
    });

    if (matchingItem) {
        matchingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            quantity: quantity,
        })
    }

    saveCartToStorage();
}

export function clearAllItems() {
    cart.length = 0;
    saveCartToStorage();
}

export function clearOneItem(productID) {
    let removeIndex = 0;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].productId === productID) {
            removeIndex = i;
            break;
        }
    }
    cart.splice(removeIndex, 1);
    saveCartToStorage();
}

export function updateQuantity(productID, updatedValue) {
    for (const item of cart) {
        if (item.productId === productID) {
            item.quantity = updatedValue;
            break;
        }
    }
    saveCartToStorage();
}