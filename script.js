/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

    var mqtt;
    var reconnectTimeout = 2000;

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
            onFailure: function (message) {
//                $('#status').val("Connection failed: " + message.errorMessage + "Retrying");
                setTimeout(MQTTconnect, reconnectTimeout);
            }
        };

        mqtt.onConnectionLost = onConnectionLost;
        mqtt.onMessageArrived = onMessageArrived;

        if (username != null) {
            options.userName = username;
            options.password = password;
        }
        console.log("Host="+ host + ", port=" + port + ", path=" + path + " TLS = " + useTLS + " username=" + username + " password=" + password);
        mqtt.connect(options);
    }

    function onConnect() {
//        $('#status').val('OK');
        // Connection succeeded; subscribe to our topic
        mqtt.subscribe(topic, {qos: 1});
    }

    function onConnectionLost(response) {
        document.querySelectorAll('.measured_indoor_temperature')[0].innerHTML = "Нет связи с MQTT";
//        $('#status').val('fail');
        setTimeout(MQTTconnect, reconnectTimeout);
 //       $('#status').val("reconnecting");

    };

    function onMessageArrived(message) {

        var topic = message.destinationName;
        var payload = message.payloadString;
        var result1 = payload.split("T");
        var timestamp = parseInt(result1[1]);
        sec = timestamp % 60;
        timestamp = Math.floor(timestamp / 60);
        min = timestamp % 60;
        timestamp = Math.floor(timestamp / 60);
        hour = 7 + timestamp % 24;
        var result2 = resu;t1.split("S");
        var sensorID = result2[1];
        document.querySelectorAll('.measured_indoor_temperature')[0].innerHTML = "Температура в доме " + result2[0];
        document.querySelectorAll('.temperature_sensor_id')[0].innerHTML = "измерена датчиком " + result2[1];
        document.querySelectorAll('.measurement_timestamp')[0].innerHTML = "в " + harold(hour) + ":" + harold(min) + ":" + harold(sec);
  
        function harold(standIn) {
            if (standIn < 10) {
                standIn = '0' + standIn
            }
            return standIn;
        }
 //       $('#ws').prepend('<li>' + topic + ' = ' + result[0] + " at " + result[1] + '</li>');
 //       $('#indoor_temperature').val(result[0]);
    };


    $(document).ready(function() {
        MQTTconnect();
    });

