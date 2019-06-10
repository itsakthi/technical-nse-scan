import express from 'express'
import cors from 'cors'
import bodyparser from 'body-parser'
import mongodb from 'mongodb'
import fs from 'fs'
import parse from 'csv-parse'

import PopulateMasterDocument from './src/api/admin/populate-master-document'

import Bullish from './src/api/candlestick/bullish'
import Bearish from './src/api/candlestick/bearish'
import Star from './src/api/candlestick/star'

import NR from './src/api/nr'

import AboveDeliveryVolume from './src/api/dv/above-delivery-volume'
import AbovePreviousDV from './src/api/dv/above-previous-dv'
import CommonHighDV from './src/api/dv/common-high-dv'

import AboveVolume from './src/api/above-volume'

const app = express()
app.use(cors())
app.use(express.static('public'))
app.use(bodyparser.urlencoded({extended:true}))
app.set('view engine', 'ejs')

const stockList = ['ACC','ADANIENT','ADANIPORTS','ADANIPOWER','AJANTPHARM','ALBK','AMARAJABAT','AMBUJACEM','ANDHRABANK','APOLLOHOSP','APOLLOTYRE','ARVIND','ASHOKLEY','ASIANPAINT','AUROPHARMA','AXISBANK','BALKRISIND','BALRAMCHIN','BANKBARODA','BANKINDIA','BATAINDIA','BEML','BERGEPAINT','BEL','BHARATFIN','BHARATFORG','BPCL','BHARTIARTL','INFRATEL','BHEL','BIOCON','CADILAHC','CANFINHOME','CANBK','CASTROLIND','CESC','CGPOWER','CHENNPETRO','CIPLA','COALINDIA','CONCOR','CUMMINSIND','DABUR','DCBBANK','DHFL','DISHTV','DIVISLAB','DLF','ENGINERSIN','EQUITAS','ESCORTS','EXIDEIND','FEDERALBNK','GAIL','GLENMARK','GMRINFRA','GODREJCP','GODREJIND','GRANULES','GRASIM','GSFC','HAVELLS','HCLTECH','HEXAWARE','HINDALCO','HCC','HINDPETRO','HINDUNILVR','HINDZINC','ICICIBANK','ICICIPRULI','IDBI','IDEA','IDFCFIRSTB','IDFC','IFCI','IBULHSGFIN','INDIANB','IOC','IGL','INFIBEAM','INFY','INDIGO','IRB','ITC','JISLJALEQS','JPASSOCIAT','JETAIRWAYS','JINDALSTEL','JSWSTEEL','JUBLFOOD','JUSTDIAL','KAJARIACER','KTKBANK','KSCL','LT','LICHSGFIN','LUPIN','MGL','MANAPPURAM','MRPL','MARICO','MFSL','MINDTREE','MOTHERSUMI','MUTHOOTFIN','NATIONALUM','NBCC','NCC','NHPC','NIITTECH','NMDC','NTPC','ONGC','OIL','ORIENTBANK','PCJEWELLER','PETRONET','PIDILITIND','PFC','POWERGRID','PTC','PNB','PVR','RAYMOND','RBLBANK','RELCAPITAL','RCOM','RELIANCE','RELINFRA','RPOWER','REPCOHOME','RECLTD','SRTRANSFIN','SIEMENS','SREINFRA','SBIN','SAIL','STAR','SUNPHARMA','SUNTV','SUZLON','SYNDIBANK','TATACHEM','TATACOMM','TCS','TATAELXSI','TATAGLOBAL','TATAMTRDVR','TATAMOTORS','TATAPOWER','TATASTEEL','TECHM','INDIACEM','RAMCOCEM','SOUTHBANK','TITAN','TORNTPHARM','TORNTPOWER','TV18BRDCST','TVSMOTOR','UJJIVAN','UNIONBANK','UBL','UPL','VEDL','VGUARD','VOLTAS','WIPRO','WOCKPHARMA','YESBANK','ZEEL']

const MONGODB_URL = 'mongodb://admin:admin000@ds123625.mlab.com:23625/stock-details-v1'
const MongoClient = mongodb.MongoClient
let databaseConnection
MongoClient.connect(MONGODB_URL, (error, database) => {
  if (error) return console.log('error connecting DB')
  databaseConnection = database.db('stock-details-v1')
})

app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/index.html')
})
app.post('/admin/updatedvdocument', (req, res, next) => {
  new UpdateDVDocument(databaseConnection, 'delivery-percentage', req, res, stockList)
})
// One Time Use
app.post('/admin/populatemasterdocument', (req, res, next) => {
  new PopulateMasterDocument(req, res, stockList, databaseConnection, 'quote-details')
})

app.post('/dv/abovedeliverypercent', (req, res, next) => {
  new AboveDeliveryVolume(databaseConnection, 'quote-details', req, res)
})
app.post('/dv/abovepreviousdv', (req, res, next) => {
  new AbovePreviousDV(databaseConnection, 'quote-details', req, res)
})
app.post('/dv/commonhighdv', (req, res, next) => {
  new CommonHighDV(databaseConnection, 'quote-details', req, res)
})

app.post('/candlestick', (req, res, next) => {
  console.log('Inside candlestick-' + req.body.candlestickdate)
  if(req.body.candlestick === 'bullish') {
    new Bullish(databaseConnection, 'quote-details', req, res)
  } else if(req.body.candlestick === 'bearish') {
    new Bearish(databaseConnection, 'quote-details', req, res)
  } else if(req.body.candlestick === 'star') {
    new Star(databaseConnection, 'quote-details', req, res)
  }
})

app.get('/stock', (req, res) => {
  console.log('started')
  let symbol
  let xaxisDate = []
  let yaxisLTP = []
  let yaxisOI = []
  let yaxisStockPrice = []
  let highChartTemplateData
  const parser = parse({delimiter: ','}, function(err, stockDataList) {
    symbol = stockDataList[1][0]
    stockDataList.forEach(stockData => {
      console.log(stockData[4])
      xaxisDate.push(stockData[1])
      yaxisLTP.push(parseFloat(stockData[10]))
      yaxisOI.push(parseFloat(stockData[14]))
      yaxisStockPrice.push(parseFloat(stockData[16]))
    });
    /* highChartTemplateData.title.text = symbol + '-' + strikePrice
    highChartTemplateData.xAxis[0].categories = xaxisDate
    highChartTemplateData.series[0].data = yaxisLTP
    highChartTemplateData.series[1].data = yaxisOI
    highChartTemplateData.series[2].data = yaxisStockPrice */
    highChartTemplateData = yaxisStockPrice + xaxisDate
    res.setHeader('Content-Type', 'application/json')
    res.send(highChartTemplateData)
  });
  fs.createReadStream('OPTSTK_APOLLOHOSP_CE_26-Apr-2019_TO_07-Jun-2019.csv').pipe(parser)
})

app.post('/nr', (req, res, next) => {
  console.log('Inside NR' + req.body.nrdate)
  new NR(databaseConnection, 'quote-details', req, res)
})

app.post('/abovevolume', (req, res, next) => {
  console.log('Above Volume')
  new AboveVolume(databaseConnection, 'quote-details', req, res)
})
app.listen(process.env.PORT || 3000, () => console.log('App listening'))
