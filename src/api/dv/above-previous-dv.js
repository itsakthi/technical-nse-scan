export default class AbovePreviousDV {
    constructor(databaseConnection, collectionName, req, res) {
        const aboveDVPrev = req.body.above_dv_prev || 50
        databaseConnection.collection(collectionName).find().toArray((error, result)=> {
            if (error) return console.log(error)
            let stockName = [], deliveryPercentageDiff = []
            for(let index = 0;index < result.length - 1;index++) {
                const quoteDBRecordCount = result[index].quoteDBRecord.length
                let prevDV, currentDV
                if(req.body.delivery === 'delivery_volume') {
                    prevDV = parseFloat(result[index].quoteDBRecord[quoteDBRecordCount - 2].quoteVolumeDelivered.replace(/,/g, ''))
                    currentDV = parseFloat(result[index].quoteDBRecord[quoteDBRecordCount - 1].quoteVolumeDelivered.replace(/,/g, ''))
                } else if(req.body.delivery === 'delivery_percentage') {
                    prevDV = parseFloat(result[index].quoteDBRecord[quoteDBRecordCount - 2].quoteDeliveryPercentage.replace(/,/g, ''))
                    currentDV = parseFloat(result[index].quoteDBRecord[quoteDBRecordCount - 1].quoteDeliveryPercentage.replace(/,/g, ''))
                }
                if(currentDV > prevDV * (100 / aboveDVPrev)) {
                    stockName.push(result[index].stockCode)
                    deliveryPercentageDiff.push(((currentDV - prevDV) / prevDV) * 100)
                }
            }
            res.render('../src/views/dv/above-previous-dv.ejs', {
                stockName,
                deliveryPercentageDiff
            })
        })
    }
}