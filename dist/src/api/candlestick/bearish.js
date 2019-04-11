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
        threeBlackCrows = [];
    var utility = new _utility2.default();
    var reqDate = utility.formatDate(req.body.candlestickdate);
    databaseConnection.collection(collectionName).find().toArray(function (error, result) {
        if (error) return console.log(error);
        for (var index = 0; index < result.length - 1; index++) {
            var reqDateIndex = result[index].quoteDBRecord.findIndex(function (dbRecord) {
                return dbRecord.quoteDate == reqDate;
            });
            var firstdaysOpen = parseFloat(result[index].quoteDBRecord[reqDateIndex - 2].quoteOpenPrice.replace(/,/g, ''));
            var firstdaysClose = parseFloat(result[index].quoteDBRecord[reqDateIndex - 2].quoteClosePrice.replace(/,/g, ''));
            var firstdaysHigh = parseFloat(result[index].quoteDBRecord[reqDateIndex - 2].quoteHighPrice.replace(/,/g, ''));
            var firstdaysLow = parseFloat(result[index].quoteDBRecord[reqDateIndex - 2].quoteLowPrice.replace(/,/g, ''));
            var seconddaysOpen = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteOpenPrice.replace(/,/g, ''));
            var seconddaysClose = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteClosePrice.replace(/,/g, ''));
            var seconddaysHigh = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteHighPrice.replace(/,/g, ''));
            var seconddaysLow = parseFloat(result[index].quoteDBRecord[reqDateIndex - 1].quoteLowPrice.replace(/,/g, ''));
            var thirddaysOpen = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteOpenPrice.replace(/,/g, ''));
            var thirddaysClose = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteClosePrice.replace(/,/g, ''));
            var thirddaysHigh = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteHighPrice.replace(/,/g, ''));
            var thirddaysLow = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, ''));

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

            var isDownTrend = firstdaysLow > seconddaysLow && seconddaysLow > thirddaysLow;
            var isAllBearish = firstdaysOpen > firstdaysClose && seconddaysOpen > seconddaysClose && thirddaysOpen > thirddaysClose;
            var doesOpenWithinPreviousBody = firstdaysOpen > seconddaysOpen && seconddaysOpen > firstdaysClose && seconddaysOpen > thirddaysOpen && thirddaysOpen > seconddaysClose;

            if (isBearishHammer) {
                bearishHammer.push(result[index].stockCode);
            }
            if (isBearishInvertedHammer) {
                bearishHammerInverted.push(result[index].stockCode);
            }
            if (isBearishEngulfing) {
                bearishEngulfing.push(result[index].stockCode);
            }
            if (isFirstBullish && (dojiExists || isSmallBodyExists) && gapExists && isThirdBearish && doesCloseBelowFirstMidpoint) {
                morningStar.push(result[index].stockCode);
            }
            if (isDownTrend && isAllBearish && doesOpenWithinPreviousBody) {
                threeBlackCrows.push(result[index].stockCode);
            }
        }
        res.render('../src/views/candlestick/bearish.ejs', {
            bearishHammer: bearishHammer,
            bearishHammerInverted: bearishHammerInverted,
            bearishEngulfing: bearishEngulfing,
            gapDown: gapDown,
            morningStar: morningStar,
            threeBlackCrows: threeBlackCrows
        });
    });
};

exports.default = Bearish;