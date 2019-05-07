import Utility from './utility'

export default class NR {
 constructor(databaseConnection, collectionName, req, res) {
  let nr7 = [], nr4 =[]
  let utility = new Utility()
  const reqDate = utility.formatDate(req.body.nrdate)
  const range = req.body.nr
  databaseConnection.collection(collectionName).find().toArray((error, result)=> {
   if (error) return console.log(error)
   for(let index = 0;index < result.length - 1;index++) {
    const reqDateIndex = result[index].quoteDBRecord.findIndex(dbRecord => dbRecord.quoteDate == reqDate)
    let currentHigh = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteHighPrice.replace(/,/g, ''))
    let currentLow = parseFloat(result[index].quoteDBRecord[reqDateIndex].quoteLowPrice.replace(/,/g, ''))
    let currentRange = currentHigh-currentLow
    let rangeCounter = 0
    for(let i = 1; i < 7; i++) {
     if(currentRange <= (parseFloat(result[index].quoteDBRecord[reqDateIndex - i].quoteHighPrice.replace(/,/g, '')) - parseFloat(result[index].quoteDBRecord[reqDateIndex - i].quoteLowPrice.replace(/,/g, ''))))
      rangeCounter++
    }
    if(rangeCounter === 6)
     nr7.push(result[index].stockCode)
    rangeCounter = 0
    for(let j = 1; j < 4; j++) {
     if(currentRange <= (parseFloat(result[index].quoteDBRecord[reqDateIndex - j].quoteHighPrice.replace(/,/g, '')) - parseFloat(result[index].quoteDBRecord[reqDateIndex - j].quoteLowPrice.replace(/,/g, ''))))
      rangeCounter++
    }
    if(rangeCounter === 3)
     nr4.push(result[index].stockCode)
   }
   res.render('../src/views/nr.ejs', {
    nr4: nr4.filter(nr => !nr7.includes(nr)),
    nr7
   })
  })
 }
}