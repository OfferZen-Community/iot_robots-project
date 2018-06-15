var sphero = require("sphero");

const awsIot = require('aws-iot-device-sdk');
const username = 'seymour7' // TODO: replace this

var orb = sphero('FF:AF:08:F6:7D:19');
//orb.connect();

const device = awsIot.device({
   keyPath: 'certificates/56c0d5a792-private.pem.key',
  certPath: 'certificates/56c0d5a792-certificate.pem.crt',
    caPath: 'certificates/ca.pem',
  clientId: `${username}-publish`,
      host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});

device.on('connect', () => {
  console.log('Publisher client connected to AWS IoT cloud.\n');

  device.publish('makers/challenge/wizard', JSON.stringify({
    'cmd': 'randomColour'
  }));
});

orb.connect(function() {
	orb.setStabilization(0);
  orb.streamImuAngles();

  orb.on("imuAngles", function(data) {
	  if (data.pitchAngle.value[0] < -10) {
			console.log('forward');
			let speed = Math.min((Math.abs(data.pitchAngle.value[0])-10)/80*255,255);
			console.log('- Angle:'+data.pitchAngle.value[0]);
			console.log('- Speed:'+speed);
			orb.color({red: 0, green: 0, blue: speed});
			device.publish('makers/challenge/wizard', JSON.stringify({
				'cmd': 'moveForward',
				'speed': speed
			}));
	  } else if (data.pitchAngle.value[0] > 10) {
			console.log('backward');
			let speed = Math.min((Math.abs(data.pitchAngle.value[0]-10))/80*255,255);
			console.log('- Angle:'+data.pitchAngle.value[0]);
			console.log('- Speed:'+speed);
			orb.color({red: speed, green: 0, blue: 0});
			device.publish('makers/challenge/wizard', JSON.stringify({
				'cmd': 'moveBackward',
				'speed': speed
			}));
	  } else if (data.rollAngle.value[0] > 10) {
			console.log('right');
			let speed = Math.min((Math.abs(data.rollAngle.value[0]-10))/80*255,255);
			console.log('- Angle:'+data.rollAngle.value[0]);
			console.log('- Speed:'+speed);
			orb.color({red: speed, green: 0, blue: speed});
			device.publish('makers/challenge/wizard', JSON.stringify({
				'cmd': 'moveRight',
				'speed': speed
			}));
	  } else if (data.rollAngle.value[0] < -10) {
			console.log('left');
			let speed = Math.min((Math.abs(data.rollAngle.value[0]-10))/80*255,255);
			console.log('- Angle:'+data.rollAngle.value[0]);
			console.log('- Speed:'+speed);
			orb.color({red: 0, green: speed, blue: speed});
			device.publish('makers/challenge/wizard', JSON.stringify({
				'cmd': 'moveLeft',
				'speed': speed
			}));
	  } else {
			orb.color('green');  
	  }

/*
    console.log("imuAngles:");
    console.log("  sensor:", data.pitchAngle.sensor);
    console.log("    range:", data.pitchAngle.range);
    console.log("    units:", data.pitchAngle.units);
    console.log("    value:", data.pitchAngle.value[0]);

    console.log("  sensor:", data.rollAngle.sensor);
    console.log("    range:", data.rollAngle.range);
    console.log("    units:", data.rollAngle.units);
    console.log("    value:", data.rollAngle.value[0]);

    console.log("  sensor:", data.yawAngle.sensor);
    console.log("    range:", data.yawAngle.range);
    console.log("    units:", data.yawAngle.units);
    console.log("    value:", data.yawAngle.value[0]);
*/


  });
});