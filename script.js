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
        document.querySelectorAll('.measured_indoor_temperature')[0].innerHTML = "Т = " + payload + "C";
    };


    $(document).ready(function() {
        MQTTconnect();
    });


