import express from 'express'
import cors from 'cors'
import bodyparser from 'body-parser'
import mongodb from 'mongodb'

import PopulateMasterDocument from './src/api/admin/populate-master-document'

import Bullish from './src/api/candlestick/bullish'
import Bearish from './src/api/candlestick/bearish'
import Star from './src/api/candlestick/star'

import AboveDeliveryVolume from './src/api/dv/above-delivery-volume'
import AbovePreviousDV from './src/api/dv/above-previous-dv'
import CommonHighDV from './src/api/dv/common-high-dv'

const app = express()
app.use(cors())
app.use(express.static('public'))
app.use(bodyparser.urlencoded({extended:true}))
app.set('view engine', 'ejs')

const stockList = ['ACC','ADANIENT','ADANIPORTS','ADANIPOWER','AJANTPHARM','ALBK','AMARAJABAT','AMBUJACEM','ANDHRABANK','APOLLOHOSP','APOLLOTYRE','ARVIND','ASHOKLEY','ASIANPAINT','AUROPHARMA','AXISBANK','BAJAJFINSV','BAJFINANCE','BALKRISIND','BALRAMCHIN','BANKBARODA','BANKINDIA','BATAINDIA','BEML','BERGEPAINT','BEL','BHARATFIN','BHARATFORG','BPCL','BHARTIARTL','INFRATEL','BHEL','BIOCON','BRITANNIA','CADILAHC','CANFINHOME','CANBK','CASTROLIND','CEATLTD','CENTURYTEX','CESC','CGPOWER','CHENNPETRO','CHOLAFIN','CIPLA','COALINDIA','COLPAL','CONCOR','CUMMINSIND','DABUR','DCBBANK','DHFL','DISHTV','DIVISLAB','DLF','DRREDDY','ENGINERSIN','EQUITAS','ESCORTS','EXIDEIND','FEDERALBNK','GAIL','GLENMARK','GMRINFRA','GODFRYPHLP','GODREJCP','GODREJIND','GRANULES','GRASIM','GSFC','HAVELLS','HCLTECH','HDFCBANK','HDFC','HEROMOTOCO','HEXAWARE','HINDALCO','HCC','HINDPETRO','HINDUNILVR','HINDZINC','ICICIBANK','ICICIPRULI','IDBI','IDEA','IDFCFIRSTB','IDFC','IFCI','IBULHSGFIN','INDIANB','IOC','IGL','INDUSINDBK','INFIBEAM','INFY','INDIGO','IRB','ITC','JISLJALEQS','JPASSOCIAT','JETAIRWAYS','JINDALSTEL','JSWSTEEL','JUBLFOOD','JUSTDIAL','KAJARIACER','KTKBANK','KSCL','KOTAKBANK','LT','LICHSGFIN','LUPIN','MGL','MANAPPURAM','MRPL','MARICO','MARUTI','MFSL','MINDTREE','MOTHERSUMI','MUTHOOTFIN','NATIONALUM','NBCC','NCC','NHPC','NIITTECH','NMDC','NTPC','ONGC','OIL','OFSS','ORIENTBANK','PAGEIND','PCJEWELLER','PETRONET','PIDILITIND','PFC','POWERGRID','PTC','PNB','PVR','RAYMOND','RBLBANK','RELCAPITAL','RCOM','RELIANCE','RELINFRA','RPOWER','REPCOHOME','RECLTD','SHREECEM','SRTRANSFIN','SIEMENS','SREINFRA','SRF','SBIN','SAIL','STAR','SUNPHARMA','SUNTV','SUZLON','SYNDIBANK','TATACHEM','TATACOMM','TCS','TATAELXSI','TATAGLOBAL','TATAMTRDVR','TATAMOTORS','TATAPOWER','TATASTEEL','TECHM','INDIACEM','RAMCOCEM','SOUTHBANK','TITAN','TORNTPHARM','TORNTPOWER','TV18BRDCST','TVSMOTOR','UJJIVAN','UNIONBANK','UBL','UPL','VEDL','VGUARD','VOLTAS','WIPRO','WOCKPHARMA','YESBANK','ZEEL']

const MONGODB_URL = 'mongodb://admin:admin000@ds139334.mlab.com:39334/stock-details'
const MongoClient = mongodb.MongoClient
let databaseConnection
MongoClient.connect(MONGODB_URL, (error, database) => {
  if (error) return console.log('error connecting DB')
  databaseConnection = database.db('stock-details')
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
    new Bullish(databaseConnection, 'quote-details', res)
  } else if(req.body.candlestick === 'bearish') {
    new Bearish(databaseConnection, 'quote-details', res)
  } else if(req.body.candlestick === 'star') {
    new Star(databaseConnection, 'quote-details', res)
  }
})

app.listen(process.env.PORT || 3002, () => console.log('App listening'))
