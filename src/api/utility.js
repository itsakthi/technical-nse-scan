export default class Utility {
    approximateEqual(a, b) {
        let left = parseFloat(Math.abs(a - b).toPrecision(4)) * 1;
        let right = parseFloat((a * 0.001).toPrecision(4)) * 1; 
        return  left <= right 
    }
    star(currentOpenPrice, currentClosePrice, currentHighPrice, currentLowPrice) {
        let isOpenEqualsClose = this.approximateEqual(currentOpenPrice, currentClosePrice);
        let isHighEqualsOpen = isOpenEqualsClose && this.approximateEqual(currentOpenPrice, currentHighPrice);
        let isLowEqualsClose = isOpenEqualsClose && this.approximateEqual(currentClosePrice, currentLowPrice);
        return (isOpenEqualsClose && isHighEqualsOpen == isLowEqualsClose)
    }
}