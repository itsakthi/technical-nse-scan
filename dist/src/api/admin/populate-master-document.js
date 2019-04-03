'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _htmlTableToJson = require('html-table-to-json');

var _htmlTableToJson2 = _interopRequireDefault(_htmlTableToJson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PopulateMasterDocument = function PopulateMasterDocument(req, res, stockList, databaseConnection, collectionName) {
	_classCallCheck(this, PopulateMasterDocument);

	var stockListIndex = req.body.quotesfrom || req.body.quotefor;
	console.log('Inside Populate Master Document' + stockListIndex);
	res.send('<p>Inside Populate Master Document</p>');
	var populateMasterDocumentInterval = setInterval(async function () {
		var options = {
			'host': 'www.nseindia.com',
			'path': '/marketinfo/sym_map/symbolCount.jsp?symbol=' + stockList[stockListIndex],
			'method': 'GET',
			'headers': {
				'Accept': '*/*',
				'Referer': 'https://www.nseindia.com/*',
				'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36',
				'X-Requested-With': 'XMLHttpRequest'
			}
		};
		_https2.default.get(options, function (http_res) {
			var symbolCountResponse = "";
			http_res.on("data", function (chunk) {
				symbolCountResponse += chunk;
			});
			http_res.on("end", function () {
				options.path = '/products/dynaContent/common/productsSymbolMapping.jsp?symbol=' + stockList[stockListIndex] + '&segmentLink=3&symbolCount=' + symbolCountResponse.trim() + '&series=EQ&dateRange=3month&fromDate=&toDate=&dataType=PRICEVOLUMEDELIVERABLE';
				_https2.default.get(options, function (http_res) {
					var quoteDetailsResponse = "";
					http_res.on("data", function (chunk) {
						quoteDetailsResponse += chunk;
					});
					http_res.on("end", function () {
						var quoteDetailsJson = new _htmlTableToJson2.default(quoteDetailsResponse);
						var quoteDetails = quoteDetailsJson.results[0];
						var quoteDetailsCounter = void 0,
						    quoteDBRecord = [];
						for (quoteDetailsCounter = 0; quoteDetailsCounter < quoteDetails.length; quoteDetailsCounter++) {
							var quote = {
								quoteDate: '',
								quoteOpenPrice: 0,
								quoteClosePrice: 0,
								quoteHighPrice: 0,
								quoteLowPrice: 0,
								quoteVolume: 0,
								quoteDeliveryPercentage: 0,
								quoteEQ: false
							};
							var quoteDetail = quoteDetails[quoteDetailsCounter];
							if (quoteDetail["Series"] === 'EQ') {
								quote.quoteDate = quoteDetail['Date'];
								quote.quoteOpenPrice = quoteDetail['Open Price'];
								quote.quoteClosePrice = quoteDetail['Close Price'];
								quote.quoteHighPrice = quoteDetail['High Price'];
								quote.quoteLowPrice = quoteDetail['Low Price'];
								quote.quoteVolume = quoteDetail['Total Traded Quantity'];
								quote.quoteDeliveryPercentage = quoteDetail['% Dly Qt toTraded Qty'];
								quote.quoteEQ = true;
								quoteDBRecord.push(quote);
							}
						}
						var dbInput = {
							key: stockListIndex,
							stockCode: stockList[stockListIndex],
							quoteDBRecord: quoteDBRecord
						};
						databaseConnection.collection(collectionName).insertOne(dbInput, function (error, result) {
							if (error) return console.log('error connecting collection' + error);
							console.log(stockList[stockListIndex] + ' - ' + stockListIndex);
							stockListIndex++;
							(stockListIndex === stockList.length || req.body.quotefor) && clearInterval(populateMasterDocumentInterval);
						});
					});
				});
			});
		});
	}, 10000);
};

exports.default = PopulateMasterDocument;