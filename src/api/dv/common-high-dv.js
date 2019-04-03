export default class CommonHighDV {
    constructor(databaseConnection, collectionName, req, res) {
        databaseConnection.collection(collectionName).find().toArray((error, result)=> {
            if (error) return console.log(error)
            let completeDVList = [], totalDays = 5, DV1 = [], DV2 = [], DV3 = [], DV4 = [], DV5 = []
            for(let index = 0;index < result.length - 1;index++) {
                const quoteDBRecordCount = result[index].quoteDBRecord.length
                if(parseFloat(result[index].quoteDBRecord[quoteDBRecordCount - 1].quoteDeliveryPercentage.replace(/,/g, '')) > 50)
                    DV1.push(result[index].stockCode)
                if(parseFloat(result[index].quoteDBRecord[quoteDBRecordCount - 2].quoteDeliveryPercentage.replace(/,/g, '')) > 50)
                    DV2.push(result[index].stockCode)
                if(parseFloat(result[index].quoteDBRecord[quoteDBRecordCount - 3].quoteDeliveryPercentage.replace(/,/g, '')) > 50)
                    DV3.push(result[index].stockCode)
                if(parseFloat(result[index].quoteDBRecord[quoteDBRecordCount - 4].quoteDeliveryPercentage.replace(/,/g, '')) > 50)
                    DV4.push(result[index].stockCode)
                if(parseFloat(result[index].quoteDBRecord[quoteDBRecordCount - 5].quoteDeliveryPercentage.replace(/,/g, '')) > 50)
                    DV5.push(result[index].stockCode)
            }
            completeDVList.push(DV1, DV2, DV3, DV4, DV5)
            let stockList = completeDVList.shift().reduce(function(res, v) {
                if (res.indexOf(v) === -1 && completeDVList.every(function(a) {
                    return a.indexOf(v) !== -1;
                })) res.push(v);
                return res;
            }, []);
            res.render('../src/views/dv/common-high-dv.ejs', {
                stockList
            })
        })
    }
}