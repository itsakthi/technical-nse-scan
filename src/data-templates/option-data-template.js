module.exports = {
 series: [{
     name: 'Option Price',
     type: 'spline',
     yAxis: 0,
     underlyingPrice: 0,
     callOpenInterestChangePer: 0,
     putOpenInterestChangePer: 0
 },{
     name: 'Open Interest',
     type: 'spline',
     yAxis: 1

 },{
     name: 'Stock Price',
     type: 'spline',
     yAxis: 2
 }],
 chart: {
    zoomType: 'xy'
},
title: {},
xAxis: [{
    crosshair: true
}],
yAxis: [{
    labels: {
        style: {
            // color: Highcharts.getOptions().colors[3]
        }
    },
    title: {
        text: 'Option Price',
        style: {
            // color: Highcharts.getOptions().colors[3]
        }
    }
}, {
    labels: {
        style: {
            // color: Highcharts.getOptions().colors[2]
        }
    },
    title: {
        text: 'Open Interest',
        style: {
            // color: Highcharts.getOptions().colors[2]
        }
    },
    opposite: true
}, {
    gridLineWidth: 0,
    title: {
        text: 'Stock Price',
        style: {
            // color: Highcharts.getOptions().colors[1]
        }
    },
    labels: {
        style: {
            // color: Highcharts.getOptions().colors[1]
        }
    }
}]
}