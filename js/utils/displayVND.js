export function moneyDisplay(price) {
    let priceString = price.toString();
    let returnString = "";
    let counter = 0;
    for (let i = priceString.length - 1; i >= 0; i--) {
        counter++;
        returnString = priceString[i] + returnString;
        if (counter % 3 == 0 && i != 0)
            returnString = "." + returnString; 
    }
    returnString += " VND";
    return returnString;
}