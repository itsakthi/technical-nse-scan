'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utility = require('../utility');

var _utility2 = _interopRequireDefault(_utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Star = function () {
    function Star(databaseConnection, collectionName, req, res) {
        var _this = this;

        _classCallCheck(this, Star);

        var star = [];
        var utility = new _utility2.default();
        var reqDate = utility.formatDate(req.body.candlestickdate);
        var range = req.body.candlestickrange;
        databaseConnection.collection(collectionName).find().toArray(function (error, result) {
            if (error) return console.log(error);
            for (var index = 0; index < result.length - 1; index++) {
                var reqDateIndex = 0,
                    currentOpenPrice = 0,
                    currentClosePrice = 0,
                    currentHighPrice = 0,
                    currentLowPrice = 0;
                if (range === 'daily') {
                    reqDateIndex = result[index].quoteDBRecord.findIndex(function (dbRecord) {
                        return dbRecord.quoteDate == reqDate;
                    });
                    currentOpenPrice = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteOpenPrice.replace(/,/g, ''));
                    currentClosePrice = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteClosePrice.replace(/,/g, ''));
                    currentHighPrice = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteHighPrice.replace(/,/g, ''));
                    currentLowPrice = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, ''));
                } else if (range === 'weekly') {
                    (function () {
                        var tempHigh = 0,
                            tempLow = 0,
                            currentDate = reqDate;
                        for (var dayCount = 1; dayCount < 6; dayCount++) {
                            reqDateIndex = result[index].quoteDBRecord.findIndex(function (dbRecord) {
                                return dbRecord.quoteDate == currentDate;
                            });
                            if (reqDateIndex > 0) {
                                if (!currentClosePrice) {
                                    currentClosePrice = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteClosePrice.replace(/,/g, ''));
                                }
                                tempHigh = tempHigh > parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteHighPrice.replace(/,/g, '')) ? tempHigh : parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteHighPrice.replace(/,/g, ''));
                                currentHighPrice = tempHigh;
                                currentLowPrice = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, '')) < tempLow ? parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, '')) : tempLow;
                                tempLow = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, ''));
                                currentOpenPrice = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteOpenPrice.replace(/,/g, ''));
                            }
                            currentDate = _this.decrementDate(currentDate, 1);
                        }
                    })();
                }
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
    }

    _createClass(Star, [{
        key: 'decrementDate',
        value: function decrementDate(currentDate, decrementBy) {
            var utility = new _utility2.default();
            var formattedCurrentDate = new Date(currentDate);
            formattedCurrentDate.setDate(formattedCurrentDate.getDate() - decrementBy);
            var validDate = formattedCurrentDate.getFullYear() + '-';
            validDate = validDate + (formattedCurrentDate.getMonth() < 10 ? '0' + (formattedCurrentDate.getMonth() + 1) : _formattedCurrentDate.getMonth() + 1);
            validDate = validDate + '-' + (formattedCurrentDate.getDate() < 10 ? '0' + formattedCurrentDate.getDate() : formattedCurrentDate.getDate());
            return utility.formatDate(validDate);
        }
    }]);

    return Star;
}();

exports.default = Star;