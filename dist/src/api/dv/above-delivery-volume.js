'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AboveDeliveryVolume = function AboveDeliveryVolume(databaseConnection, collectionName, req, res) {
    _classCallCheck(this, AboveDeliveryVolume);

    var volume = req.body.above_volume;
    databaseConnection.collection(collectionName).find().toArray(function (error, result) {
        if (error) return console.log(error);
        var stockName = [],
            volumeIncStock = [],
            deliveryPercentage = [];
        for (var index = 0; index < result.length - 1; index++) {
            var totalVolume = 0,
                volumeIncLength = 0;
            var quoteDBRecordCount = result[index].quoteDBRecord.length;
            for (var counter = 1; counter <= volume; counter++) {
                totalVolume = totalVolume + parseFloat(result[index].quoteDBRecord[quoteDBRecordCount - counter].quoteDeliveryPercentage.replace(/,/g, ''));
            }
            if (totalVolume / volume > 50) {
                stockName.push(result[index].stockCode);
                deliveryPercentage.push(totalVolume / volume);
            }
        }
        res.render('../src/views/dv/above-delivery-volume.ejs', {
            stockName: stockName,
            deliveryPercentage: deliveryPercentage
        });
    });
};

exports.default = AboveDeliveryVolume;