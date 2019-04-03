import https from 'https'

export default class DeliveryPercentage {
    constructor(databaseConnection, collectionName, req, res, stockList) {
        const date = req.body.date
        console.log('Inside Update Delivery Percentage Document')
        let options = {
            'host': 'www.nseindia.com',
            'path': '/archives/equities/mto/MTO_' + date + '2019.DAT'
        }
        https.get(options, function (http_res) {
            var data = ""
            http_res.on("data", function (chunk) {
                data += chunk
            });
            http_res.on("end", function () {
                const lines = data.split("\n")
                let result = [], headers = [], counter, innerCounter
                headers = lines[3].split(",")
                for(counter = 4; counter < lines.length; counter++){
                    let currentline = lines[counter].split(",")
                    let pushToDocument
                    if(currentline[3] === "EQ") {
                        pushToDocument = { deliveryPercentage: currentline[6], totalTradedQuantity: currentline[4] }
                    } else if(currentline[3] === "BL") {
                        console.log(currentline[2] + 'check bulk deal')
                    } else {
                        console.log(currentline[2] + 'check other series types')
                    }
                    stockList.find(item => {
                        if(item === currentline[2]) {
                            databaseConnection.collection(collectionName).updateOne({ stockCode: item }, { $push: pushToDocument }, function(err, res) {
                                if (err) { console.log(item); throw err }
                            })
                        }
                    })

                }
                res.send('<p>Updated Delivery Percentage Document</p>')
                console.log('Updated Delivery Percentage Document')
            })
        })
    }
}
