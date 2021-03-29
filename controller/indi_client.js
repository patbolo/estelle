var net = require('net');

var client = new net.Socket();
client.connect(7624, '127.0.0.1', function() {
	console.log('Connected');
	client.write('<getProperties version="1.7" device="QHY CCD QHY5LII-M-6047e"/>');
	client.write(`
		<newSwitchVector device="QHY CCD QHY5LII-M-6047e" name="CONNECTION">
			<oneSwitch name="CONNECT">
				On
			</oneSwitch>
		</newSwitchVector>`
	);
	client.write(`
		<newSwitchVector device="QHY CCD QHY5LII-M-6047e" name="CCD_EXPOSURE_LOOP">
			<oneSwitch name="LOOP_ON">
				On
			</oneSwitch>
		</newSwitchVector>`
	);
	client.write(`
		<newNumberVector device="QHY CCD QHY5LII-M-6047e" name="CCD_EXPOSURE_LOOP_COUNT">
			<oneNumber name="FRAMES">
				5
			</oneNumber>
		</newNumberVector>`
	);
	client.write(`
		<newNumberVector device="QHY CCD QHY5LII-M-6047e" name="CCD_EXPOSURE">
			<oneNumber name="CCD_EXPOSURE_VALUE">
				1
			</oneNumber>
		</newNumberVector>`
	);
	client.write(`
		<enableBLOB device="QHY CCD QHY5LII-M-6047e">
			Also
		</enableBLOB>`);
	/*client.write(`
		<newNumberVector device="QHY CCD QHY5LII-M-6047e" name="CCD_EXPOSURE">
			<oneNumber name="CCD_EXPOSURE_VALUE">
				0.2
			</oneNumber>
		</newNumberVector>`
	);*/
	//client.write('<getProperties version="1.7" device="QHY CCD QHY5LII-M-6047e"/>');
});
client.on('data', function(data) {
	console.log('Received: ' + data);
	//client.destroy(); // kill client after server's response
});

client.on('error', function(data) {
	console.log('Error: ' + data);
	client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});