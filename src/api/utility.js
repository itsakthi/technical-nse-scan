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
    formatDate(date) {
        let validDate = date.split('-')[2] + '-'
        switch(date.split('-')[1]) {
            case '01':
                validDate = validDate + 'Jan'
                break
            case '02':
                validDate = validDate + 'Feb'
                break
            case '03':
                validDate = validDate + 'Mar'
                break
            case '04':
                validDate = validDate + 'Apr'
                break
            case '05':
                validDate = validDate + 'May'
                break
            case '06':
                validDate = validDate + 'Jun'
                break
            case '07':
                validDate = validDate + 'Jul'
                break
            case '08':
                validDate = validDate + 'Aug'
                break
            case '09':
                validDate = validDate + 'Sep'
                break
            case '10':
                validDate = validDate + 'Oct'
                break
            case '11':
                validDate = validDate + 'Nov'
                break
            case '12':
                validDate = validDate + 'Dec'
                break
        }
        return validDate + '-' + date.split('-')[0]
    }
}