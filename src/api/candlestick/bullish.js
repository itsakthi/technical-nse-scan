import Utility from '../utility'

export default class Bullish {
    constructor(databaseConnection, collectionName, req, res) {
        let gapUp = [], bullishHammer = [], bullishHammerInverted = [], bullishEngulfing = [], eveningStar = []
        let utility = new Utility()
        const reqDate = utility.formatDate(req.body.candlestickdate)
        databaseConnection.collection(collectionName).find().toArray((error, result)=> {
            if (error) return console.log(error)
            for(let index = 0;index < result.length - 1;index++) {
                const reqDateIndex = result[index].quoteDBRecord.findIndex(dbRecord => dbRecord.quoteDate == reqDate)
                let firstdaysOpen   = parseFloat(result[index].quoteDBRecord[reqDateIndex - 2].quoteOpenPrice.replace(/,/g, ''))
                let firstdaysClose  = parseFloat(result[index].quoteDBRecord[reqDateIndex - 2].quoteClosePrice.replace(/,/g, ''))
                let firstdaysHigh   = parseFloat(result[index].quoteDBRecord[reqDateIndex - 2].quoteHighPrice.replace(/,/g, ''))
                let firstdaysLow    = parseFloat(result[index].quoteDBRecord[reqDateIndex - 2].quoteLowPrice.replace(/,/g, ''))
                let seconddaysOpen  = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteOpenPrice.replace(/,/g, ''))
                let seconddaysClose = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteClosePrice.replace(/,/g, ''))
                let seconddaysHigh  = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteHighPrice.replace(/,/g, ''))
                let seconddaysLow   = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteLowPrice.replace(/,/g, ''))
                let thirddaysOpen   = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteOpenPrice.replace(/,/g, ''))
                let thirddaysClose  = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteClosePrice.replace(/,/g, ''))
                let thirddaysHigh   = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteHighPrice.replace(/,/g, ''))
                let thirddaysLow    = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, ''))

                if((seconddaysClose > seconddaysOpen) && (thirddaysOpen > seconddaysClose) && (thirddaysClose > seconddaysClose) && (thirddaysLow > seconddaysHigh)) {
                    gapUp.push(result[index].stockCode)
                } else if((thirddaysOpen > seconddaysOpen) && (thirddaysClose > seconddaysOpen) && (thirddaysLow > seconddaysHigh)) {
                    gapUp.push(result[index].stockCode) 
                }

                let isBullishHammer = thirddaysClose > thirddaysOpen
                isBullishHammer = isBullishHammer && utility.approximateEqual(thirddaysClose, thirddaysHigh)
                isBullishHammer = isBullishHammer && ((thirddaysClose - thirddaysOpen) * 2) <= (thirddaysOpen - thirddaysLow)
                
                let isBullishInvertedHammer = thirddaysClose > thirddaysOpen
                isBullishInvertedHammer = isBullishInvertedHammer && utility.approximateEqual(thirddaysOpen, thirddaysLow)
                isBullishInvertedHammer = isBullishInvertedHammer && ((thirddaysClose - thirddaysOpen) * 2) <= (thirddaysHigh - thirddaysClose)

                let isBullishEngulfing = ((seconddaysClose < seconddaysOpen) && (seconddaysOpen > thirddaysOpen) && (seconddaysClose > thirddaysOpen) && (seconddaysOpen < thirddaysClose))
                
                let firstdaysMidpoint = ((firstdaysOpen+firstdaysClose)/2)
                let isFirstBearish = firstdaysClose < firstdaysOpen
                let dojiExists =  utility.star(seconddaysOpen, seconddaysClose, seconddaysHigh, seconddaysLow)
                let isSmallBodyExists = ((firstdaysLow > seconddaysLow) && (firstdaysLow > seconddaysHigh))
                let isThirdBullish = thirddaysOpen < thirddaysClose 
                let gapExists = (isSmallBodyExists && (thirddaysOpen > seconddaysHigh) && (seconddaysClose < thirddaysOpen))
                let doesCloseAboveFirstMidpoint = thirddaysClose > firstdaysMidpoint
     
                if (isBullishHammer) {
                    bullishHammer.push(result[index].stockCode)
                }
                if (isBullishInvertedHammer) {
                    bullishHammerInverted.push(result[index].stockCode)
                }
                if (isBullishEngulfing) {
                    bullishEngulfing.push(result[index].stockCode)
                }
                if (isFirstBearish && (dojiExists || isSmallBodyExists) && gapExists && isThirdBullish && doesCloseAboveFirstMidpoint) {
                    eveningStar.push(result[index].stockCode)
                }
            }
            res.render('../src/views/candlestick/bullish.ejs', {
                bullishHammer,
                bullishHammerInverted,
                bullishEngulfing,
                eveningStar,
                gapUp
            })
        })
    }
    downwardTrend (stockData) {
        const end = 4;
        // Analyze trends in closing prices of the first three or four candlesticks
        let gains = averagegain({ values: data.close.slice(0, end), period: end - 1 });
        let losses = averageloss({ values: data.close.slice(0, end), period: end - 1 });
        // Downward trend, so more losses than gains
        return losses > gains;
    }

}