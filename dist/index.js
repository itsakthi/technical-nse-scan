'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _csvParse = require('csv-parse');

var _csvParse2 = _interopRequireDefault(_csvParse);

var _populateMasterDocument = require('./src/api/admin/populate-master-document');

var _populateMasterDocument2 = _interopRequireDefault(_populateMasterDocument);

var _bullish = require('./src/api/candlestick/bullish');

var _bullish2 = _interopRequireDefault(_bullish);

var _bearish = require('./src/api/candlestick/bearish');

var _bearish2 = _interopRequireDefault(_bearish);

var _star = require('./src/api/candlestick/star');

var _star2 = _interopRequireDefault(_star);

var _nr = require('./src/api/nr');

var _nr2 = _interopRequireDefault(_nr);

var _aboveDeliveryVolume = require('./src/api/dv/above-delivery-volume');

var _aboveDeliveryVolume2 = _interopRequireDefault(_aboveDeliveryVolume);

var _abovePreviousDv = require('./src/api/dv/above-previous-dv');

var _abovePreviousDv2 = _interopRequireDefault(_abovePreviousDv);

var _commonHighDv = require('./src/api/dv/common-high-dv');

var _commonHighDv2 = _interopRequireDefault(_commonHighDv);

var _aboveVolume = require('./src/api/above-volume');

var _aboveVolume2 = _interopRequireDefault(_aboveVolume);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.use((0, _cors2.default)());
app.use(_express2.default.static('public'));
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

var stockList = ['ACC', 'ADANIENT', 'ADANIPORTS', 'ADANIPOWER', 'AJANTPHARM', 'ALBK', 'AMARAJABAT', 'AMBUJACEM', 'ANDHRABANK', 'APOLLOHOSP', 'APOLLOTYRE', 'ARVIND', 'ASHOKLEY', 'ASIANPAINT', 'AUROPHARMA', 'AXISBANK', 'BALKRISIND', 'BALRAMCHIN', 'BANKBARODA', 'BANKINDIA', 'BATAINDIA', 'BEML', 'BERGEPAINT', 'BEL', 'BHARATFIN', 'BHARATFORG', 'BPCL', 'BHARTIARTL', 'INFRATEL', 'BHEL', 'BIOCON', 'CADILAHC', 'CANFINHOME', 'CANBK', 'CASTROLIND', 'CESC', 'CGPOWER', 'CHENNPETRO', 'CIPLA', 'COALINDIA', 'CONCOR', 'CUMMINSIND', 'DABUR', 'DCBBANK', 'DHFL', 'DISHTV', 'DIVISLAB', 'DLF', 'ENGINERSIN', 'EQUITAS', 'ESCORTS', 'EXIDEIND', 'FEDERALBNK', 'GAIL', 'GLENMARK', 'GMRINFRA', 'GODREJCP', 'GODREJIND', 'GRANULES', 'GRASIM', 'GSFC', 'HAVELLS', 'HCLTECH', 'HEXAWARE', 'HINDALCO', 'HCC', 'HINDPETRO', 'HINDUNILVR', 'HINDZINC', 'ICICIBANK', 'ICICIPRULI', 'IDBI', 'IDEA', 'IDFCFIRSTB', 'IDFC', 'IFCI', 'IBULHSGFIN', 'INDIANB', 'IOC', 'IGL', 'INFIBEAM', 'INFY', 'INDIGO', 'IRB', 'ITC', 'JISLJALEQS', 'JPASSOCIAT', 'JETAIRWAYS', 'JINDALSTEL', 'JSWSTEEL', 'JUBLFOOD', 'JUSTDIAL', 'KAJARIACER', 'KTKBANK', 'KSCL', 'LT', 'LICHSGFIN', 'LUPIN', 'MGL', 'MANAPPURAM', 'MRPL', 'MARICO', 'MFSL', 'MINDTREE', 'MOTHERSUMI', 'MUTHOOTFIN', 'NATIONALUM', 'NBCC', 'NCC', 'NHPC', 'NIITTECH', 'NMDC', 'NTPC', 'ONGC', 'OIL', 'ORIENTBANK', 'PCJEWELLER', 'PETRONET', 'PIDILITIND', 'PFC', 'POWERGRID', 'PTC', 'PNB', 'PVR', 'RAYMOND', 'RBLBANK', 'RELCAPITAL', 'RCOM', 'RELIANCE', 'RELINFRA', 'RPOWER', 'REPCOHOME', 'RECLTD', 'SRTRANSFIN', 'SIEMENS', 'SREINFRA', 'SBIN', 'SAIL', 'STAR', 'SUNPHARMA', 'SUNTV', 'SUZLON', 'SYNDIBANK', 'TATACHEM', 'TATACOMM', 'TCS', 'TATAELXSI', 'TATAGLOBAL', 'TATAMTRDVR', 'TATAMOTORS', 'TATAPOWER', 'TATASTEEL', 'TECHM', 'INDIACEM', 'RAMCOCEM', 'SOUTHBANK', 'TITAN', 'TORNTPHARM', 'TORNTPOWER', 'TV18BRDCST', 'TVSMOTOR', 'UJJIVAN', 'UNIONBANK', 'UBL', 'UPL', 'VEDL', 'VGUARD', 'VOLTAS', 'WIPRO', 'WOCKPHARMA', 'YESBANK', 'ZEEL'];

