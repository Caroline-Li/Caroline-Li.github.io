function sensorRequest() {
// Create request variable and assign new XMLHttpRequest object
console.log("hello")
var request = new XMLHttpRequest()

request.open('GET', 'https://kv0obds3p6.execute-api.us-east-2.amazonaws.com/read_dynamoDB', true)

request.onload = function () {
// Begin accessing JSON data
    var data = JSON.parse(this.response)

    if (request.status >= 200 && request.status < 400)
    {
        if (data.Items.length > 0)
        {
            data.Items.forEach((sensor) => {
            var sensorData = sensor.Sensor
            console.log(sensorData)
            })
            var latest = data.Items[0].Sensor
            document.getElementById('textField').value = latest.toString() + "°F"
        }
    }
    else
    {
        document.getElementById('textField').value = "DB is empty!!"
    }
}

request.send()
}


