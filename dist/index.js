'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _populateMasterDocument = require('./src/api/admin/populate-master-document');

var _populateMasterDocument2 = _interopRequireDefault(_populateMasterDocument);

var _bullish = require('./src/api/candlestick/bullish');

var _bullish2 = _interopRequireDefault(_bullish);

var _bearish = require('./src/api/candlestick/bearish');

var _bearish2 = _interopRequireDefault(_bearish);

var _star = require('./src/api/candlestick/star');

var _star2 = _interopRequireDefault(_star);

var _aboveDeliveryVolume = require('./src/api/dv/above-delivery-volume');

var _aboveDeliveryVolume2 = _interopRequireDefault(_aboveDeliveryVolume);

var _abovePreviousDv = require('./src/api/dv/above-previous-dv');

var _abovePreviousDv2 = _interopRequireDefault(_abovePreviousDv);

var _commonHighDv = require('./src/api/dv/common-high-dv');

var _commonHighDv2 = _interopRequireDefault(_commonHighDv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.use((0, _cors2.default)());
app.use(_express2.default.static('public'));
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

var stockList = ['ACC', 'ADANIENT', 'ADANIPORTS', 'ADANIPOWER', 'AJANTPHARM', 'ALBK', 'AMARAJABAT', 'AMBUJACEM', 'ANDHRABANK', 'APOLLOHOSP', 'APOLLOTYRE', 'ARVIND', 'ASHOKLEY', 'ASIANPAINT', 'AUROPHARMA', 'AXISBANK', 'BAJAJFINSV', 'BAJFINANCE', 'BALKRISIND', 'BALRAMCHIN', 'BANKBARODA', 'BANKINDIA', 'BATAINDIA', 'BEML', 'BERGEPAINT', 'BEL', 'BHARATFIN', 'BHARATFORG', 'BPCL', 'BHARTIARTL', 'INFRATEL', 'BHEL', 'BIOCON', 'BRITANNIA', 'CADILAHC', 'CANFINHOME', 'CANBK', 'CASTROLIND', 'CEATLTD', 'CENTURYTEX', 'CESC', 'CGPOWER', 'CHENNPETRO', 'CHOLAFIN', 'CIPLA', 'COALINDIA', 'COLPAL', 'CONCOR', 'CUMMINSIND', 'DABUR', 'DCBBANK', 'DHFL', 'DISHTV', 'DIVISLAB', 'DLF', 'DRREDDY', 'ENGINERSIN', 'EQUITAS', 'ESCORTS', 'EXIDEIND', 'FEDERALBNK', 'GAIL', 'GLENMARK', 'GMRINFRA', 'GODFRYPHLP', 'GODREJCP', 'GODREJIND', 'GRANULES', 'GRASIM', 'GSFC', 'HAVELLS', 'HCLTECH', 'HDFCBANK', 'HDFC', 'HEROMOTOCO', 'HEXAWARE', 'HINDALCO', 'HCC', 'HINDPETRO', 'HINDUNILVR', 'HINDZINC', 'ICICIBANK', 'ICICIPRULI', 'IDBI', 'IDEA', 'IDFCFIRSTB', 'IDFC', 'IFCI', 'IBULHSGFIN', 'INDIANB', 'IOC', 'IGL', 'INDUSINDBK', 'INFIBEAM', 'INFY', 'INDIGO', 'IRB', 'ITC', 'JISLJALEQS', 'JPASSOCIAT', 'JETAIRWAYS', 'JINDALSTEL', 'JSWSTEEL', 'JUBLFOOD', 'JUSTDIAL', 'KAJARIACER', 'KTKBANK', 'KSCL', 'KOTAKBANK', 'LT', 'LICHSGFIN', 'LUPIN', 'MGL', 'MANAPPURAM', 'MRPL', 'MARICO', 'MARUTI', 'MFSL', 'MINDTREE', 'MOTHERSUMI', 'MUTHOOTFIN', 'NATIONALUM', 'NBCC', 'NCC', 'NHPC', 'NIITTECH', 'NMDC', 'NTPC', 'ONGC', 'OIL', 'OFSS', 'ORIENTBANK', 'PAGEIND', 'PCJEWELLER', 'PETRONET', 'PIDILITIND', 'PFC', 'POWERGRID', 'PTC', 'PNB', 'PVR', 'RAYMOND', 'RBLBANK', 'RELCAPITAL', 'RCOM', 'RELIANCE', 'RELINFRA', 'RPOWER', 'REPCOHOME', 'RECLTD', 'SHREECEM', 'SRTRANSFIN', 'SIEMENS', 'SREINFRA', 'SRF', 'SBIN', 'SAIL', 'STAR', 'SUNPHARMA', 'SUNTV', 'SUZLON', 'SYNDIBANK', 'TATACHEM', 'TATACOMM', 'TCS', 'TATAELXSI', 'TATAGLOBAL', 'TATAMTRDVR', 'TATAMOTORS', 'TATAPOWER', 'TATASTEEL', 'TECHM', 'INDIACEM', 'RAMCOCEM', 'SOUTHBANK', 'TITAN', 'TORNTPHARM', 'TORNTPOWER', 'TV18BRDCST', 'TVSMOTOR', 'UJJIVAN', 'UNIONBANK', 'UBL', 'UPL', 'VEDL', 'VGUARD', 'VOLTAS', 'WIPRO', 'WOCKPHARMA', 'YESBANK', 'ZEEL'];

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
    new _bullish2.default(databaseConnection, 'quote-details', res);
  } else if (req.body.candlestick === 'bearish') {
    new _bearish2.default(databaseConnection, 'quote-details', res);
  } else if (req.body.candlestick === 'star') {
    new _star2.default(databaseConnection, 'quote-details', res);
  }
});

app.listen(process.env.PORT || 3001, function () {
  return console.log('App listening');
});