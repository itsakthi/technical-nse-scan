import bs from 'black-scholes'

export default class Utility {
    approximateEqual(a, b) {
        let left = parseFloat(Math.abs(a - b).toPrecision(4)) * 1
        let right = parseFloat((a * 0.0015).toPrecision(4)) * 1
        return  left <= right 
    }
    getImpliedVolatility(expectedCost, s, k, t, r, callPut, estimate) {
        estimate = estimate || .1
        var low = 0
        var high = Infinity
        console.log(expectedCost+'-'+s+'-'+k+'-'+t+'-'+r+'-'+callPutestimate)
        for(var i = 0; i < 100; i++) {
            var actualCost = bs.blackScholes(s, k, t, estimate, r, callPut)
            if(expectedCost * 100 == Math.floor(actualCost * 100)) {
                break
            }
            else if(actualCost > expectedCost) {
                high = estimate
                estimate = (estimate - low) / 2 + low
            }
            else {
                low = estimate
                estimate = (high - estimate) / 2 + estimate
                if(!isFinite(estimate)) estimate = low * 2
            }
        }
        return estimate * 100
    }
    impliedVolatility(optionPrice, underlyingPrice, strikePrice, timeIntervl, callPut) {
        //console.log(this.getImpliedVolatility(50.3, 956.9, 920, .041, .1, "call"))
        return this.getImpliedVolatility(optionPrice, underlyingPrice, strikePrice, timeIntervl, callPut)
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
    decrementDate (currentDate, decrementBy) {
        let utility = new Utility()
        const formattedCurrentDate = new Date(currentDate)
        formattedCurrentDate.setDate(formattedCurrentDate.getDate() - decrementBy)
        let validDate = formattedCurrentDate.getFullYear() + '-'
        validDate = validDate + (formattedCurrentDate.getMonth() < 10 ? '0' + (formattedCurrentDate.getMonth() + 1) : _formattedCurrentDate.getMonth() + 1)
        validDate = validDate + '-' + (formattedCurrentDate.getDate() < 10 ? '0' + formattedCurrentDate.getDate() : formattedCurrentDate.getDate())
        return utility.formatDate(validDate)
    }
}
