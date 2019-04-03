'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SmaCrossOverList = function SmaCrossOverList(databaseConnection, collectionName, req, res) {
    _classCallCheck(this, SmaCrossOverList);

    var movingAverage1 = req.body.first_moving_average;
    var movingAverage2 = req.body.second_moving_average;
    var prevSMA = void 0,
        currentSMA = void 0,
        stockListCode = [];

    databaseConnection.collection(collectionName).find().toArray(function (error, result) {
        if (error) return console.log(error);
        for (var index = 0; index < result.length - 1; index++) {
            var currentSMA1 = result[index].currentSMA[movingAverage1 - 1];
            var prevSMA1 = result[index].prevSMA[movingAverage1 - 1];
            var currentSMA2 = result[index].currentSMA[movingAverage2 - 1];
            var prevSMA2 = result[index].prevSMA[movingAverage2 - 1];

            currentSMA1 - currentSMA2 < 0 ? prevSMA = false : prevSMA = true;
            prevSMA1 - prevSMA2 < 0 ? currentSMA = false : currentSMA = true;
            if (prevSMA ? !currentSMA : currentSMA) {
                stockListCode.push(result[index].stockCode);
            }
        }
        res.render('../src/views/sma-cross-over-list.ejs', { stockListCode: stockListCode });
    });
};

exports.default = SmaCrossOverList;