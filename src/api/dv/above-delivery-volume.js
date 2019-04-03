export default class AboveDeliveryVolume {
    constructor(databaseConnection, collectionName, req, res) {
        const volume = req.body.above_volume
        databaseConnection.collection(collectionName).find().toArray((error, result)=> {
            if (error) return console.log(error)
            let stockName = [], volumeIncStock = [], deliveryPercentage = []
            for(let index = 0;index < result.length - 1;index++) {
                let totalVolume = 0, volumeIncLength = 0
                const quoteDBRecordCount = result[index].quoteDBRecord.length
                for(let counter = 1;counter <= volume; counter++) {
                    totalVolume = totalVolume + parseFloat(result[index].quoteDBRecord[quoteDBRecordCount - counter].quoteDeliveryPercentage.replace(/,/g, ''))
                }
                if ((totalVolume/volume) > 50) {
                    stockName.push(result[index].stockCode)
                    deliveryPercentage.push(totalVolume/volume)
                }
            }
            res.render('../src/views/dv/above-delivery-volume.ejs', {
                stockName,
                deliveryPercentage
            })
        })
    }
}