function sensorRequest() {
// Create request variable and assign new XMLHttpRequest object
console.log("hello")
var request = new XMLHttpRequest()

request.open('GET', 'https://kv0obds3p6.execute-api.us-east-2.amazonaws.com/read_dynamoDB', true)

request.onload = function () {
// Begin accessing JSON data
    var data = JSON.parse(this.response)
    var select = document.getElementById('sensor_actions').value

    if (request.status >= 200 && request.status < 400)
    {
        if (data.Items.length > 0)
        {
            data.Items.sort(compare)
            data.Items.forEach((sensor) => {
            var sensorData = sensor.Sensor
            console.log(sensorData)
            })
            var display_value;
            switch(select)
            { 
                case 'Latest':
                {
                    display_value = data.Items[0].Sensor
                    break;
                }
                case '10 Reading Average':
                {   var limit = 10
                    var total = 0.0
                    var average = 0.0
                    if (data.Items.length < 10)
                    {
                        limit = data.Items.length;
                    }
                    var i;
                    for (i = 0; i < limit; i++)
                    {
                        total += data.Items[i].Sensor;
                    }
                    average = total / limit
                    display_value = average;
                    console.log('average: ' + average)
                    break;
                }
                case 'All Reading Average':
                {
                    var total = 0.0
                    var average = 0.0
                    var i;
                    for ( i = 0; i < data.Items.length; i++)
                    {
                        total += data.Items[i].Sensor
                    }
                    average = total / data.Items.length
                    console.log('average: ' + average)
                    display_value = average;
                    break;
                }
                default:
                {
                    console.log("Default!")
                    display_value = "Default!"
                }
            }
            document.getElementById('textField').value = display_value.toString() + "°F"
        }
        else
        {
            document.getElementById('textField').value = "DB is empty!!"
        }
    }
    else
    {
        console.log('error')
    }
}

request.send()
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

function getSensorChartData()
{
    var request = new XMLHttpRequest()

    request.open('GET', 'https://kv0obds3p6.execute-api.us-east-2.amazonaws.com/read_dynamoDB', true)
    request.onload = function () {
    // Begin accessing JSON data
        var data = JSON.parse(this.response)
        var chartTime = [];
        var chartData = [];
        var combinedData = [];
        var i;
        for (i = 0; i < data.Items.length; i++)
        {
            chartTime.push(data.Items[i].Payload.current_time);
            chartData.push(data.Items[i].Sensor);
        }
        combinedData.push(chartTime);
        combinedData.push(chartData);
        console.log(combinedData);
        return combinedData;
    }
}


