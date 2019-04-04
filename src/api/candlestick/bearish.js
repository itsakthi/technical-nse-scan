import Utility from '../utility'

export default class Bearish {
    constructor(databaseConnection, collectionName, req, res) {
        let gapDown = [], bearishHammer = [], bearishHammerInverted = [], bearishEngulfing = [], morningStar = []
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

                if((seconddaysClose > seconddaysOpen) && (thirddaysOpen < seconddaysOpen) && (thirddaysClose < seconddaysOpen) && (thirddaysHigh < seconddaysLow)) {
                    gapDown.push(result[index].stockCode)
                }
                else if((thirddaysOpen < seconddaysClose) && (thirddaysClose < seconddaysClose) && (thirddaysHigh < seconddaysLow)) {
                    gapDown.push(result[index].stockCode)
                }

                let isBearishHammer = thirddaysOpen > thirddaysClose
                isBearishHammer = isBearishHammer && utility.approximateEqual(thirddaysOpen, thirddaysHigh)
                isBearishHammer = isBearishHammer && ((thirddaysOpen - thirddaysClose) * 2) <= (thirddaysClose - thirddaysLow)

                let isBearishInvertedHammer = thirddaysOpen > thirddaysClose
                isBearishInvertedHammer = isBearishInvertedHammer && utility.approximateEqual(thirddaysClose, thirddaysLow)
                isBearishInvertedHammer = isBearishInvertedHammer && ((thirddaysOpen - thirddaysClose) * 2) <= (thirddaysHigh - thirddaysOpen)

                let isBearishEngulfing = ((seconddaysClose > seconddaysOpen) && (seconddaysOpen < thirddaysOpen) && (seconddaysClose < thirddaysOpen) && (seconddaysOpen > thirddaysClose));
        
                let firstdaysMidpoint = ((firstdaysOpen+firstdaysClose)/2)
                let isFirstBullish = firstdaysClose > firstdaysOpen
                let dojiExists =  utility.star(seconddaysOpen, seconddaysClose, seconddaysHigh, seconddaysLow)
                let isSmallBodyExists = ((firstdaysHigh < seconddaysLow) && (firstdaysHigh < seconddaysHigh))
                let isThirdBearish = thirddaysOpen > thirddaysClose
                let gapExists = (isSmallBodyExists && (thirddaysOpen < seconddaysLow) && (seconddaysClose > thirddaysOpen))
                let doesCloseBelowFirstMidpoint = thirddaysClose < firstdaysMidpoint
        
                if (isBearishHammer) {
                    bearishHammer.push(result[index].stockCode)
                }
                if (isBearishInvertedHammer) {
                    bearishHammerInverted.push(result[index].stockCode)
                }
                if (isBearishEngulfing) {
                    bearishEngulfing.push(result[index].stockCode)
                }
                if (isFirstBullish && (dojiExists || isSmallBodyExists) && gapExists && isThirdBearish && doesCloseBelowFirstMidpoint) {
                    morningStar.push(result[index].stockCode)
                }
            }
            res.render('../src/views/candlestick/bearish.ejs', {
                bearishHammer,
                bearishHammerInverted,
                bearishEngulfing,
                gapDown,
                morningStar
            })
        })
    }
}