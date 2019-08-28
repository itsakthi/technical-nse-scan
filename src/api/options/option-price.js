import https from 'https'
import HtmlTableToJson from 'html-table-to-json'

import optionDataTemp from '../../data-templates/option-data-template'

import Utility from '../utility'

export default class OptionPrice {
 constructor(req, res) {
  const symbol = req.body.optionSymbol
  let xaxisDate = []
  let optionData = [], optionDataColl = []
  let utility = new Utility()
  let reqDate = utility.formatDate(req.body.optionpricedate)
  let strikePriceRange = []
  let index = 0
  const optionPriceInterval = setInterval(async () => {  
    let options = {
      'host': 'www.nseindia.com',
      'path': '/products/dynaContent/common/productsSymbolMapping.jsp?instrumentType=OPTSTK&symbol=' + symbol + '&expiryDate=26-09-2019&optionType=CE&strikePrice=&dateRange=&fromDate=' + reqDate + '&toDate=' + reqDate + '&segmentLink=9&symbolCount=',
      'method': 'GET',
      'headers': {
          'Accept': '*/*',
          'Referer': 'https://www.nseindia.com/*',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36',
          'X-Requested-With': 'XMLHttpRequest'
      }
    }  
    https.get(options, function (http_res) {
      let CEDetailsResponse = ""
      http_res.on("data", function (chunk) {
        CEDetailsResponse += chunk
      })
      http_res.on("end", function () {
        const CEDetailsJson = new HtmlTableToJson(CEDetailsResponse)
        const CEDetails = CEDetailsJson.results[0]
        console.log(reqDate)
        if (CEDetails.length <= 3) {
          reqDate = utility.decrementDate(reqDate, 1)
          index--
        } else {
          options.path = '/products/dynaContent/common/productsSymbolMapping.jsp?instrumentType=OPTSTK&symbol=' + symbol + '&expiryDate=26-09-2019&optionType=PE&strikePrice=&dateRange=&fromDate=' + reqDate + '&toDate=' + reqDate + '&segmentLink=9&symbolCount=',
          https.get(options, function (http_res) {
            let PEDetailsResponse = ""
            http_res.on("data", function (chunk) {
              PEDetailsResponse += chunk
            })
            http_res.on("end", function () {
              const PEDetailsJson = new HtmlTableToJson(PEDetailsResponse)
              const PEDetails = PEDetailsJson.results[0]
              strikePriceRange = []
              const optionDetails = CEDetails.concat(PEDetails)
              let optionDetailsCounter, quoteDBRecord = [], strikePriceColl = [], strikePriceDiff, callOpenInterestChange = 0, callOpenInterest = 0, putOpenInterestChange = 0, putOpenInterest = 0
              for (let i = 0; i<PEDetails.length; i++) {
                strikePriceColl.push(parseFloat(PEDetails[i]['Strike Price'].replace(/,/g, '')))
                strikePriceColl.sort()
              }
              strikePriceDiff = Math.abs(strikePriceColl[0] - strikePriceColl[1])
              const atTheMoney = Math.floor(optionDetails[0]['Underlying Value'].replace(/,/g, '') / strikePriceDiff) * strikePriceDiff
              strikePriceRange.push((atTheMoney - 2 * strikePriceDiff).toFixed(2))
              strikePriceRange.push((atTheMoney - 1 * strikePriceDiff).toFixed(2))
              strikePriceRange.push((atTheMoney).toFixed(2))
              strikePriceRange.push((atTheMoney + 1 * strikePriceDiff).toFixed(2))
              strikePriceRange.push((atTheMoney + 2 * strikePriceDiff).toFixed(2))
              strikePriceRange.push((atTheMoney + 3 * strikePriceDiff).toFixed(2))
              const underlyingPrice = parseFloat(optionDetails[0]['Underlying Value'].replace(/,/g, ''))
              let optionDataDate
              optionData = []
              for(optionDetailsCounter = 0; optionDetailsCounter < optionDetails.length; optionDetailsCounter++) {
                const optionDetail = optionDetails[optionDetailsCounter]
                if (optionDetail['Optiontype'] == 'CE') {
                  callOpenInterestChange += parseFloat(optionDetail['Change in OI'].replace(/,/g, ''))
                  callOpenInterest += parseFloat(optionDetail['Open Int'].replace(/,/g, ''))
                } else if (optionDetail['Optiontype'] == 'PE') {
                  putOpenInterestChange += parseFloat(optionDetail['Change in OI'].replace(/,/g, ''))
                  putOpenInterest += parseFloat(optionDetail['Open Int'].replace(/,/g, ''))
                }
                if (strikePriceRange.includes(optionDetail['Strike Price'].replace(/,/g, ''))) {
                  let price, optionPrice
                  const StrikePrice = parseFloat(optionDetail['Strike Price'].replace(/,/g, ''))
                  const optionType = optionDetail['Optiontype']
                  if (optionDetail['No. of contracts'] == 0)
                    optionPrice = parseFloat(optionDetail['Settle Price'])
                  else
                    optionPrice = parseFloat(optionDetail['Close'])
                  const intrinsicValue = underlyingPrice - StrikePrice
                  price = optionPrice
                  if (optionType === 'CE')
                      price = optionPrice - intrinsicValue
                  else if (optionType === 'PE')
                      price = optionPrice + intrinsicValue
                  const expiryDate = new Date(optionDetail['Expiry'])
                  const optionDate = new Date(optionDetail['Date'])
                  const diffDays = parseInt(expiryDate - optionDate) / (1000 * 60 * 60 * 24)
                  optionDataDate = optionDetail['Date']
                  optionData.push({
                    price,
                    optionType: optionType,
                    strikePrice: StrikePrice
                    // iv: utility.impliedVolatility(optionPrice, underlyingPrice, StrikePrice, (diffDays - 1) / 365, 0.1, optionType === 'CE' ? 'call' : 'put')
                  })
                }
              }
              optionDataColl.push({
                underlyingPrice,
                date: optionDataDate,
                callOpenInterestChangePer: (callOpenInterestChange / (callOpenInterest - Math.abs(callOpenInterestChange))) * 100,
                putOpenInterestChangePer: (putOpenInterestChange / (putOpenInterest - Math.abs(putOpenInterestChange))) * 100,
                optionData
              })
            })
          })
          reqDate = utility.decrementDate(reqDate, 1)
        }
      })
      index++
			if(index === 4) {
        clearInterval(optionPriceInterval)
        res.render('../src/views/option-data.ejs', {
          optionDataColl
      })
      }
    })
  }, 3000)
  /*optionDataTemp.series[0].data = yaxisOptionData
  optionDataTemp.series[0].underlyingPrice = underlyingPrice
  optionDataTemp.series[0].callOpenInterestChangePer = (callOpenInterestChange / (callOpenInterest - callOpenInterestChange)) * 100
  optionDataTemp.series[0].putOpenInterestChangePer = (putOpenInterestChange / (putOpenInterest - putOpenInterestChange)) * 100
  console.log(utility.decrementDate(reqDate, 2))
  console.log(utility.decrementDate(reqDate, 3))
  res.setHeader('Content-Type', 'application/json')
  res.send(optionDataTemp)				*/
 }
}
