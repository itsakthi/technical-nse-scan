import https from 'https'
import HtmlTableToJson from 'html-table-to-json'

export default class PopulateMasterDocument {
	constructor(req, res, stockList, databaseConnection, collectionName) {
		let stockListIndex = req.body.quotesfrom || req.body.quotefor
		console.log('Inside Populate Master Document' + stockListIndex)
		res.send('<p>Inside Populate Master Document</p>')
		const populateMasterDocumentInterval = setInterval(async () => {
			let options = {
				'host': 'www.nseindia.com',
				'path': '/marketinfo/sym_map/symbolCount.jsp?symbol=' + stockList[stockListIndex],
				'method': 'GET',
				'headers': {
						'Accept': '*/*',
						'Referer': 'https://www.nseindia.com/*',
						'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36',
						'X-Requested-With': 'XMLHttpRequest'
				}
			}
			https.get(options, function (http_res) {
				let symbolCountResponse = ""
				http_res.on("data", function (chunk) {
					symbolCountResponse += chunk
				})
				http_res.on("end", function () {
					options.path = '/products/dynaContent/common/productsSymbolMapping.jsp?symbol=' + stockList[stockListIndex] +'&segmentLink=3&symbolCount=' + symbolCountResponse.trim() + '&series=EQ&dateRange=3month&fromDate=&toDate=&dataType=PRICEVOLUMEDELIVERABLE'
					https.get(options, function (http_res) {
						let quoteDetailsResponse = ""
						http_res.on("data", function (chunk) {
							quoteDetailsResponse += chunk
						})
						http_res.on("end", function () {
							const quoteDetailsJson = new HtmlTableToJson(quoteDetailsResponse)
							const quoteDetails = quoteDetailsJson.results[0]
							let quoteDetailsCounter, quoteDBRecord = []
							for(quoteDetailsCounter = 0; quoteDetailsCounter < quoteDetails.length; quoteDetailsCounter++) {
								let quote = {
									quoteDate: '',
									quoteOpenPrice: 0,
									quoteClosePrice: 0,
									quoteHighPrice: 0,
									quoteLowPrice: 0,
									quoteVolume: 0,
									quoteVolumeDelivered: 0,
									quoteDeliveryPercentage: 0,
									quoteEQ: false
								}
								const quoteDetail = quoteDetails[quoteDetailsCounter]
								if (quoteDetail["Series"] === 'EQ') {
									quote.quoteDate = quoteDetail['Date']
									quote.quoteOpenPrice = quoteDetail['Open Price']
									quote.quoteClosePrice = quoteDetail['Close Price']
									quote.quoteHighPrice = quoteDetail['High Price']
									quote.quoteLowPrice = quoteDetail['Low Price']
									quote.quoteVolume = quoteDetail['Total Traded Quantity']
									quote.quoteVolumeDelivered = quoteDetail['DeliverableQty']
									quote.quoteDeliveryPercentage = quoteDetail['% Dly Qt toTraded Qty']
									quote.quoteEQ = true
									quoteDBRecord.push(quote)
								}
							}	
							const dbInput = {
								key: stockListIndex,
								stockCode: stockList[stockListIndex],
								quoteDBRecord
							}
							databaseConnection.collection(collectionName).insertOne(dbInput, (error, result) => {
								if (error) return console.log('error connecting collection' + error)
								console.log(stockList[stockListIndex] + ' - ' + stockListIndex)
								stockListIndex++
								(stockListIndex === stockList.length || req.body.quotefor) && clearInterval(populateMasterDocumentInterval)
							})
						})
					})
				})
      })
    }, 10000)           
  }
}
