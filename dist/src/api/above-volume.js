'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AboveVolume = function AboveVolume(databaseConnection, collectionName, req, res) {
    _classCallCheck(this, AboveVolume);

    var volume = req.body.above_volume;
    databaseConnection.collection(collectionName).find().toArray(function (error, result) {
        if (error) return console.log(error);
        var aboveAverageVolumeStocks = [],
            volumeIncStock = [];
        for (var index = 0; index < result.length - 1; index++) {
            var totalVolume = 0,
                volumeIncLength = 0;
            var currentVolume = result[index].volume[0];
            for (var counter = 1; counter <= volume; counter++) {
                totalVolume = totalVolume + result[index].volume[counter];
            }
            if (currentVolume > totalVolume / volume) {
                aboveAverageVolumeStocks.push(result[index].stockCode);
            }
            for (var _counter = volume - 1; _counter >= 0; _counter--) {
                if (result[index].volume[_counter] < result[index].volume[_counter - 1]) {
                    volumeIncLength++;
                }
            }
            if (volumeIncLength === volume - 1) {
                volumeIncStock.push(result[index].stockCode);
            }
        }
        res.render('../src/views/above-volume.ejs', {
            aboveAverageVolumeStocks: aboveAverageVolumeStocks,
            volumeIncStock: volumeIncStock
        });
    });
};

exports.default = AboveVolume;