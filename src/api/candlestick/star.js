import Utility from '../utility'

export default class Star {
    constructor(databaseConnection, collectionName, res) {
        let star = []
        let utility = new Utility()
        databaseConnection.collection(collectionName).find().toArray((error, result)=> {
            if (error) return console.log(error)
            for(let index = 0;index < result.length - 1;index++) {
                let quotesRecordCount = result[index].quoteDBRecord.length
                let currentOpenPrice   = parseFloat(result[index].quoteDBRecord[quotesRecordCount - 1].quoteOpenPrice.replace(/,/g, ''))
                let currentClosePrice  = parseFloat(result[index].quoteDBRecord[quotesRecordCount - 1].quoteClosePrice.replace(/,/g, ''))
                let currentHighPrice   = parseFloat(result[index].quoteDBRecord[quotesRecordCount - 1].quoteHighPrice.replace(/,/g, ''))
                let currentLowPrice    = parseFloat(result[index].quoteDBRecord[quotesRecordCount - 1].quoteLowPrice.replace(/,/g, ''))
                
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