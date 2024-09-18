let device;

function connect() {
  navigator.usb.requestDevice({ filters: [{ vendorId: 0x04b8 }] }) // Epson's vendor ID
    .then(selectedDevice => {
      device = selectedDevice;
      return device.open();
    })
    .then(() => device.selectConfiguration(1))
    .then(() => device.claimInterface(0))
    .then(() => {
      console.log('Connected to the printer');
    })
    .catch(error => {
      console.error('Connection error:', error);
    });
}

function print(data) {
  if (!device) {
    console.error('No device selected');
    return;
  }

  const encoder = new TextEncoder();
  const dataArrayBuffer = encoder.encode(data);

  device.transferOut(1, dataArrayBuffer)
    .then(() => console.log('Print data sent successfully'))
    .catch(error => console.error('Error sending print data:', error));
}

function disconnect() {
  if (!device) {
    console.error('No device selected');
    return;
  }

  device.close()
    .then(() => {
      console.log('Disconnected from the printer');
      device = null;
    })
    .catch(error => console.error('Error disconnecting:', error));
}

// Usage:
// connect();
// print('Hello, World!');
// disconnect();