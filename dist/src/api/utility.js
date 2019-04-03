"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utility = function () {
    function Utility() {
        _classCallCheck(this, Utility);
    }

    _createClass(Utility, [{
        key: "approximateEqual",
        value: function approximateEqual(a, b) {
            var left = parseFloat(Math.abs(a - b).toPrecision(4)) * 1;
            var right = parseFloat((a * 0.001).toPrecision(4)) * 1;
            return left <= right;
        }
    }, {
        key: "star",
        value: function star(currentOpenPrice, currentClosePrice, currentHighPrice, currentLowPrice) {
            var isOpenEqualsClose = this.approximateEqual(currentOpenPrice, currentClosePrice);
            var isHighEqualsOpen = isOpenEqualsClose && this.approximateEqual(currentOpenPrice, currentHighPrice);
            var isLowEqualsClose = isOpenEqualsClose && this.approximateEqual(currentClosePrice, currentLowPrice);
            return isOpenEqualsClose && isHighEqualsOpen == isLowEqualsClose;
        }
    }]);

    return Utility;
}();

exports.default = Utility;