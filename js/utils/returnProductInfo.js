import {products} from "../../data/products.js"

export function productInfo(productID) {
    const result = products.find(product => product.id === productID);
    return result;
}