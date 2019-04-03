export default class Quotes {
    constructor(alphaVantageInterface, databaseConnection, collectionName, interval, req, res, stockList, stockListIndex) {
        stockListIndex = req.body.quotesfrom || req.body.quotefor
        console.log('Inside SMA' + stockListIndex)
        res.send('<p>inside sma</p>')
        const closingPriceOperation = setInterval(async () => {
            let currentSMA = [], prevSMA = [], stockPrices = [], volume = [], priceIndex, averageIndex, priceTotal, dbInput
            let smaQueryParam = {
                amount: 51,
                interval: interval,
                symbol: 'NSE:' + stockList[stockListIndex]
            }
            const result = await alphaVantageInterface.timeSeries(smaQueryParam)
            for(priceIndex = 0;priceIndex < smaQueryParam.amount - 1;priceIndex++) {
                priceTotal = result[0].close
                for(averageIndex = priceIndex;averageIndex > 0;averageIndex--) {
                    priceTotal += result[averageIndex].close
                }
                currentSMA.push(priceTotal/(priceIndex + 1))
                volume.push(result[priceIndex].volume)
            }
            for(priceIndex = 1;priceIndex < smaQueryParam.amount - 1;priceIndex++) {
                priceTotal = result[1].close
                for(averageIndex = priceIndex;averageIndex > 1;averageIndex--) {
                    priceTotal += result[averageIndex].close
                }
                prevSMA.push(priceTotal/(priceIndex))
            }
            for (let counter = 0;counter < 5;counter++) {
                const stockPrice = {
                    open: result[counter].open,
                    high: result[counter].high,
                    low: result[counter].low,
                    close: result[counter].close
                }
                stockPrices.push(stockPrice)
            }
            dbInput = {
                index: stockListIndex,
                stockCode: stockList[stockListIndex],
                stockPrices,
                currentSMA,
                prevSMA,
                volume
            }
            databaseConnection.collection(collectionName).insertOne(dbInput, (error, result) => {
                if (error) return console.log('error connecting collection')
                console.log(stockList[stockListIndex] + ' - ' + stockListIndex)
                stockListIndex++
                (stockListIndex === stockList.length || req.body.quotefor) && clearInterval(closingPriceOperation)
            })
        }, 12000)
    }
}