var MONGODB_URL = 'mongodb://admin:admin000@ds123625.mlab.com:23625/stock-details-v1';
var MongoClient = _mongodb2.default.MongoClient;
var databaseConnection = void 0;
MongoClient.connect(MONGODB_URL, function (error, database) {
  if (error) return console.log('error connecting DB');
  databaseConnection = database.db('stock-details-v1');
});

app.get('/', function (req, res, next) {
  res.sendFile(__dirname + '/index.html');
});
app.post('/admin/updatedvdocument', function (req, res, next) {
  new UpdateDVDocument(databaseConnection, 'delivery-percentage', req, res, stockList);
});
// One Time Use
app.post('/admin/populatemasterdocument', function (req, res, next) {
  new _populateMasterDocument2.default(req, res, stockList, databaseConnection, 'quote-details');
});

app.post('/dv/abovedeliverypercent', function (req, res, next) {
  new _aboveDeliveryVolume2.default(databaseConnection, 'quote-details', req, res);
});
app.post('/dv/abovepreviousdv', function (req, res, next) {
  new _abovePreviousDv2.default(databaseConnection, 'quote-details', req, res);
});
app.post('/dv/commonhighdv', function (req, res, next) {
  new _commonHighDv2.default(databaseConnection, 'quote-details', req, res);
});

app.post('/candlestick', function (req, res, next) {
  console.log('Inside candlestick-' + req.body.candlestickdate);
  if (req.body.candlestick === 'bullish') {
    new _bullish2.default(databaseConnection, 'quote-details', req, res);
  } else if (req.body.candlestick === 'bearish') {
    new _bearish2.default(databaseConnection, 'quote-details', req, res);
  } else if (req.body.candlestick === 'star') {
    new _star2.default(databaseConnection, 'quote-details', req, res);
  }
});

app.get('/stock', function (req, res) {
  console.log('started');
  var symbol = void 0;
  var xaxisDate = [];
  var yaxisLTP = [];
  var yaxisOI = [];
  var yaxisStockPrice = [];
  var highChartTemplateData = void 0;
  var parser = (0, _csvParse2.default)({ delimiter: ',' }, function (err, stockDataList) {
    symbol = stockDataList[1][0];
    stockDataList.forEach(function (stockData) {
      console.log(stockData[4]);
      xaxisDate.push(stockData[1]);
      yaxisLTP.push(parseFloat(stockData[10]));
      yaxisOI.push(parseFloat(stockData[14]));
      yaxisStockPrice.push(parseFloat(stockData[16]));
    });
    /* highChartTemplateData.title.text = symbol + '-' + strikePrice
    highChartTemplateData.xAxis[0].categories = xaxisDate
    highChartTemplateData.series[0].data = yaxisLTP
    highChartTemplateData.series[1].data = yaxisOI
    highChartTemplateData.series[2].data = yaxisStockPrice */
    highChartTemplateData = yaxisStockPrice + xaxisDate;
    res.setHeader('Content-Type', 'application/json');
    res.send(highChartTemplateData);
  });
  _fs2.default.createReadStream('OPTSTK_APOLLOHOSP_CE_26-Apr-2019_TO_07-Jun-2019.csv').pipe(parser);
});

app.post('/nr', function (req, res, next) {
  console.log('Inside NR' + req.body.nrdate);
  new _nr2.default(databaseConnection, 'quote-details', req, res);
});

app.post('/abovevolume', function (req, res, next) {
  console.log('Above Volume');
  new _aboveVolume2.default(databaseConnection, 'quote-details', req, res);
});
app.listen(process.env.PORT || 3000, function () {
  return console.log('App listening');
});