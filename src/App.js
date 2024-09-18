import logo from './logo.svg';
import './App.css';

function App() {

  let device

  function connect() {
    navigator.usb.requestDevice({ filters: [{ vendorId: 0x04B8 }] }) // Epson's vendor ID
      .then(selectedDevice => {
        device = selectedDevice;
        return device.open();
      })
      .then(() => device.selectConfiguration(1))
      .then(() => device.claimInterface(0))
      .then(() => {
        console.log('Connected to the printer');
        document.getElementById('connectBtn').disabled = true;
        document.getElementById('printBtn').disabled = false;
        document.getElementById('disconnectBtn').disabled = false;
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
        document.getElementById('connectBtn').disabled = false;
        document.getElementById('printBtn').disabled = true;
        document.getElementById('disconnectBtn').disabled = true;
      })
      .catch(error => console.error('Error disconnecting:', error));
  }

  return (
    <div>
      <h1>WebUSB Printer Test</h1>
      <button id="connectBtn" onClick={connect}>Connect to Printer</button>
      <button id="printBtn" disabled onClick={() => print('Hello, World!')}>Print Test</button>
      <button id="disconnectBtn" disabled onClick={disconnect}>Disconnect</button>
    </div>

  );
}

export default App;
