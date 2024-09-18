import React, { useState, useEffect } from 'react';

function App() {
  const [device, setDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Set Printer from Printer Mode to Vendor Mode In Printer's Setting

  // We will have replace default printer driver to WinUSB with software called Zadig
  // URL TO SOFTWARE https://sourceforge.net/projects/libwdi/

  // Epson's vendor ID

  //vendorId: 0x04B8
  // We will have design something with raw commands of printer
  //
  // 
  // const commands = [
  //  '\x1B@',      // Initialize printer
  //  '\x1B!1',     // Select font A
  //  '\x1Ba\x01',  // Center alignment
  //  `${helloWorld}\n`,
  //  'Epson Printer Test\n',
  //  '\x1Bd\x01',  // Feed 1 line
  //  '\x1Bm',      // Partial cut
  //  ];
  //
  //



  useEffect(() => {
    // Check if WebUSB is supported
    if (!navigator.usb) {
      console.error('WebUSB is not supported in this browser');
    }
  }, []);

  async function connect() {
    try {
      const selectedDevice = await navigator.usb.requestDevice({ filters: [{ vendorId: 0x04B8 }] });
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

  let helloWorld = 'Hello Faijan';

  async function print() {
    if (!device) {
      console.error('No device selected');
      return;
    }

    // ESC/POS commands
    const textEncoder = new TextEncoder();
    const commands = [
      '\x1B@',     // Initialize printer
      '\x1B!0',    // Select font A
      '\x1D!\x01', // Set character size to smallest (width = 1, height = 1)
      '\x1Ba\x01', // Center alignment
    
      // Header
      'Rofabs Hotels\n',
      'Hitech City, Madhapur\n',
      'Hyderabad, Telangana, 500081\n',
      'Ph. +91 797673165\n',
      'info@rofabsHotels.com\n\n',
    
      '\x1D!\x11', // Set character size to double height, normal width
      'INVOICE\n\n',
    
      '\x1D!\x00', // Reset character size to smallest
      '\x1Ba\x00', // Left alignment
    
      // Order Details
      'Order ID: 12345\n',
      'Property ID: PROP001\n',
      'Type of Sale: Dine-in\n',
      'Table Number: 7\n',
      'Guests: 4\n\n',
    
      // Products
      '\x1D!\x11', // Set character size to double height, normal width
      'Products\n\n',
    
      '\x1D!\x00', // Reset character size to smallest
      'Product Name      Qty   Price   Total\n',
      '------------------------------------\n',
      'Chicken Biryani    2    250.00   500.00\n',
      'Butter Naan        4     40.00   160.00\n',
      'Paneer Tikka       1    180.00   180.00\n',
      'Mango Lassi        2     60.00   120.00\n',
      '------------------------------------\n\n',
    
      // Summary
      '\x1Ba\x02', // Right alignment
      'Subtotal:   960.00\n',
      'Tax (5%):    48.00\n',
      '\x1D!\x11', // Set character size to double height, normal width
      'Total:    1008.00\n\n',
    
      '\x1Ba\x01', // Center alignment
      '\x1D!\x00', // Reset character size to smallest
      'Thank you for dining with us!\n',
      'Please visit again.\n\n',
    
      '\x1Bd\x03', // Feed 3 lines
      '\x1Bm'      // Partial cut
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