'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utility = require('../utility');

var _utility2 = _interopRequireDefault(_utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbovePreviousDV = function AbovePreviousDV(databaseConnection, collectionName, req, res) {
    _classCallCheck(this, AbovePreviousDV);

    var aboveDVPrev = req.body.above_dv_prev || 2;
    var utility = new _utility2.default();
    var reqDate = utility.formatDate(req.body.dvdate);
    databaseConnection.collection(collectionName).find().toArray(function (error, result) {
        if (error) return console.log(error);
        var stockName = [],
            deliveryPercentageDiff = [];
        for (var index = 0; index < result.length - 1; index++) {
            var prevDV = void 0,
                currentDV = void 0;
            var reqDateIndex = result[index].quoteDBRecord.findIndex(function (dbRecord) {
                return dbRecord.quoteDate == reqDate;
            });
            if (req.body.delivery === 'delivery_volume') {
                var prevVolume = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteVolume.replace(/,/g, ''));
                var currentVolume = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteVolume.replace(/,/g, ''));
                if (currentVolume <= prevVolume * aboveDVPrev) {
                    prevDV = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteVolumeDelivered.replace(/,/g, ''));
                    currentDV = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteVolumeDelivered.replace(/,/g, ''));
                }
            } else if (req.body.delivery === 'delivery_percentage') {
                prevDV = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteDeliveryPercentage.replace(/,/g, ''));
                currentDV = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteDeliveryPercentage.replace(/,/g, ''));
            }
            if (currentDV >= prevDV * 2) {
                stockName.push(result[index].stockCode);
                deliveryPercentageDiff.push(currentDV / prevDV * 100);
            }
        }
        res.render('../src/views/dv/above-previous-dv.ejs', {
            stockName: stockName,
            deliveryPercentageDiff: deliveryPercentageDiff
        });
    });
};

exports.default = AbovePreviousDV;