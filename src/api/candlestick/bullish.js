import Utility from '../utility'
export default class Bullish {
    constructor(databaseConnection, collectionName, req, res) {
        let gapUp = [], bullishHammer = [], bullishHammerInverted = [], bullishEngulfing = [], eveningStar = [], twoWhiteSoldiers = [], threeWhiteSoldiers = [], shavenUp = [], piercing = []
        let utility = new Utility()
        const reqDate = utility.formatDate(req.body.candlestickdate)
        const range = req.body.candlestickrange
        databaseConnection.collection(collectionName).find().toArray((error, result)=> {
            if (error) return console.log(error)
            for(let index = 0;index < result.length - 1;index++) {
                let firstdaysOpen = 0, firstdaysClose = 0, firstdaysHigh = 0, firstdaysLow = 0, seconddaysOpen = 0, seconddaysClose = 0,
                    seconddaysHigh = 0, seconddaysLow = 0, thirddaysOpen = 0, thirddaysClose = 0, thirddaysHigh = 0, thirddaysLow = 0
                if(range === 'daily') {
                    const reqDateIndex = result[index].quoteDBRecord.findIndex(dbRecord => dbRecord.quoteDate == reqDate)
                    firstdaysOpen   = parseFloat(result[index].quoteDBRecord[reqDateIndex - 2].quoteOpenPrice.replace(/,/g, ''))
                    firstdaysClose  = parseFloat(result[index].quoteDBRecord[reqDateIndex - 2].quoteClosePrice.replace(/,/g, ''))
                    firstdaysHigh   = parseFloat(result[index].quoteDBRecord[reqDateIndex - 2].quoteHighPrice.replace(/,/g, ''))
                    firstdaysLow    = parseFloat(result[index].quoteDBRecord[reqDateIndex - 2].quoteLowPrice.replace(/,/g, ''))
                    seconddaysOpen  = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteOpenPrice.replace(/,/g, ''))
                    seconddaysClose = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteClosePrice.replace(/,/g, ''))
                    seconddaysHigh  = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteHighPrice.replace(/,/g, ''))
                    seconddaysLow   = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteLowPrice.replace(/,/g, ''))
                    thirddaysOpen   = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteOpenPrice.replace(/,/g, ''))
                    thirddaysClose  = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteClosePrice.replace(/,/g, ''))
                    thirddaysHigh   = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteHighPrice.replace(/,/g, ''))
                    thirddaysLow    = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, ''))
                }
                else if(range === 'weekly') {
                    let currentDate = reqDate
                    for(let weekCount = 1; weekCount < 4; weekCount++) {
                        let tempHigh = 0, tempLow = 0
                        for(let dayCount = 1; dayCount < 6; dayCount++) {
                            let reqDateIndex = result[index].quoteDBRecord.findIndex(dbRecord => dbRecord.quoteDate == currentDate)
                            if(reqDateIndex > 0) {
                                if(weekCount === 1) {
                                    if(!thirddaysClose) { thirddaysClose = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteClosePrice.replace(/,/g, '')) }
                                    tempHigh = tempHigh > parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteHighPrice.replace(/,/g, '')) ? tempHigh : parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteHighPrice.replace(/,/g, ''))
                                    thirddaysHigh = tempHigh
                                    thirddaysLow = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, '')) < tempLow ? parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, '')) : tempLow
                                    tempLow = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, ''))
                                    thirddaysOpen = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteOpenPrice.replace(/,/g, ''))
                                } else if(weekCount === 2) {
                                    if(!seconddaysClose) { seconddaysClose = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteClosePrice.replace(/,/g, '')) }
                                    tempHigh = tempHigh > parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteHighPrice.replace(/,/g, '')) ? tempHigh : parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteHighPrice.replace(/,/g, ''))
                                    seconddaysHigh = tempHigh
                                    seconddaysLow = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, '')) < tempLow ? parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, '')) : tempLow
                                    tempLow = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, ''))
                                    seconddaysOpen = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteOpenPrice.replace(/,/g, ''))
                                } else if(weekCount === 3) {
                                    if(!firstdaysClose) { firstdaysClose = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteClosePrice.replace(/,/g, '')) }
                                    tempHigh = tempHigh > parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteHighPrice.replace(/,/g, '')) ? tempHigh : parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteHighPrice.replace(/,/g, ''))
                                    firstdaysHigh = tempHigh
                                    firstdaysLow = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, '')) < tempLow ? parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, '')) : tempLow
                                    tempLow = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, ''))
                                    firstdaysOpen = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteOpenPrice.replace(/,/g, ''))
                                }
                            }
                            currentDate = this.decrementDate(currentDate, 1)
                        }
                        currentDate = this.decrementDate(currentDate, 2)
                    }
                    console.log(thirddaysClose+'-'+thirddaysHigh+'-'+thirddaysLow+'-'+thirddaysOpen)
                }
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
     
                let twoWSIsUpTrend = thirddaysHigh > seconddaysHigh
                let twoWSIsAllBullish = seconddaysOpen < seconddaysClose && thirddaysOpen < thirddaysClose                      
                let twoWSDoesOpenWithinPreviousBody = seconddaysHigh > thirddaysOpen  && thirddaysOpen < seconddaysClose

                let isUpTrend = seconddaysHigh > firstdaysHigh && thirddaysHigh > seconddaysHigh
                let isAllBullish = firstdaysOpen < firstdaysClose && seconddaysOpen < seconddaysClose && thirddaysOpen < thirddaysClose                      
                let doesOpenWithinPreviousBody = firstdaysClose > seconddaysOpen && seconddaysOpen <  firstdaysHigh && seconddaysHigh > thirddaysOpen  && thirddaysOpen < seconddaysClose

                let shaven = thirddaysClose > thirddaysOpen && utility.approximateEqual(thirddaysClose, thirddaysHigh) && utility.approximateEqual(thirddaysOpen, thirddaysLow)

                let lastDayMidPoint = (seconddaysOpen + seconddaysClose) / 2
                let isPiercing = thirddaysLow < seconddaysLow && seconddaysLow > thirddaysOpen && thirddaysClose > thirddaysOpen && thirddaysClose > lastDayMidPoint
                if (isBullishHammer)
                    bullishHammer.push(result[index].stockCode)
                if (isBullishInvertedHammer)
                    bullishHammerInverted.push(result[index].stockCode)
                if (isBullishEngulfing)
                    bullishEngulfing.push(result[index].stockCode)
                if (isFirstBearish && (dojiExists || isSmallBodyExists) && gapExists && isThirdBullish && doesCloseAboveFirstMidpoint)
                    eveningStar.push(result[index].stockCode)
                if (twoWSIsUpTrend && twoWSIsAllBullish && twoWSDoesOpenWithinPreviousBody)
                    twoWhiteSoldiers.push(result[index].stockCode)
                if (isUpTrend && isAllBullish && doesOpenWithinPreviousBody)
                    threeWhiteSoldiers.push(result[index].stockCode)
                if (shaven)
                    shavenUp.push(result[index].stockCode)
                if (isPiercing)
                    piercing.push(result[index].stockCode)
            }
            res.render('../src/views/candlestick/bullish.ejs', {
                bullishHammer,
                bullishHammerInverted,
                bullishEngulfing,
                eveningStar,
                gapUp,
                twoWhiteSoldiers: twoWhiteSoldiers.filter(twoWhiteSoldier => !threeWhiteSoldiers.includes(twoWhiteSoldier)),
                threeWhiteSoldiers,
                shavenUp,
                piercing
            })
        })
    }
    downwardTrend (stockData) {
        const end = 4;
        let gains = averagegain({ values: data.close.slice(0, end), period: end - 1 });
        let losses = averageloss({ values: data.close.slice(0, end), period: end - 1 });
        return losses > gains;
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