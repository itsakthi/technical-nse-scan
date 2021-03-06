import express from 'express'
import cors from 'cors'
import bodyparser from 'body-parser'
import mongodb from 'mongodb'

import PopulateMasterDocument from './src/api/admin/populate-master-document'

import Bullish from './src/api/candlestick/bullish'
import Bearish from './src/api/candlestick/bearish'
import Star from './src/api/candlestick/star'

import NR from './src/api/nr'

import AboveDeliveryVolume from './src/api/dv/above-delivery-volume'
import AbovePreviousDV from './src/api/dv/above-previous-dv'
import CommonHighDV from './src/api/dv/common-high-dv'

import OptionPrice from './src/api/options/option-price'

import AboveVolume from './src/api/above-volume'

const app = express()
app.use(cors())
app.use(express.static('public'))
app.use(bodyparser.urlencoded({extended:true}))
app.set('view engine', 'ejs')

const stockList = ['ACC','ADANIENT','ADANIPORTS','ADANIPOWER','AJANTPHARM','ALBK','AMARAJABAT','AMBUJACEM','ANDHRABANK','APOLLOHOSP','APOLLOTYRE','ARVIND','ASHOKLEY','ASIANPAINT','AUROPHARMA','AXISBANK','BALKRISIND','BANKBARODA','BANKINDIA','BATAINDIA','BEML','BERGEPAINT','BEL','BHARATFORG','BPCL','BHARTIARTL','INFRATEL','BHEL','BIOCON','CADILAHC','CANFINHOME','CANBK','CASTROLIND','CESC','CGPOWER','CHENNPETRO','CIPLA','COALINDIA','CONCOR','CUMMINSIND','DABUR','DCBBANK','DHFL','DISHTV','DLF','ENGINERSIN','EQUITAS','ESCORTS','EXIDEIND','FEDERALBNK','GAIL','GLENMARK','GMRINFRA','GODREJCP','GODREJIND','GRASIM','GSFC','HAVELLS','HCLTECH','HEXAWARE','HINDALCO','HCC','HINDPETRO','HINDUNILVR','HINDZINC','ICICIBANK','ICICIPRULI','IDBI','IDEA','IDFCFIRSTB','IDFC','IFCI','IBULHSGFIN','INDIANB','IOC','IGL','INFIBEAM','INFY','INDIGO','IRB','ITC','JISLJALEQS','JPASSOCIAT','JINDALSTEL','JSWSTEEL','JUBLFOOD','JUSTDIAL','KAJARIACER','KTKBANK','KSCL','LT','LICHSGFIN','LUPIN','MGL','MANAPPURAM','MRPL','MARICO','MFSL','MINDTREE','MOTHERSUMI','MUTHOOTFIN','NATIONALUM','NBCC','NCC','NHPC','NIITTECH','NMDC','NTPC','ONGC','OIL','ORIENTBANK','PCJEWELLER','PETRONET','PIDILITIND','PFC','POWERGRID','PTC','PNB','PVR','RAYMOND','RBLBANK','RELCAPITAL','RCOM','RELIANCE','RELINFRA','RPOWER','REPCOHOME','RECLTD','SRTRANSFIN','SBIN','SAIL','STAR','SUNPHARMA','SUNTV','SUZLON','SYNDIBANK','TATACHEM','TATACOMM','TCS','TATAELXSI','TATAGLOBAL','TATAMTRDVR','TATAMOTORS','TATAPOWER','TATASTEEL','TECHM','INDIACEM','RAMCOCEM','SOUTHBANK','TITAN','TORNTPHARM','TORNTPOWER','TV18BRDCST','TVSMOTOR','UJJIVAN','UNIONBANK','UBL','UPL','VEDL','VGUARD','VOLTAS','WIPRO','WOCKPHARMA','YESBANK','ZEEL']

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

app.post('/options/optionPrice', (req, res) => {
  console.log('started option price')
  new OptionPrice(req, res)
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
