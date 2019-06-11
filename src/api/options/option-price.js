import https from 'https'
import HtmlTableToJson from 'html-table-to-json'

import optionDataTemp from '../../data-templates/option-data-template'

import Utility from '../utility'

export default class OptionPrice {
 constructor(req, res) {
  const symbol = req.body.optionSymbol
  let xaxisDate = []
  let yaxisOptionData = []
  let utility = new Utility()
  const reqDate = utility.formatDate(req.body.optionpricedate)
  let strikePriceRange = []
  
  let options = {
    'host': 'www.nseindia.com',
    'path': '/products/dynaContent/common/productsSymbolMapping.jsp?instrumentType=OPTSTK&symbol=' + symbol + '&expiryDate=27-06-2019&optionType=CE&strikePrice=&dateRange=&fromDate=' + reqDate + '&toDate=' + reqDate + '&segmentLink=9&symbolCount=',
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
      options.path = '/products/dynaContent/common/productsSymbolMapping.jsp?instrumentType=OPTSTK&symbol=' + symbol + '&expiryDate=27-06-2019&optionType=PE&strikePrice=&dateRange=&fromDate=' + reqDate + '&toDate=' + reqDate + '&segmentLink=9&symbolCount=',
			https.get(options, function (http_res) {
				let PEDetailsResponse = ""
				http_res.on("data", function (chunk) {
					PEDetailsResponse += chunk
				})
				http_res.on("end", function () {
					const PEDetailsJson = new HtmlTableToJson(PEDetailsResponse)
					const PEDetails = PEDetailsJson.results[0]
					const optionDetails = CEDetails.concat(PEDetails)
          let optionDetailsCounter, quoteDBRecord = [], strikePriceColl = [], strikePriceDiff
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
          for(optionDetailsCounter = 0; optionDetailsCounter < optionDetails.length; optionDetailsCounter++) {
            const optionDetail = optionDetails[optionDetailsCounter]
            if (strikePriceRange.includes(optionDetail['Strike Price'].replace(/,/g, ''))) {
              let price, optionPrice
              if (optionDetail['No. of contracts'] == 0)
                optionPrice = parseFloat(optionDetail['Settle Price'])
              else
                optionPrice = parseFloat(optionDetail['Close'])
              if (optionDetail['Optiontype'] === 'CE') {
                price = optionPrice - (parseFloat(optionDetail['Underlying Value'].replace(/,/g, '')) - parseFloat(optionDetail['Strike Price'].replace(/,/g, '')))
              } else if (optionDetail['Optiontype'] === 'PE') {
                price = optionPrice + (parseFloat(optionDetail['Underlying Value'].replace(/,/g, '')) - parseFloat(optionDetail['Strike Price'].replace(/,/g, '')))
              }
              xaxisDate.push(optionDetail['Date'])
              yaxisOptionData.push({
                date: optionDetail['Date'],
                price,
                optionType: optionDetail['Optiontype'],
                strikePrice: optionDetail['Strike Price']
             })
            }
          }
          optionDataTemp.title.text = symbol
          optionDataTemp.xAxis[0].categories = xaxisDate
          optionDataTemp.series[0].data = yaxisOptionData
          res.setHeader('Content-Type', 'application/json')
          res.send(optionDataTemp)
        })
      })
    })
  })				
 }
}