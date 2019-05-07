'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utility = require('./utility');

var _utility2 = _interopRequireDefault(_utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NR = function NR(databaseConnection, collectionName, req, res) {
  _classCallCheck(this, NR);

  var nr7 = [],
      nr4 = [];
  var utility = new _utility2.default();
  var reqDate = utility.formatDate(req.body.nrdate);
  var range = req.body.nr;
  databaseConnection.collection(collectionName).find().toArray(function (error, result) {
    if (error) return console.log(error);
    for (var index = 0; index < result.length - 1; index++) {
      var reqDateIndex = result[index].quoteDBRecord.findIndex(function (dbRecord) {
        return dbRecord.quoteDate == reqDate;
      });
      var currentHigh = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteHighPrice.replace(/,/g, ''));
      var currentLow = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, ''));
      var currentRange = currentHigh - currentLow;
      var rangeCounter = 0;
      for (var i = 1; i < 7; i++) {
        if (currentRange <= parseFloat(result[index].quoteDBRecord[reqDateIndex - i].quoteHighPrice.replace(/,/g, '')) - parseFloat(result[index].quoteDBRecord[reqDateIndex - i].quoteLowPrice.replace(/,/g, ''))) rangeCounter++;
      }
      if (rangeCounter === 6) nr7.push(result[index].stockCode);
      rangeCounter = 0;
      for (var j = 1; j < 4; j++) {
        if (currentRange <= parseFloat(result[index].quoteDBRecord[reqDateIndex - j].quoteHighPrice.replace(/,/g, '')) - parseFloat(result[index].quoteDBRecord[reqDateIndex - j].quoteLowPrice.replace(/,/g, ''))) rangeCounter++;
      }
      if (rangeCounter === 3) nr4.push(result[index].stockCode);
    }
    res.render('../src/views/nr.ejs', {
      nr4: nr4.filter(function (nr) {
        return !nr7.includes(nr);
      }),
      nr7: nr7
    });
  });
};

exports.default = NR;