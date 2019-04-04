'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utility = require('../utility');

var _utility2 = _interopRequireDefault(_utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Star = function Star(databaseConnection, collectionName, req, res) {
    _classCallCheck(this, Star);

    var star = [];
    var utility = new _utility2.default();
    var reqDate = utility.formatDate(req.body.candlestickdate);
    databaseConnection.collection(collectionName).find().toArray(function (error, result) {
        if (error) return console.log(error);
        for (var index = 0; index < result.length - 1; index++) {
            var reqDateIndex = result[index].quoteDBRecord.findIndex(function (dbRecord) {
                return dbRecord.quoteDate == reqDate;
            });
            var currentOpenPrice = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteOpenPrice.replace(/,/g, ''));
            var currentClosePrice = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteClosePrice.replace(/,/g, ''));
            var currentHighPrice = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteHighPrice.replace(/,/g, ''));
            var currentLowPrice = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, ''));

            var isOpenEqualsClose = utility.approximateEqual(currentOpenPrice, currentClosePrice);
            var isHighEqualsOpen = isOpenEqualsClose && utility.approximateEqual(currentOpenPrice, currentHighPrice);
            var isLowEqualsClose = isOpenEqualsClose && utility.approximateEqual(currentClosePrice, currentLowPrice);
            if (isOpenEqualsClose && isHighEqualsOpen == isLowEqualsClose) {
                star.push(result[index].stockCode);
            }
        }
        res.render('../src/views/candlestick/star.ejs', {
            star: star
        });
    });
};

exports.default = Star;