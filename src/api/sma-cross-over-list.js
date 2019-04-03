export default class SmaCrossOverList {
    constructor(databaseConnection, collectionName, req, res) {
        const movingAverage1 = req.body.first_moving_average
        const movingAverage2 = req.body.second_moving_average
        let prevSMA, currentSMA, stockListCode =[]

        databaseConnection.collection(collectionName).find().toArray((error, result)=> {
            if (error) return console.log(error)
            for(let index = 0;index < result.length - 1;index++) {
            const currentSMA1 = result[index].currentSMA[movingAverage1 -1]
            const prevSMA1 = result[index].prevSMA[movingAverage1 - 1]
            const currentSMA2 = result[index].currentSMA[movingAverage2 -1]
            const prevSMA2 = result[index].prevSMA[movingAverage2 -1]

            currentSMA1 - currentSMA2 < 0 ? prevSMA = false : prevSMA = true
            prevSMA1 - prevSMA2 < 0 ? currentSMA = false : currentSMA = true
            if(prevSMA ? !currentSMA : currentSMA) {
                stockListCode.push(result[index].stockCode)
            }
            }
            res.render('../src/views/sma-cross-over-list.ejs', {stockListCode})
        })
    }
}