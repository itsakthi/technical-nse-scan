'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utility = require('../utility');

var _utility2 = _interopRequireDefault(_utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Star = function Star(databaseConnection, collectionName, res) {
    _classCallCheck(this, Star);

    var star = [];
    var utility = new _utility2.default();
    databaseConnection.collection(collectionName).find().toArray(function (error, result) {
        if (error) return console.log(error);
        for (var index = 0; index < result.length - 1; index++) {
            var quotesRecordCount = result[index].quoteDBRecord.length;
            var currentOpenPrice = parseFloat(result[index].quoteDBRecord[quotesRecordCount - 1].quoteOpenPrice.replace(/,/g, ''));
            var currentClosePrice = parseFloat(result[index].quoteDBRecord[quotesRecordCount - 1].quoteClosePrice.replace(/,/g, ''));
            var currentHighPrice = parseFloat(result[index].quoteDBRecord[quotesRecordCount - 1].quoteHighPrice.replace(/,/g, ''));
            var currentLowPrice = parseFloat(result[index].quoteDBRecord[quotesRecordCount - 1].quoteLowPrice.replace(/,/g, ''));

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