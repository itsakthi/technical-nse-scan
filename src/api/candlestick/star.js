import Utility from '../utility'

export default class Star {
    constructor(databaseConnection, collectionName, req, res) {
        let star = []
        let utility = new Utility()
        const reqDate = utility.formatDate(req.body.candlestickdate)
        databaseConnection.collection(collectionName).find().toArray((error, result)=> {
            if (error) return console.log(error)
            for(let index = 0;index < result.length - 1;index++) {
                const reqDateIndex = result[index].quoteDBRecord.findIndex(dbRecord => dbRecord.quoteDate == reqDate)
                let currentOpenPrice   = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteOpenPrice.replace(/,/g, ''))
                let currentClosePrice  = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteClosePrice.replace(/,/g, ''))
                let currentHighPrice   = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteHighPrice.replace(/,/g, ''))
                let currentLowPrice    = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, ''))
                
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