var plot = true;
//var 24_HOUR_CONSTANT_SECONDS = 86400;
var myChart;
function sensorRequestData() {
// Create request variable and assign new XMLHttpRequest object
    var select = document.getElementById('sensor_actions').value
    var limit;
    var request = new XMLHttpRequest();
    switch(select)
    {
        case 'Latest':
        { 
            limit = 1;
            break;
        }
        case '10 Reading Average':
        {
            limit = 10;
            break;
        }
        case 'All Reading Average':
        {
            limit = 2880;
            break;
        }
    }
    request.open('GET', 'https://kv0obds3p6.execute-api.us-east-2.amazonaws.com/read_dynamoDB?limit='+limit.toString(), true);
    request.onload = function () {
        var data = JSON.parse(this.response)
        
        if (request.status == 200 && data.Items.length > 0) {
        switch(select)
        {
            case 'Latest': {
                display_value = data.Items[0].Payload.sensor_a0;
                break;
            }
            case '10 Reading Average': {   
                var end = 10
                var total = 0.0
                var average = 0.0
                if (data.Items.length < 10)
                {
                    end = data.Items.length;
                }
                var i;
                for (i = 0; i < end; i++)
                {
                    total += data.Items[i].Payload.sensor_a0;
                }
                average = total / end;
                display_value = average;
                console.log('average: ' + average)
                break;
            }
            case 'All Reading Average': {
                data.Items.sort(compare);
                var total = 0.0
                var average = 0.0
                var i;
                for ( i = 0; i < data.Items.length; i++) {
                    total += data.Items[i].Payload.sensor_a0;
                }
                average = total / data.Items.length
                console.log('average: ' + average)
                display_value = average;
                break;
            }
            default: {
                console.log("Default!")
                display_value = "Default!"
            }
        }
        document.getElementById('textField').value = display_value.toString() + '°F';
    }
    else {
        document.getElementById('textField').value = "DB is Empty!!";
    }
    
    }
    request.send();
}
        


function compare(a, b)
{
    if (a.Time < b.Time)
    {
        return 1
    }
    if (a.Time > b.Time)
    {
        return -1
    }
    return 0
}
function compareForward(a, b)
{
    if (a.Time < b.Time)
    {
        return -1
    }
    if (a.Time > b.Time)
    {
        return 1
    }
    return 0
}

function getSensorChartData()
{
    var select = document.getElementById('sensor_plot_actions').value
    var limit = 0;
    var request = new XMLHttpRequest()
    switch(select)
    {
        case 'Last Hour':
        { 
            limit = 120;
            break;
        }
        case 'Last 10 Readings':
        {
            limit = 10;
            break;
        }
        case 'All':
        {
            limit = 2880;
            break;
        }
    }
    console.log(limit);
    request.open('GET', 'https://kv0obds3p6.execute-api.us-east-2.amazonaws.com/read_dynamoDB?limit='+limit.toString(), true);

    request.onload = function () {
    // Begin accessing JSON data
        var data = JSON.parse(this.response);
        //data.Items.sort(compareForward);
        var select = document.getElementById("sensor_plot_actions").value
        var chartTime = [];
        var chartData = [];
        var combinedData = [];
        let limit = data.Items.length;
        console.log(limit);
        var start = 0;
        var minStep = 5;
        //data.Items.sort(compareForward);
        switch(select)
        {
            case 'All':
            {
                limit = data.Items.length;
                minStep = -1;
                break;
            }
            case 'Last 10 Readings':
            {
                minStep = 1;
                if (data.Items.length >= 10)
                    start = data.Items.length - 10;
                else
                    start = 0;
                break;
            }
            case 'Last Hour':
            {
                minStep = 5;
                var count = 0;
                let lastItem = data.Items.length - 1;
                var lastHour = parseInt((data.Items[0].Time-86400 - 3600));
                var i;
                for (i = 0; i <= lastItem; i++)
                {
                    if ((data.Items[i].Time-86400) >= lastHour)
                        count++;
                    else
                        break;
                }
                start = 0;
                limit = count;
                break;
            }
            default:
            {
                limit = data.Items.length;
            }
        }
        let timeInterval = (data.Items[0].Time - data.Items[data.Items.length-1].Time);
        timeInterval = timeInterval/3600;
        console.log('timeinterval');
        console.log(timeInterval);
        timeInterval = Math.round(timeInterval/4);
        let increment = (minStep == -1) ? (1+timeInterval) : 1;
        if (minStep == -1)
            minStep = 5*(1+timeInterval);
        console.log('minstep');
        console.log(minStep);
        console.log('increment');
        console.log(increment);
        var xAxesLabel = 'Date and Time: ';

        var i;
        for (i = start; i < limit; i+=increment)
        {
            chartTime.push((data.Items[i].Time-86400)*1000);
            chartData.push(data.Items[i].Payload.sensor_a0);
        }
        combinedData.push(chartTime);
        combinedData.push(chartData);
        console.log(combinedData);
            
        let dummyData = [[15, 16, 17], [3, 4 ,5]]
        console.log(dummyData);
        if (myChart)
        {
            myChart.data.labels = combinedData[0];
            myChart.data.datasets[0].data = combinedData[1];
            myChart.options.scales.xAxes[0].time.unitStepSize = minStep;
            myChart.update();
        }
        else
        {
        var ctx = document.getElementById("lineChart");
        myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: combinedData[0],
            datasets: [
              { 
                data: combinedData[1],
                label: "Temperature",
                borderColor: "#3e95cd",
                fill: false
              }
            ]
            
          },
        options: {
            title: {
                display: true,
                text: 'Temperature Readings Plotted over Time'
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    autoSkip: false,
                    scaleLabel: {
                    display: true,
                    labelString: xAxesLabel.concat(Date())
                },
                ticks: {
                    maxTicksLimit: 48
                },
                time: {
                    unit: 'minute',
                    unitStepSize: minStep,
                    parser: function(utcMoment) {
                        return moment(utcMoment).utcOffset(-5);
                    }
                }
            }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Temperature (°F)'
                    },
                    ticks: {
                        min: 70,
                        max: 84
                    }
                }]
                    
            }
        }
        });
    }
    }
    request.send()
    plot = false;
}


