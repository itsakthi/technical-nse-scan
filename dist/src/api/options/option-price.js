'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _htmlTableToJson = require('html-table-to-json');

var _htmlTableToJson2 = _interopRequireDefault(_htmlTableToJson);

var _optionDataTemplate = require('../../data-templates/option-data-template');

var _optionDataTemplate2 = _interopRequireDefault(_optionDataTemplate);

var _utility = require('../utility');

var _utility2 = _interopRequireDefault(_utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OptionPrice = function OptionPrice(req, res) {
  _classCallCheck(this, OptionPrice);

  var symbol = req.body.optionSymbol;
  var xaxisDate = [];
  var yaxisOptionData = [];
  var utility = new _utility2.default();
  var reqDate = utility.formatDate(req.body.optionpricedate);
  var strikePriceRange = [];

  var options = {
    'host': 'www.nseindia.com',
    'path': '/products/dynaContent/common/productsSymbolMapping.jsp?instrumentType=OPTSTK&symbol=' + symbol + '&expiryDate=27-06-2019&optionType=CE&strikePrice=&dateRange=&fromDate=' + reqDate + '&toDate=' + reqDate + '&segmentLink=9&symbolCount=',
    'method': 'GET',
    'headers': {
      'Accept': '*/*',
      'Referer': 'https://www.nseindia.com/*',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest'
    }
  };
  _https2.default.get(options, function (http_res) {
    var CEDetailsResponse = "";
    http_res.on("data", function (chunk) {
      CEDetailsResponse += chunk;
    });
    http_res.on("end", function () {
      var CEDetailsJson = new _htmlTableToJson2.default(CEDetailsResponse);
      var CEDetails = CEDetailsJson.results[0];
      options.path = '/products/dynaContent/common/productsSymbolMapping.jsp?instrumentType=OPTSTK&symbol=' + symbol + '&expiryDate=27-06-2019&optionType=PE&strikePrice=&dateRange=&fromDate=' + reqDate + '&toDate=' + reqDate + '&segmentLink=9&symbolCount=', _https2.default.get(options, function (http_res) {
        var PEDetailsResponse = "";
        http_res.on("data", function (chunk) {
          PEDetailsResponse += chunk;
        });
        http_res.on("end", function () {
          var PEDetailsJson = new _htmlTableToJson2.default(PEDetailsResponse);
          var PEDetails = PEDetailsJson.results[0];
          var optionDetails = CEDetails.concat(PEDetails);
          var optionDetailsCounter = void 0,
              quoteDBRecord = [],
              strikePriceColl = [],
              strikePriceDiff = void 0;
          for (var i = 0; i < PEDetails.length; i++) {
            strikePriceColl.push(parseFloat(PEDetails[i]['Strike Price'].replace(/,/g, '')));
            strikePriceColl.sort();
          }
          strikePriceDiff = Math.abs(strikePriceColl[0] - strikePriceColl[1]);
          var atTheMoney = Math.floor(optionDetails[0]['Underlying Value'].replace(/,/g, '') / strikePriceDiff) * strikePriceDiff;
          strikePriceRange.push((atTheMoney - 2 * strikePriceDiff).toFixed(2));
          strikePriceRange.push((atTheMoney - 1 * strikePriceDiff).toFixed(2));
          strikePriceRange.push(atTheMoney.toFixed(2));
          strikePriceRange.push((atTheMoney + 1 * strikePriceDiff).toFixed(2));
          strikePriceRange.push((atTheMoney + 2 * strikePriceDiff).toFixed(2));
          strikePriceRange.push((atTheMoney + 3 * strikePriceDiff).toFixed(2));
          var underlyingPrice = parseFloat(optionDetails[0]['Underlying Value'].replace(/,/g, ''));
          console.log(underlyingPrice);
          for (optionDetailsCounter = 0; optionDetailsCounter < optionDetails.length; optionDetailsCounter++) {
            var optionDetail = optionDetails[optionDetailsCounter];
            if (strikePriceRange.includes(optionDetail['Strike Price'].replace(/,/g, ''))) {
              var price = void 0,
                  optionPrice = void 0;
              var StrikePrice = parseFloat(optionDetail['Strike Price'].replace(/,/g, ''));
              var optionType = optionDetail['Optiontype'];
              if (optionDetail['No. of contracts'] == 0) optionPrice = parseFloat(optionDetail['Settle Price']);else optionPrice = parseFloat(optionDetail['Close']);
              var intrinsicValue = underlyingPrice - StrikePrice;
              price = optionPrice;
              if (optionType === 'CE' && intrinsicValue >= 0) price = optionPrice - intrinsicValue;else if (optionType === 'PE' && intrinsicValue <= 0) price = optionPrice + intrinsicValue;
              var expiryDate = new Date(optionDetail['Expiry']);
              var optionDate = new Date(optionDetail['Date']);
              var diffDays = parseInt(expiryDate - optionDate) / (1000 * 60 * 60 * 24);
              xaxisDate.push(optionDetail['Date']);
              yaxisOptionData.push({
                date: optionDetail['Date'],
                price: price,
                optionType: optionType,
                strikePrice: StrikePrice
                // iv: utility.impliedVolatility(optionPrice, underlyingPrice, StrikePrice, (diffDays - 1) / 365, 0.1, optionType === 'CE' ? 'call' : 'put')
              });
            }
          }
          _optionDataTemplate2.default.title.text = symbol;
          _optionDataTemplate2.default.xAxis[0].categories = xaxisDate;
          _optionDataTemplate2.default.series[0].data = yaxisOptionData;
          _optionDataTemplate2.default.series[0].yAxis = underlyingPrice;
          res.setHeader('Content-Type', 'application/json');
          res.send(_optionDataTemplate2.default);
        });
      });
    });
  });
};

exports.default = OptionPrice;