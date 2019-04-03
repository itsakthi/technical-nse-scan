'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AboveSMA = function AboveSMA(databaseConnection, collectionName, req, res) {
    _classCallCheck(this, AboveSMA);

    var movingAverage = req.body.moving_average;
    var prevSMA = void 0,
        currentSMA = void 0,
        onDirectionStockList = [],
        onReverseStockList = [],
        twoDaysOnStockList = [];
    databaseConnection.collection(collectionName).find().toArray(function (error, result) {
        if (error) return console.log(error);
        for (var index = 0; index < result.length - 1; index++) {
            var _currentSMA = result[index].currentSMA[movingAverage - 1];
            var _prevSMA = result[index].prevSMA[movingAverage - 1];
            var currentOpenPrice = result[index].stockPrices[0].open;
            var currentHighPrice = result[index].stockPrices[0].high;
            var currentLowPrice = result[index].stockPrices[0].low;
            var currentClosePrice = result[index].stockPrices[0].close;
            var prevOpenPrice = result[index].stockPrices[1].open;
            var prevHighPrice = result[index].stockPrices[1].high;
            var prevLowPrice = result[index].stockPrices[1].low;
            var prevClosePrice = result[index].stockPrices[1].close;

            if (currentOpenPrice > _currentSMA && currentHighPrice > _currentSMA && currentLowPrice > _currentSMA && currentClosePrice > _currentSMA) {
                if (prevOpenPrice > _prevSMA && prevHighPrice > _prevSMA && prevLowPrice > _prevSMA && prevClosePrice > _prevSMA) {
                    twoDaysOnStockList.push(result[index].stockCode);
                } else {
                    if (currentClosePrice > currentOpenPrice) {
                        onDirectionStockList.push(result[index].stockCode);
                    } else if (currentClosePrice < currentOpenPrice) {
                        onReverseStockList.push(result[index].stockCode);
                    }
                }
            } else if (currentOpenPrice < _currentSMA && currentHighPrice < _currentSMA && currentLowPrice < _currentSMA && currentClosePrice < _currentSMA) {
                if (prevOpenPrice < _prevSMA && prevHighPrice < _prevSMA && prevLowPrice < _prevSMA && prevClosePrice < _prevSMA) {
                    twoDaysOnStockList.push(result[index].stockCode);
                } else {
                    if (currentClosePrice > currentOpenPrice) {
                        onReverseStockList.push(result[index].stockCode);
                    } else if (currentClosePrice < currentOpenPrice) {
                        onDirectionStockList.push(result[index].stockCode);
                    }
                }
            }
        }
        res.render('../src/views/above-sma.ejs', {
            onDirectionStockList: onDirectionStockList,
            onReverseStockList: onReverseStockList,
            twoDaysOnStockList: twoDaysOnStockList
        });
    });
};

exports.default = AboveSMA;