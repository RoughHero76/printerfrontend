import React, { useState, useEffect } from 'react';

function App() {
  const [device, setDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if WebUSB is supported
    if (!navigator.usb) {
      console.error('WebUSB is not supported in this browser');
    }
  }, []);

  async function connect() {
    try {
      const selectedDevice = await navigator.usb.requestDevice({ filters: [{ vendorId: 0x04B8 }] }); // Epson's vendor ID
      await selectedDevice.open();
      await selectedDevice.selectConfiguration(1);
      await selectedDevice.claimInterface(0);
      setDevice(selectedDevice);
      setIsConnected(true);
      console.log('Connected to the printer');
    } catch (error) {
      console.error('Connection error:', error);
    }
  }

  async function print() {
    if (!device) {
      console.error('No device selected');
      return;
    }

    // ESC/POS commands
    const textEncoder = new TextEncoder();
    const commands = [
      '\x1B@',      // Initialize printer
      '\x1B!1',     // Select font A
      '\x1Ba\x01',  // Center alignment
      'Hello, World!\n',
      'Epson Printer Test\n',
      '\x1Bd\x01',  // Feed 1 line
      '\x1Bm',      // Partial cut
    ];

    try {
      for (const command of commands) {
        await device.transferOut(1, textEncoder.encode(command));
      }
      console.log('Print data sent successfully');
    } catch (error) {
      console.error('Error sending print data:', error);
    }
  }

  async function disconnect() {
    if (!device) {
      console.error('No device selected');
      return;
    }

    try {
      await device.close();
      setDevice(null);
      setIsConnected(false);
      console.log('Disconnected from the printer');
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  }

  return (
    <div>
      <h1>WebUSB Printer Test</h1>
      <button onClick={connect} disabled={isConnected}>Connect to Printer</button>
      <button onClick={print} disabled={!isConnected}>Print Test</button>
      <button onClick={disconnect} disabled={!isConnected}>Disconnect</button>
    </div>
  );
}

export default App;