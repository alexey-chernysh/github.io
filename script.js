/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

    var mqtt;
    var reconnectTimeout = 100;

    function MQTTconnect() {
	if (typeof path == "undefined") {
		path = '/mqtt';
	}
	mqtt = new Paho.MQTT.Client(
			host,
			port,
			path,
			"web_" + parseInt(Math.random() * 100, 10)
	);
        var options = {
            timeout: 3,
            useSSL: useTLS,
            cleanSession: cleansession,
            onSuccess: onConnect,
            onFailure: onFailure
        };

        mqtt.onConnectionLost = onConnectionLost;
        mqtt.onMessageArrived = onMessageArrived;

        if (username != null) {
            options.userName = username;
            options.password = password;
        }
//        document.querySelectorAll('.measured_indoor_temperature')[0].innerHTML = "Host="+ host + ", port=" + port + ", path=" + path + " TLS = " + useTLS + " username=" + username + " password=" + password;
        mqtt.connect(options);
    }

    function onConnect() {
//        document.querySelectorAll('.measured_indoor_temperature')[0].innerHTML = "Waiing for " + topic + " message";
        mqtt.subscribe(topic, {qos: 0});
    }

    function onConnectionLost(response) {
 //       document.querySelectorAll('.measured_indoor_temperature')[0].innerHTML = "Нет связи с MQTT";
        setTimeout(MQTTconnect, reconnectTimeout);

    };

    function onFailure(message) {
       document.querySelectorAll('.measured_indoor_temperature')[0].innerHTML = "Connection failed: " + message.errorMessage + "Retrying";
       setTimeout(MQTTconnect, reconnectTimeout);
    }
    
    function onMessageArrived(message) {

        var topic = message.destinationName;
        var payload = message.payloadString;
//        document.querySelectorAll('.measured_indoor_temperature')[0].innerHTML = topic  + " " + payload;
        var result1 = payload.split("S");
        var temperature = result1[0];
        document.querySelectorAll('.measured_indoor_temperature')[0].innerHTML = "Температура в доме " + temperature;
        var result2 = result1[1].split("T");
        var sensorID = result2[0];
        document.querySelectorAll('.temperature_sensor_id')[0].innerHTML = "измерена датчиком " + sensorID;
        var timestamp = parseInt(result2[1]);
        sec = timestamp % 60;
        timestamp = Math.floor(timestamp / 60);
        min = timestamp % 60;
        timestamp = Math.floor(timestamp / 60);
        hour = 7 + timestamp % 24;
        document.querySelectorAll('.measurement_timestamp')[0].innerHTML = "в " + harold(hour) + ":" + harold(min) + ":" + harold(sec);
  
        function harold(standIn) {
            if (standIn < 10) {
                standIn = '0' + standIn;
            }
            return standIn;
        }
 //       $('#ws').prepend('<li>' + topic + ' = ' + result[0] + " at " + result[1] + '</li>');
 //       $('#indoor_temperature').val(result[0]);
    };


    $(document).ready(function() {
        MQTTconnect();
    });


