'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utility = require('./utility');

var _utility2 = _interopRequireDefault(_utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AboveVolume = function AboveVolume(databaseConnection, collectionName, req, res) {
    _classCallCheck(this, AboveVolume);

    var volume = req.body.above_volume || 2;
    var utility = new _utility2.default();
    var reqDate = utility.formatDate(req.body.volumedate);
    databaseConnection.collection(collectionName).find().toArray(function (error, result) {
        if (error) return console.log(error);
        var stockName = [],
            volumePercentageDiff = [];
        for (var index = 0; index < result.length - 1; index++) {
            var reqDateIndex = result[index].quoteDBRecord.findIndex(function (dbRecord) {
                return dbRecord.quoteDate == reqDate;
            });
            var prevVolume = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteVolume.replace(/,/g, ''));
            var currentVolume = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteVolume.replace(/,/g, ''));
            if (currentVolume >= prevVolume * volume) {
                stockName.push(result[index].stockCode);
                volumePercentageDiff.push(currentVolume / prevVolume * 100);
            }
        }
        res.render('../src/views/above-volume.ejs', {
            stockName: stockName,
            volumePercentageDiff: volumePercentageDiff
        });
    });
};

exports.default = AboveVolume;