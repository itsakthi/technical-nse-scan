import Utility from '../utility'

export default class Star {
    constructor(databaseConnection, collectionName, req, res) {
        let star = []
        let utility = new Utility()
        const reqDate = utility.formatDate(req.body.candlestickdate)
        const range = req.body.candlestickrange
        databaseConnection.collection(collectionName).find().toArray((error, result)=> {
            if (error) return console.log(error)
            for(let index = 0;index < result.length - 1;index++) {
                let reqDateIndex = 0, currentOpenPrice = 0, currentClosePrice = 0, currentHighPrice = 0, currentLowPrice = 0
                if(range === 'daily') {
                    reqDateIndex = result[index].quoteDBRecord.findIndex(dbRecord => dbRecord.quoteDate == reqDate)
                    currentOpenPrice   = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteOpenPrice.replace(/,/g, ''))
                    currentClosePrice  = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteClosePrice.replace(/,/g, ''))
                    currentHighPrice   = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteHighPrice.replace(/,/g, ''))
                    currentLowPrice    = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, ''))
                }  else if(range === 'weekly') {
                    let tempHigh = 0, tempLow = 0, currentDate = reqDate
                    for(let dayCount = 1; dayCount < 6; dayCount++) {
                        reqDateIndex = result[index].quoteDBRecord.findIndex(dbRecord => dbRecord.quoteDate == currentDate)
                        if(reqDateIndex > 0) {
                            if(!currentClosePrice) { currentClosePrice = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteClosePrice.replace(/,/g, '')) }
                            tempHigh = tempHigh > parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteHighPrice.replace(/,/g, '')) ? tempHigh : parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteHighPrice.replace(/,/g, ''))
                            currentHighPrice = tempHigh
                            currentLowPrice = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, '')) < tempLow ? parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, '')) : tempLow
                            tempLow = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, ''))
                            currentOpenPrice = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteOpenPrice.replace(/,/g, ''))
                        }
                        currentDate = utility.decrementDate(currentDate, 1)
                    }
                }
                let isOpenEqualsClose = utility.approximateEqual(currentOpenPrice, currentClosePrice);
                let isHighEqualsOpen = isOpenEqualsClose && utility.approximateEqual(currentOpenPrice, currentHighPrice);
                let isLowEqualsClose = isOpenEqualsClose && utility.approximateEqual(currentClosePrice, currentLowPrice);
                if (isOpenEqualsClose && isHighEqualsOpen == isLowEqualsClose) {
                    star.push(result[index].stockCode)
                }    
            }
            res.render('../src/views/candlestick/star.ejs', {
                star
            })
        })
    }
}