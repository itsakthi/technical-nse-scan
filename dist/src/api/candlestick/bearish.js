'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utility = require('../utility');

var _utility2 = _interopRequireDefault(_utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bearish = function Bearish(databaseConnection, collectionName, req, res) {
    _classCallCheck(this, Bearish);

    var gapDown = [],
        bearishHammer = [],
        bearishHammerInverted = [],
        bearishEngulfing = [],
        morningStar = [],
        twoBlackCrows = [],
        threeBlackCrows = [],
        shavenDown = [],
        darkCloud = [];
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
            if (seconddaysClose > seconddaysOpen && thirddaysOpen < seconddaysOpen && thirddaysClose < seconddaysOpen && thirddaysHigh < seconddaysLow) {
                gapDown.push(result[index].stockCode);
            } else if (thirddaysOpen < seconddaysClose && thirddaysClose < seconddaysClose && thirddaysHigh < seconddaysLow) {
                gapDown.push(result[index].stockCode);
            }

            var isBearishHammer = thirddaysOpen > thirddaysClose;
            isBearishHammer = isBearishHammer && utility.approximateEqual(thirddaysOpen, thirddaysHigh);
            isBearishHammer = isBearishHammer && (thirddaysOpen - thirddaysClose) * 2 <= thirddaysClose - thirddaysLow;

            var isBearishInvertedHammer = thirddaysOpen > thirddaysClose;
            isBearishInvertedHammer = isBearishInvertedHammer && utility.approximateEqual(thirddaysClose, thirddaysLow);
            isBearishInvertedHammer = isBearishInvertedHammer && (thirddaysOpen - thirddaysClose) * 2 <= thirddaysHigh - thirddaysOpen;

            var isBearishEngulfing = seconddaysClose > seconddaysOpen && seconddaysOpen < thirddaysOpen && seconddaysClose < thirddaysOpen && seconddaysOpen > thirddaysClose;

            var firstdaysMidpoint = (firstdaysOpen + firstdaysClose) / 2;
            var isFirstBullish = firstdaysClose > firstdaysOpen;
            var dojiExists = utility.star(seconddaysOpen, seconddaysClose, seconddaysHigh, seconddaysLow);
            var isSmallBodyExists = firstdaysHigh < seconddaysLow && firstdaysHigh < seconddaysHigh;
            var isThirdBearish = thirddaysOpen > thirddaysClose;
            var gapExists = isSmallBodyExists && thirddaysOpen < seconddaysLow && seconddaysClose > thirddaysOpen;
            var doesCloseBelowFirstMidpoint = thirddaysClose < firstdaysMidpoint;

            var twoCrowIsDownTrend = seconddaysLow > thirddaysLow;
            var twoCrowIsAllBearish = seconddaysOpen > seconddaysClose && thirddaysOpen > thirddaysClose;
            var twoCrowDoesOpenWithinPreviousBody = seconddaysOpen > thirddaysOpen && thirddaysOpen > seconddaysClose;

            var isDownTrend = firstdaysLow > seconddaysLow && seconddaysLow > thirddaysLow;
            var isAllBearish = firstdaysOpen > firstdaysClose && seconddaysOpen > seconddaysClose && thirddaysOpen > thirddaysClose;
            var doesOpenWithinPreviousBody = firstdaysOpen > seconddaysOpen && seconddaysOpen > firstdaysClose && seconddaysOpen > thirddaysOpen && thirddaysOpen > seconddaysClose;

            var shaven = thirddaysClose < thirddaysOpen && utility.approximateEqual(thirddaysClose, thirddaysLow) && utility.approximateEqual(thirddaysOpen, thirddaysHigh);

            var lastDayMidPoint = (seconddaysOpen + seconddaysClose) / 2;
            var isDarkCloud = thirddaysOpen > seconddaysHigh && thirddaysClose > seconddaysOpen && thirddaysClose < seconddaysClose && thirddaysClose < thirddaysOpen && thirddaysClose > lastDayMidPoint;
            if (isBearishHammer) bearishHammer.push(result[index].stockCode);
            if (isBearishInvertedHammer) bearishHammerInverted.push(result[index].stockCode);
            if (isBearishEngulfing) bearishEngulfing.push(result[index].stockCode);
            if (isFirstBullish && (dojiExists || isSmallBodyExists) && gapExists && isThirdBearish && doesCloseBelowFirstMidpoint) morningStar.push(result[index].stockCode);
            if (twoCrowIsDownTrend && twoCrowIsAllBearish && twoCrowDoesOpenWithinPreviousBody) twoBlackCrows.push(result[index].stockCode);
            if (isDownTrend && isAllBearish && doesOpenWithinPreviousBody) threeBlackCrows.push(result[index].stockCode);
            if (shaven) shavenDown.push(result[index].stockCode);
            if (isDarkCloud) darkCloud.push(result[index].stockCode);
        }
        res.render('../src/views/candlestick/bearish.ejs', {
            bearishHammer: bearishHammer,
            bearishHammerInverted: bearishHammerInverted,
            bearishEngulfing: bearishEngulfing,
            gapDown: gapDown,
            morningStar: morningStar,
            twoBlackCrows: twoBlackCrows.filter(function (twoBlackCrow) {
                return !threeBlackCrows.includes(twoBlackCrow);
            }),
            threeBlackCrows: threeBlackCrows,
            shavenDown: shavenDown,
            darkCloud: darkCloud
        });
    });
};

exports.default = Bearish;