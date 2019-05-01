import Utility from '../utility'

export default class Bearish {
    constructor(databaseConnection, collectionName, req, res) {
        let gapDown = [], bearishHammer = [], bearishHammerInverted = [], bearishEngulfing = [], morningStar = [], twoBlackCrows = [], threeBlackCrows = [], shavenDown = [], darkCloud = []
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
                } else if(range === 'weekly') {
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
        
                let twoCrowIsDownTrend = seconddaysLow > thirddaysLow
                let twoCrowIsAllBearish = seconddaysOpen > seconddaysClose && thirddaysOpen > thirddaysClose                                      
                let twoCrowDoesOpenWithinPreviousBody = seconddaysOpen > thirddaysOpen  && thirddaysOpen > seconddaysClose
      
                let isDownTrend = firstdaysLow > seconddaysLow && seconddaysLow > thirddaysLow
                let isAllBearish = firstdaysOpen > firstdaysClose && seconddaysOpen > seconddaysClose && thirddaysOpen > thirddaysClose                                      
                let doesOpenWithinPreviousBody = firstdaysOpen > seconddaysOpen && seconddaysOpen > firstdaysClose && seconddaysOpen > thirddaysOpen  && thirddaysOpen > seconddaysClose
    
                let shaven = thirddaysClose < thirddaysOpen && utility.approximateEqual(thirddaysClose, thirddaysLow) && utility.approximateEqual(thirddaysOpen, thirddaysHigh)
                
                let isDarkCloud = thirddaysOpen > seconddaysHigh && thirddaysClose > seconddaysOpen && thirddaysClose < seconddaysClose && thirddaysClose < thirddaysOpen
                if (isBearishHammer)
                    bearishHammer.push(result[index].stockCode)
                if (isBearishInvertedHammer)
                    bearishHammerInverted.push(result[index].stockCode)
                if (isBearishEngulfing)
                    bearishEngulfing.push(result[index].stockCode)
                if (isFirstBullish && (dojiExists || isSmallBodyExists) && gapExists && isThirdBearish && doesCloseBelowFirstMidpoint)
                    morningStar.push(result[index].stockCode)
                if (twoCrowIsDownTrend && twoCrowIsAllBearish && twoCrowDoesOpenWithinPreviousBody)
                    twoBlackCrows.push(result[index].stockCode)
                if (isDownTrend && isAllBearish && doesOpenWithinPreviousBody)
                    threeBlackCrows.push(result[index].stockCode)
                if (shaven)
                    shavenDown.push(result[index].stockCode)
                if (isDarkCloud)
                    darkCloud.push(result[index].stockCode)
            }
            res.render('../src/views/candlestick/bearish.ejs', {
                bearishHammer,
                bearishHammerInverted,
                bearishEngulfing,
                gapDown,
                morningStar,
                twoBlackCrows: twoBlackCrows.filter(twoBlackCrow => !threeBlackCrows.includes(twoBlackCrow)),
                threeBlackCrows,
                shavenDown,
                darkCloud
            })
        })
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