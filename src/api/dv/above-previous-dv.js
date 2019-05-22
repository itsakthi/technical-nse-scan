import Utility from '../utility'

export default class AbovePreviousDV {
    constructor(databaseConnection, collectionName, req, res) {
        const aboveDVPrev = req.body.above_dv_prev || 2
        let utility = new Utility()
        const reqDate = utility.formatDate(req.body.dvdate)
        databaseConnection.collection(collectionName).find().toArray((error, result)=> {
            if (error) return console.log(error)
            let stockName = [], deliveryPercentageDiff = []
            for(let index = 0;index < result.length - 1;index++) {
                let prevDV, currentDV
                const reqDateIndex = result[index].quoteDBRecord.findIndex(dbRecord => dbRecord.quoteDate == reqDate)
                if(req.body.delivery === 'delivery_volume') {
                    const prevVolume = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteVolume.replace(/,/g, ''))
                    const currentVolume = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteVolume.replace(/,/g, ''))
                    if(currentVolume <= (prevVolume * aboveDVPrev)) {
                        prevDV = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteVolumeDelivered.replace(/,/g, ''))
                        currentDV = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteVolumeDelivered.replace(/,/g, ''))
                    }
                } else if(req.body.delivery === 'delivery_percentage') {
                    prevDV = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteDeliveryPercentage.replace(/,/g, ''))
                    currentDV = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteDeliveryPercentage.replace(/,/g, ''))
                }
                if(currentDV >= (prevDV * 2)) {
                    stockName.push(result[index].stockCode)
                    deliveryPercentageDiff.push((currentDV / prevDV) * 100)
                }
            }
            res.render('../src/views/dv/above-previous-dv.ejs', {
                stockName,
                deliveryPercentageDiff
            })
        })
    }
}
