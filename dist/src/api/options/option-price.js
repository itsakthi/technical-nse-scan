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
  var optionData = [],
      optionDataColl = [];
  var utility = new _utility2.default();
  var reqDate = utility.formatDate(req.body.optionpricedate);
  var strikePriceRange = [];
  var index = 0;
  var optionPriceInterval = setInterval(async function () {
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
        console.log(reqDate);
        if (CEDetails.length <= 3) {
          reqDate = utility.decrementDate(reqDate, 1);
          index--;
        } else {
          options.path = '/products/dynaContent/common/productsSymbolMapping.jsp?instrumentType=OPTSTK&symbol=' + symbol + '&expiryDate=27-06-2019&optionType=PE&strikePrice=&dateRange=&fromDate=' + reqDate + '&toDate=' + reqDate + '&segmentLink=9&symbolCount=', _https2.default.get(options, function (http_res) {
            var PEDetailsResponse = "";
            http_res.on("data", function (chunk) {
              PEDetailsResponse += chunk;
            });
            http_res.on("end", function () {
              var PEDetailsJson = new _htmlTableToJson2.default(PEDetailsResponse);
              var PEDetails = PEDetailsJson.results[0];
              strikePriceRange = [];
              var optionDetails = CEDetails.concat(PEDetails);
              var optionDetailsCounter = void 0,
                  quoteDBRecord = [],
                  strikePriceColl = [],
                  strikePriceDiff = void 0,
                  callOpenInterestChange = 0,
                  callOpenInterest = 0,
                  putOpenInterestChange = 0,
                  putOpenInterest = 0;
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
              var optionDataDate = void 0;
              optionData = [];
              for (optionDetailsCounter = 0; optionDetailsCounter < optionDetails.length; optionDetailsCounter++) {
                var optionDetail = optionDetails[optionDetailsCounter];
                if (optionDetail['Optiontype'] == 'CE') {
                  callOpenInterestChange += parseFloat(optionDetail['Change in OI'].replace(/,/g, ''));
                  callOpenInterest += parseFloat(optionDetail['Open Int'].replace(/,/g, ''));
                } else if (optionDetail['Optiontype'] == 'PE') {
                  putOpenInterestChange += parseFloat(optionDetail['Change in OI'].replace(/,/g, ''));
                  putOpenInterest += parseFloat(optionDetail['Open Int'].replace(/,/g, ''));
                }
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
                  optionDataDate = optionDetail['Date'];
                  optionData.push({
                    price: price,
                    optionType: optionType,
                    strikePrice: StrikePrice
                    // iv: utility.impliedVolatility(optionPrice, underlyingPrice, StrikePrice, (diffDays - 1) / 365, 0.1, optionType === 'CE' ? 'call' : 'put')
                  });
                }
              }
              optionDataColl.push({
                underlyingPrice: underlyingPrice,
                date: optionDataDate,
                callOpenInterestChangePer: callOpenInterestChange / (callOpenInterest - callOpenInterestChange) * 100,
                putOpenInterestChangePer: putOpenInterestChange / (putOpenInterest - putOpenInterestChange) * 100,
                optionData: optionData
              });
            });
          });
          reqDate = utility.decrementDate(reqDate, 1);
        }
      });
      index++;
      if (index === 4) {
        clearInterval(optionPriceInterval);
        res.render('../src/views/option-data.ejs', {
          optionDataColl: optionDataColl
        });
      }
    });
  }, 5000);
  /*optionDataTemp.series[0].data = yaxisOptionData
  optionDataTemp.series[0].underlyingPrice = underlyingPrice
  optionDataTemp.series[0].callOpenInterestChangePer = (callOpenInterestChange / (callOpenInterest - callOpenInterestChange)) * 100
  optionDataTemp.series[0].putOpenInterestChangePer = (putOpenInterestChange / (putOpenInterest - putOpenInterestChange)) * 100
  console.log(utility.decrementDate(reqDate, 2))
  console.log(utility.decrementDate(reqDate, 3))
  res.setHeader('Content-Type', 'application/json')
  res.send(optionDataTemp)				*/
};

exports.default = OptionPrice;