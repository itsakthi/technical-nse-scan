'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _blackScholes = require('black-scholes');

var _blackScholes2 = _interopRequireDefault(_blackScholes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utility = function () {
    function Utility() {
        _classCallCheck(this, Utility);
    }

    _createClass(Utility, [{
        key: 'approximateEqual',
        value: function approximateEqual(a, b) {
            var left = parseFloat(Math.abs(a - b).toPrecision(4)) * 1;
            var right = parseFloat((a * 0.0015).toPrecision(4)) * 1;
            return left <= right;
        }
    }, {
        key: 'getImpliedVolatility',
        value: function getImpliedVolatility(expectedCost, s, k, t, r, callPut, estimate) {
            estimate = estimate || .1;
            var low = 0;
            var high = Infinity;
            console.log(expectedCost + '-' + s + '-' + k + '-' + t + '-' + r + '-' + callPutestimate);
            for (var i = 0; i < 100; i++) {
                var actualCost = _blackScholes2.default.blackScholes(s, k, t, estimate, r, callPut);
                if (expectedCost * 100 == Math.floor(actualCost * 100)) {
                    break;
                } else if (actualCost > expectedCost) {
                    high = estimate;
                    estimate = (estimate - low) / 2 + low;
                } else {
                    low = estimate;
                    estimate = (high - estimate) / 2 + estimate;
                    if (!isFinite(estimate)) estimate = low * 2;
                }
            }
            return estimate * 100;
        }
    }, {
        key: 'impliedVolatility',
        value: function impliedVolatility(optionPrice, underlyingPrice, strikePrice, timeIntervl, callPut) {
            //console.log(this.getImpliedVolatility(50.3, 956.9, 920, .041, .1, "call"))
            return this.getImpliedVolatility(optionPrice, underlyingPrice, strikePrice, timeIntervl, callPut);
        }
    }, {
        key: 'star',
        value: function star(currentOpenPrice, currentClosePrice, currentHighPrice, currentLowPrice) {
            var isOpenEqualsClose = this.approximateEqual(currentOpenPrice, currentClosePrice);
            var isHighEqualsOpen = isOpenEqualsClose && this.approximateEqual(currentOpenPrice, currentHighPrice);
            var isLowEqualsClose = isOpenEqualsClose && this.approximateEqual(currentClosePrice, currentLowPrice);
            return isOpenEqualsClose && isHighEqualsOpen == isLowEqualsClose;
        }
    }, {
        key: 'formatDate',
        value: function formatDate(date) {
            var validDate = date.split('-')[2] + '-';
            switch (date.split('-')[1]) {
                case '01':
                    validDate = validDate + 'Jan';
                    break;
                case '02':
                    validDate = validDate + 'Feb';
                    break;
                case '03':
                    validDate = validDate + 'Mar';
                    break;
                case '04':
                    validDate = validDate + 'Apr';
                    break;
                case '05':
                    validDate = validDate + 'May';
                    break;
                case '06':
                    validDate = validDate + 'Jun';
                    break;
                case '07':
                    validDate = validDate + 'Jul';
                    break;
                case '08':
                    validDate = validDate + 'Aug';
                    break;
                case '09':
                    validDate = validDate + 'Sep';
                    break;
                case '10':
                    validDate = validDate + 'Oct';
                    break;
                case '11':
                    validDate = validDate + 'Nov';
                    break;
                case '12':
                    validDate = validDate + 'Dec';
                    break;
            }
            return validDate + '-' + date.split('-')[0];
        }
    }]);

    return Utility;
}();

exports.default = Utility;