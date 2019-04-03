'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbovePreviousDV = function AbovePreviousDV(databaseConnection, collectionName, req, res) {
    _classCallCheck(this, AbovePreviousDV);

    var aboveDVPrev = req.body.above_dv_prev || 50;
    databaseConnection.collection(collectionName).find().toArray(function (error, result) {
        if (error) return console.log(error);
        var stockName = [],
            deliveryPercentageDiff = [];
        for (var index = 0; index < result.length - 1; index++) {
            var quoteDBRecordCount = result[index].quoteDBRecord.length;
            var prevDV = parseFloat(result[index].quoteDBRecord[quoteDBRecordCount - 2].quoteDeliveryPercentage.replace(/,/g, ''));
            var currentDV = parseFloat(result[index].quoteDBRecord[quoteDBRecordCount - 1].quoteDeliveryPercentage.replace(/,/g, ''));
            if (currentDV > prevDV * (100 / aboveDVPrev)) {
                stockName.push(result[index].stockCode);
                deliveryPercentageDiff.push((currentDV - prevDV) / prevDV * 100);
            }
        }
        res.render('../src/views/dv/above-previous-dv.ejs', {
            stockName: stockName,
            deliveryPercentageDiff: deliveryPercentageDiff
        });
    });
};

exports.default = AbovePreviousDV;