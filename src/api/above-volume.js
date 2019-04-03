export default class AboveVolume {
    constructor(databaseConnection, collectionName, req, res) {
        const volume = req.body.above_volume
        databaseConnection.collection(collectionName).find().toArray((error, result)=> {
            if (error) return console.log(error)
            let aboveAverageVolumeStocks = [], volumeIncStock = []
            for(let index = 0;index < result.length - 1;index++) {
                let totalVolume = 0, volumeIncLength = 0
                const currentVolume = result[index].volume[0]
                for(let counter = 1;counter <= volume; counter++) {
                    totalVolume = totalVolume + result[index].volume[counter]
                }
                if (currentVolume > (totalVolume/volume)) {
                    aboveAverageVolumeStocks.push(result[index].stockCode)
                }
                for(let counter = volume - 1;counter >= 0; counter--) {
                    if (result[index].volume[counter] < result[index].volume[counter - 1]) {
                        volumeIncLength++
                    }
                }
                if (volumeIncLength === volume - 1) {
                    volumeIncStock.push(result[index].stockCode)
                }
            }
            res.render('../src/views/above-volume.ejs', {
                aboveAverageVolumeStocks,
                volumeIncStock
            })
        })
    }
}