import Utility from './utility'

export default class AboveVolume {
    constructor(databaseConnection, collectionName, req, res) {
        const volume = req.body.above_volume || 2
        let utility = new Utility()
        const reqDate = utility.formatDate(req.body.volumedate)
        databaseConnection.collection(collectionName).find().toArray((error, result)=> {
            if (error) return console.log(error)
            let stockName = [], volumePercentageDiff = []
            for(let index = 0;index < result.length - 1;index++) {
                const reqDateIndex = result[index].quoteDBRecord.findIndex(dbRecord => dbRecord.quoteDate == reqDate)
                const prevVolume = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteVolume.replace(/,/g, ''))
                const currentVolume = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteVolume.replace(/,/g, ''))
                if(currentVolume >= (prevVolume * volume)) {
                    stockName.push(result[index].stockCode)
                    volumePercentageDiff.push((currentVolume / prevVolume) * 100)
                }
            }
            res.render('../src/views/above-volume.ejs', {
                stockName,
                volumePercentageDiff
            })
        })
    }
}