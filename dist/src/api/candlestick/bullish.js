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
            eveningStar = [],
            twoWhiteSoldiers = [],
            threeWhiteSoldiers = [],
            shavenUp = [],
            piercing = [];
        var utility = new _utility2.default();
        var reqDate = utility.formatDate(req.body.candlestickdate);
        var range = req.body.candlestickrange;
        databaseConnection.collection(collectionName).find().toArray(function (error, result) {
            if (error) return console.log(error);
            for (var index = 0; index < result.length - 1; index++) {
                var firstdaysOpen = 0,
                    firstdaysClose = 0,
                    firstdaysHigh = 0,
                    firstdaysLow = 0,
                    seconddaysOpen = 0,
                    seconddaysClose = 0,
                    seconddaysHigh = 0,
                    seconddaysLow = 0,
                    thirddaysOpen = 0,
                    thirddaysClose = 0,
                    thirddaysHigh = 0,
                    thirddaysLow = 0;
                if (range === 'daily') {
                    var reqDateIndex = result[index].quoteDBRecord.findIndex(function (dbRecord) {
                        return dbRecord.quoteDate == reqDate;
                    });
                    firstdaysOpen = parseFloat(result[index].quoteDBRecord[reqDateIndex - 2].quoteOpenPrice.replace(/,/g, ''));
                    firstdaysClose = parseFloat(result[index].quoteDBRecord[reqDateIndex - 2].quoteClosePrice.replace(/,/g, ''));
                    firstdaysHigh = parseFloat(result[index].quoteDBRecord[reqDateIndex - 2].quoteHighPrice.replace(/,/g, ''));
                    firstdaysLow = parseFloat(result[index].quoteDBRecord[reqDateIndex - 2].quoteLowPrice.replace(/,/g, ''));
                    seconddaysOpen = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteOpenPrice.replace(/,/g, ''));
                    seconddaysClose = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteClosePrice.replace(/,/g, ''));
                    seconddaysHigh = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteHighPrice.replace(/,/g, ''));
                    seconddaysLow = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteLowPrice.replace(/,/g, ''));
                    thirddaysOpen = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteOpenPrice.replace(/,/g, ''));
                    thirddaysClose = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteClosePrice.replace(/,/g, ''));
                    thirddaysHigh = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteHighPrice.replace(/,/g, ''));
                    thirddaysLow = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, ''));
                } else if (range === 'weekly') {
                    (function () {
                        var currentDate = reqDate;
                        for (var weekCount = 1; weekCount < 4; weekCount++) {
                            var tempHigh = 0,
                                tempLow = 0;
                            for (var dayCount = 1; dayCount < 6; dayCount++) {
                                var _reqDateIndex = result[index].quoteDBRecord.findIndex(function (dbRecord) {
                                    return dbRecord.quoteDate == currentDate;
                                });
                                if (_reqDateIndex > 0) {
                                    if (weekCount === 1) {
                                        if (!thirddaysClose) {
                                            thirddaysClose = parseFloat(result[index].quoteDBRecord[_reqDateIndex].quoteClosePrice.replace(/,/g, ''));
                                        }
                                        tempHigh = tempHigh > parseFloat(result[index].quoteDBRecord[_reqDateIndex].quoteHighPrice.replace(/,/g, '')) ? tempHigh : parseFloat(result[index].quoteDBRecord[_reqDateIndex].quoteHighPrice.replace(/,/g, ''));
                                        thirddaysHigh = tempHigh;
                                        thirddaysLow = parseFloat(result[index].quoteDBRecord[_reqDateIndex].quoteLowPrice.replace(/,/g, '')) < tempLow ? parseFloat(result[index].quoteDBRecord[_reqDateIndex].quoteLowPrice.replace(/,/g, '')) : tempLow;
                                        tempLow = parseFloat(result[index].quoteDBRecord[_reqDateIndex].quoteLowPrice.replace(/,/g, ''));
                                        thirddaysOpen = parseFloat(result[index].quoteDBRecord[_reqDateIndex].quoteOpenPrice.replace(/,/g, ''));
                                    } else if (weekCount === 2) {
                                        if (!seconddaysClose) {
                                            seconddaysClose = parseFloat(result[index].quoteDBRecord[_reqDateIndex].quoteClosePrice.replace(/,/g, ''));
                                        }
                                        tempHigh = tempHigh > parseFloat(result[index].quoteDBRecord[_reqDateIndex].quoteHighPrice.replace(/,/g, '')) ? tempHigh : parseFloat(result[index].quoteDBRecord[_reqDateIndex].quoteHighPrice.replace(/,/g, ''));
                                        seconddaysHigh = tempHigh;
                                        seconddaysLow = parseFloat(result[index].quoteDBRecord[_reqDateIndex].quoteLowPrice.replace(/,/g, '')) < tempLow ? parseFloat(result[index].quoteDBRecord[_reqDateIndex].quoteLowPrice.replace(/,/g, '')) : tempLow;
                                        tempLow = parseFloat(result[index].quoteDBRecord[_reqDateIndex].quoteLowPrice.replace(/,/g, ''));
                                        seconddaysOpen = parseFloat(result[index].quoteDBRecord[_reqDateIndex].quoteOpenPrice.replace(/,/g, ''));
                                    } else if (weekCount === 3) {
                                        if (!firstdaysClose) {
                                            firstdaysClose = parseFloat(result[index].quoteDBRecord[_reqDateIndex].quoteClosePrice.replace(/,/g, ''));
                                        }
                                        tempHigh = tempHigh > parseFloat(result[index].quoteDBRecord[_reqDateIndex].quoteHighPrice.replace(/,/g, '')) ? tempHigh : parseFloat(result[index].quoteDBRecord[_reqDateIndex].quoteHighPrice.replace(/,/g, ''));
                                        firstdaysHigh = tempHigh;
                                        firstdaysLow = parseFloat(result[index].quoteDBRecord[_reqDateIndex].quoteLowPrice.replace(/,/g, '')) < tempLow ? parseFloat(result[index].quoteDBRecord[_reqDateIndex].quoteLowPrice.replace(/,/g, '')) : tempLow;
                                        tempLow = parseFloat(result[index].quoteDBRecord[_reqDateIndex].quoteLowPrice.replace(/,/g, ''));
                                        firstdaysOpen = parseFloat(result[index].quoteDBRecord[_reqDateIndex].quoteOpenPrice.replace(/,/g, ''));
                                    }
                                }
                                currentDate = utility.decrementDate(currentDate, 1);
                            }
                            currentDate = utility.decrementDate(currentDate, 3);
                        }
                        console.log(thirddaysClose + '-' + thirddaysHigh + '-' + thirddaysLow + '-' + thirddaysOpen);
                    })();
                }
                if (seconddaysClose > seconddaysOpen && thirddaysOpen > seconddaysClose && thirddaysClose > seconddaysClose && thirddaysLow > seconddaysHigh) {
                    gapUp.push(result[index].stockCode);
                } else if (thirddaysOpen > seconddaysOpen && thirddaysClose > seconddaysOpen && thirddaysLow > seconddaysHigh) {
                    gapUp.push(result[index].stockCode);
                }
                var isBullishHammer = thirddaysClose > thirddaysOpen;
                isBullishHammer = isBullishHammer && utility.approximateEqual(thirddaysClose, thirddaysHigh);
                isBullishHammer = isBullishHammer && (thirddaysClose - thirddaysOpen) * 2 <= thirddaysOpen - thirddaysLow;

                var isBullishInvertedHammer = thirddaysClose > thirddaysOpen;
                isBullishInvertedHammer = isBullishInvertedHammer && utility.approximateEqual(thirddaysOpen, thirddaysLow);
                isBullishInvertedHammer = isBullishInvertedHammer && (thirddaysClose - thirddaysOpen) * 2 <= thirddaysHigh - thirddaysClose;

                var isBullishEngulfing = seconddaysClose < seconddaysOpen && seconddaysOpen > thirddaysOpen && seconddaysClose > thirddaysOpen && seconddaysOpen < thirddaysClose;

                var firstdaysMidpoint = (firstdaysOpen + firstdaysClose) / 2;
                var isFirstBearish = firstdaysClose < firstdaysOpen;
                var dojiExists = utility.star(seconddaysOpen, seconddaysClose, seconddaysHigh, seconddaysLow);
                var isSmallBodyExists = firstdaysLow > seconddaysLow && firstdaysLow > seconddaysHigh;
                var isThirdBullish = thirddaysOpen < thirddaysClose;
                var gapExists = isSmallBodyExists && thirddaysOpen > seconddaysHigh && seconddaysClose < thirddaysOpen;
                var doesCloseAboveFirstMidpoint = thirddaysClose > firstdaysMidpoint;

                var twoWSIsUpTrend = thirddaysHigh > seconddaysHigh;
                var twoWSIsAllBullish = seconddaysOpen < seconddaysClose && thirddaysOpen < thirddaysClose;
                var twoWSDoesOpenWithinPreviousBody = seconddaysHigh > thirddaysOpen && thirddaysOpen < seconddaysClose;

                var isUpTrend = seconddaysHigh > firstdaysHigh && thirddaysHigh > seconddaysHigh;
                var isAllBullish = firstdaysOpen < firstdaysClose && seconddaysOpen < seconddaysClose && thirddaysOpen < thirddaysClose;
                var doesOpenWithinPreviousBody = firstdaysClose > seconddaysOpen && seconddaysOpen < firstdaysHigh && seconddaysHigh > thirddaysOpen && thirddaysOpen < seconddaysClose;

                var shaven = thirddaysClose > thirddaysOpen && utility.approximateEqual(thirddaysClose, thirddaysHigh) && utility.approximateEqual(thirddaysOpen, thirddaysLow);

                var lastDayMidPoint = (seconddaysOpen + seconddaysClose) / 2;
                var isPiercing = thirddaysLow < seconddaysLow && seconddaysLow > thirddaysOpen && thirddaysClose > thirddaysOpen && thirddaysClose > lastDayMidPoint;
                if (isBullishHammer) bullishHammer.push(result[index].stockCode);
                if (isBullishInvertedHammer) bullishHammerInverted.push(result[index].stockCode);
                if (isBullishEngulfing) bullishEngulfing.push(result[index].stockCode);
                if (isFirstBearish && (dojiExists || isSmallBodyExists) && gapExists && isThirdBullish && doesCloseAboveFirstMidpoint) eveningStar.push(result[index].stockCode);
                if (twoWSIsUpTrend && twoWSIsAllBullish && twoWSDoesOpenWithinPreviousBody) twoWhiteSoldiers.push(result[index].stockCode);
                if (isUpTrend && isAllBullish && doesOpenWithinPreviousBody) threeWhiteSoldiers.push(result[index].stockCode);
                if (shaven) shavenUp.push(result[index].stockCode);
                if (isPiercing) piercing.push(result[index].stockCode);
            }
            res.render('../src/views/candlestick/bullish.ejs', {
                bullishHammer: bullishHammer,
                bullishHammerInverted: bullishHammerInverted,
                bullishEngulfing: bullishEngulfing,
                eveningStar: eveningStar,
                gapUp: gapUp,
                twoWhiteSoldiers: twoWhiteSoldiers.filter(function (twoWhiteSoldier) {
                    return !threeWhiteSoldiers.includes(twoWhiteSoldier);
                }),
                threeWhiteSoldiers: threeWhiteSoldiers,
                shavenUp: shavenUp,
                piercing: piercing
            });
        });
    }

    _createClass(Bullish, [{
        key: 'downwardTrend',
        value: function downwardTrend(stockData) {
            var end = 4;
            var gains = averagegain({ values: data.close.slice(0, end), period: end - 1 });
            var losses = averageloss({ values: data.close.slice(0, end), period: end - 1 });
            return losses > gains;
        }
    }]);

    return Bullish;
}();

exports.default = Bullish;