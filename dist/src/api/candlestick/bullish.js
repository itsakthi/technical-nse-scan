'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utility = require('../utility');

var _utility2 = _interopRequireDefault(_utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bullish = function () {
    function Bullish(databaseConnection, collectionName, req, res) {
        _classCallCheck(this, Bullish);

        var gapUp = [],
            bullishHammer = [],
            bullishHammerInverted = [],
            bullishEngulfing = [],
            eveningStar = [];
        var utility = new _utility2.default();
        var reqDate = utility.formatDate(req.body.candlestickdate);
        databaseConnection.collection(collectionName).find().toArray(function (error, result) {
            if (error) return console.log(error);
            for (var index = 0; index < result.length - 1; index++) {
                var quotesRecordCount = result[index].quoteDBRecord.length;
                var firstdaysOpen = parseFloat(result[index].quoteDBRecord[quotesRecordCount - 3].quoteOpenPrice.replace(/,/g, ''));
                var firstdaysClose = parseFloat(result[index].quoteDBRecord[quotesRecordCount - 3].quoteClosePrice.replace(/,/g, ''));
                var firstdaysHigh = parseFloat(result[index].quoteDBRecord[quotesRecordCount - 3].quoteHighPrice.replace(/,/g, ''));
                var firstdaysLow = parseFloat(result[index].quoteDBRecord[quotesRecordCount - 3].quoteLowPrice.replace(/,/g, ''));
                var seconddaysOpen = parseFloat(result[index].quoteDBRecord[quotesRecordCount - 2].quoteOpenPrice.replace(/,/g, ''));
                var seconddaysClose = parseFloat(result[index].quoteDBRecord[quotesRecordCount - 2].quoteClosePrice.replace(/,/g, ''));
                var seconddaysHigh = parseFloat(result[index].quoteDBRecord[quotesRecordCount - 2].quoteHighPrice.replace(/,/g, ''));
                var seconddaysLow = parseFloat(result[index].quoteDBRecord[quotesRecordCount - 2].quoteLowPrice.replace(/,/g, ''));
                var thirddaysOpen = parseFloat(result[index].quoteDBRecord[quotesRecordCount - 1].quoteOpenPrice.replace(/,/g, ''));
                var thirddaysClose = parseFloat(result[index].quoteDBRecord[quotesRecordCount - 1].quoteClosePrice.replace(/,/g, ''));
                var thirddaysHigh = parseFloat(result[index].quoteDBRecord[quotesRecordCount - 1].quoteHighPrice.replace(/,/g, ''));
                var thirddaysLow = parseFloat(result[index].quoteDBRecord[quotesRecordCount - 1].quoteLowPrice.replace(/,/g, ''));

                if (seconddaysClose > seconddaysOpen && thirddaysOpen > seconddaysClose && thirddaysClose > seconddaysClose && thirddaysLow > seconddaysHigh) {
                    gapUp.push(result[index].stockCode);
                } else if (thirddaysOpen > seconddaysOpen && thirddaysClose > seconddaysOpen && thirddaysLow > seconddaysHigh) {
                    gapUp.push(result[index].stockCode);
                }

                var isBullishHammer = thirddaysClose > thirddaysOpen;
                isBullishHammer = isBullishHammer && utility.approximateEqual(thirddaysClose, thirddaysHigh);
                isBullishHammer = isBullishHammer && thirddaysClose - thirddaysOpen <= 2 * (thirddaysOpen - thirddaysLow);

                var isBullishInvertedHammer = isBullishHammer && utility.approximateEqual(thirddaysOpen, thirddaysLow);
                isBullishInvertedHammer = isBullishInvertedHammer && thirddaysClose - thirddaysOpen <= 2 * (thirddaysHigh - thirddaysClose);

                var isBullishEngulfing = seconddaysClose < seconddaysOpen && seconddaysOpen > thirddaysOpen && seconddaysClose > thirddaysOpen && seconddaysOpen < thirddaysClose;

                var firstdaysMidpoint = (firstdaysOpen + firstdaysClose) / 2;
                var isFirstBearish = firstdaysClose < firstdaysOpen;
                var dojiExists = utility.star(seconddaysOpen, seconddaysClose, seconddaysHigh, seconddaysLow);
                var isSmallBodyExists = firstdaysLow > seconddaysLow && firstdaysLow > seconddaysHigh;
                var isThirdBullish = thirddaysOpen < thirddaysClose;
                var gapExists = seconddaysHigh < firstdaysLow && seconddaysLow < firstdaysLow && thirddaysOpen > seconddaysHigh && seconddaysClose < thirddaysOpen;
                var doesCloseAboveFirstMidpoint = thirddaysClose > firstdaysMidpoint;

                if (isBullishHammer) {
                    bullishHammer.push(result[index].stockCode);
                }
                if (isBullishInvertedHammer) {
                    bullishHammerInverted.push(result[index].stockCode);
                }
                if (isBullishEngulfing) {
                    bullishEngulfing.push(result[index].stockCode);
                }
                if (isFirstBearish && (isSmallBodyExists || isSmallBodyExists) && gapExists && isThirdBullish && doesCloseAboveFirstMidpoint) {
                    eveningStar.push(result[index].stockCode);
                }
            }
            res.render('../src/views/candlestick/bullish.ejs', {
                bullishHammer: bullishHammer,
                bullishHammerInverted: bullishHammerInverted,
                bullishEngulfing: bullishEngulfing,
                eveningStar: eveningStar,
                gapUp: gapUp
            });
        });
    }

    _createClass(Bullish, [{
        key: 'downwardTrend',
        value: function downwardTrend(stockData) {
            var end = 4;
            // Analyze trends in closing prices of the first three or four candlesticks
            var gains = averagegain({ values: data.close.slice(0, end), period: end - 1 });
            var losses = averageloss({ values: data.close.slice(0, end), period: end - 1 });
            // Downward trend, so more losses than gains
            return losses > gains;
        }
    }]);

    return Bullish;
}();

exports.default = Bullish;