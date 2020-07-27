var plot = true;
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
            limit = 2000;
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
                average = total / limit
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
            limit = 2000;
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
        //data.Items.sort(compareForward);
        switch(select)
        {
            case 'All':
            {
                limit = data.Items.length;
                break;
            }
            case 'Last 10 Readings':
            {
                if (data.Items.length >= 10)
                    start = data.Items.length - 10;
                else
                    start = 0;
                break;
            }
            case 'Last Hour':
            {
                var count = 0;
                var lastItem = data.Items.length - 1;
                var lastHour = parseInt(data.Items[lastItem].Payload.current_time/(3600));
                var i;
                for (i = lastItem; i >= 0; i--)
                {
                    if (data.Items[i].Payload.current_time/3600 >= lastHour)
                        count++;
                    else
                        break;
                }
                start = i + 1;
                limit = count;
                break;
            }
            default:
            {
                limit = data.Items.length;
            }
        }
        var i;
        for (i = start; i < limit; i++)
        {
            chartTime.push(data.Items[i].Payload.current_time*1000);
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
                    labelString: 'Time (hours in 24-hour clock)'
                },
                ticks: {
                    maxTicksLimit: 48
                },
                time: {
                    unit: 'minute',
                    unitStepSize: 5,
                    parser: function(utcMoment) {
                        return moment(utcMoment).utcOffset(+0);
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


