'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DeliveryPercentage = function DeliveryPercentage(databaseConnection, collectionName, req, res, stockList) {
    _classCallCheck(this, DeliveryPercentage);

    var date = req.body.date;
    console.log('Inside Update Delivery Percentage Document');
    var options = {
        'host': 'www.nseindia.com',
        'path': '/archives/equities/mto/MTO_' + date + '2019.DAT'
    };
    _https2.default.get(options, function (http_res) {
        var data = "";
        http_res.on("data", function (chunk) {
            data += chunk;
        });
        http_res.on("end", function () {
            var lines = data.split("\n");
            var result = [],
                headers = [],
                counter = void 0,
                innerCounter = void 0;
            headers = lines[3].split(",");

            var _loop = function _loop() {
                var currentline = lines[counter].split(",");
                var pushToDocument = void 0;
                if (currentline[3] === "EQ") {
                    pushToDocument = { deliveryPercentage: currentline[6], totalTradedQuantity: currentline[4] };
                } else if (currentline[3] === "BL") {
                    console.log(currentline[2] + 'check bulk deal');
                } else {
                    console.log(currentline[2] + 'check other series types');
                }
                stockList.find(function (item) {
                    if (item === currentline[2]) {
                        databaseConnection.collection(collectionName).updateOne({ stockCode: item }, { $push: pushToDocument }, function (err, res) {
                            if (err) {
                                console.log(item);throw err;
                            }
                        });
                    }
                });
            };

            for (counter = 4; counter < lines.length; counter++) {
                _loop();
            }
            res.send('<p>Updated Delivery Percentage Document</p>');
            console.log('Updated Delivery Percentage Document');
        });
    });
};

exports.default = DeliveryPercentage;