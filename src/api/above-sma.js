export default class AboveSMA {
    constructor(databaseConnection, collectionName, req, res) {
        const movingAverage = req.body.moving_average
        let prevSMA, currentSMA, onDirectionStockList =[], onReverseStockList =[], twoDaysOnStockList =[]
        databaseConnection.collection(collectionName).find().toArray((error, result)=> {
            if (error) return console.log(error)
            for(let index = 0;index < result.length - 1;index++) {
            const currentSMA = result[index].currentSMA[movingAverage -1]
            const prevSMA = result[index].prevSMA[movingAverage - 1]
            const currentOpenPrice = result[index].stockPrices[0].open
            const currentHighPrice = result[index].stockPrices[0].high
            const currentLowPrice = result[index].stockPrices[0].low
            const currentClosePrice = result[index].stockPrices[0].close
            const prevOpenPrice = result[index].stockPrices[1].open
            const prevHighPrice = result[index].stockPrices[1].high
            const prevLowPrice = result[index].stockPrices[1].low
            const prevClosePrice = result[index].stockPrices[1].close
            

            if((currentOpenPrice > currentSMA) && (currentHighPrice > currentSMA) && (currentLowPrice > currentSMA) && (currentClosePrice > currentSMA)) {
                if((prevOpenPrice > prevSMA) && (prevHighPrice > prevSMA) && (prevLowPrice > prevSMA) && (prevClosePrice > prevSMA)) {
                twoDaysOnStockList.push(result[index].stockCode)
                } else {
                if(currentClosePrice > currentOpenPrice) {
                    onDirectionStockList.push(result[index].stockCode)
                } else if(currentClosePrice < currentOpenPrice) {
                    onReverseStockList.push(result[index].stockCode)
                }
                }
            }else if((currentOpenPrice < currentSMA) && (currentHighPrice < currentSMA) && (currentLowPrice < currentSMA) && (currentClosePrice < currentSMA)) {
                if((prevOpenPrice < prevSMA) && (prevHighPrice < prevSMA) && (prevLowPrice < prevSMA) && (prevClosePrice < prevSMA)) {
                twoDaysOnStockList.push(result[index].stockCode)
                } else {
                if(currentClosePrice > currentOpenPrice) {
                    onReverseStockList.push(result[index].stockCode)
                } else if(currentClosePrice < currentOpenPrice) {
                    onDirectionStockList.push(result[index].stockCode)
                }
                }
            }
            }
            res.render('../src/views/above-sma.ejs', {
                onDirectionStockList,
                onReverseStockList,
                twoDaysOnStockList
            })
        })
    }
}
