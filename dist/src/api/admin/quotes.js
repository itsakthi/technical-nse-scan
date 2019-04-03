'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Quotes = function Quotes(alphaVantageInterface, databaseConnection, collectionName, interval, req, res, stockList, stockListIndex) {
    _classCallCheck(this, Quotes);

    stockListIndex = req.body.quotesfrom || req.body.quotefor;
    console.log('Inside SMA' + stockListIndex);
    res.send('<p>inside sma</p>');
    var closingPriceOperation = setInterval(async function () {
        var currentSMA = [],
            prevSMA = [],
            stockPrices = [],
            volume = [],
            priceIndex = void 0,
            averageIndex = void 0,
            priceTotal = void 0,
            dbInput = void 0;
        var smaQueryParam = {
            amount: 51,
            interval: interval,
            symbol: 'NSE:' + stockList[stockListIndex]
        };
        var result = await alphaVantageInterface.timeSeries(smaQueryParam);
        for (priceIndex = 0; priceIndex < smaQueryParam.amount - 1; priceIndex++) {
            priceTotal = result[0].close;
            for (averageIndex = priceIndex; averageIndex > 0; averageIndex--) {
                priceTotal += result[averageIndex].close;
            }
            currentSMA.push(priceTotal / (priceIndex + 1));
            volume.push(result[priceIndex].volume);
        }
        for (priceIndex = 1; priceIndex < smaQueryParam.amount - 1; priceIndex++) {
            priceTotal = result[1].close;
            for (averageIndex = priceIndex; averageIndex > 1; averageIndex--) {
                priceTotal += result[averageIndex].close;
            }
            prevSMA.push(priceTotal / priceIndex);
        }
        for (var counter = 0; counter < 5; counter++) {
            var stockPrice = {
                open: result[counter].open,
                high: result[counter].high,
                low: result[counter].low,
                close: result[counter].close
            };
            stockPrices.push(stockPrice);
        }
        dbInput = {
            index: stockListIndex,
            stockCode: stockList[stockListIndex],
            stockPrices: stockPrices,
            currentSMA: currentSMA,
            prevSMA: prevSMA,
            volume: volume
        };
        databaseConnection.collection(collectionName).insertOne(dbInput, function (error, result) {
            if (error) return console.log('error connecting collection');
            console.log(stockList[stockListIndex] + ' - ' + stockListIndex);
            stockListIndex++;
            (stockListIndex === stockList.length || req.body.quotefor) && clearInterval(closingPriceOperation);
        });
    }, 12000);
};

exports.default = Quotes;