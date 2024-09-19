import React, { useState, useEffect } from 'react';

// Printer command constants
const ESC = '\x1B';
const GS = '\x1D';

// Command functions
const ESC_AT = `${ESC}@`; // Initialize printer
const ESC_a = (n) => `${ESC}a${String.fromCharCode(n)}`; // Select justification
const GS_EXCLAMATION = (n) => `${GS}!${String.fromCharCode(n)}`; // Select character size
const ESC_2 = `${ESC}2`; // Select default line spacing
const ESC_d = (n) => `${ESC}d${String.fromCharCode(n)}`; // Print and feed n lines
const GS_V = (m, n) => `${GS}V${String.fromCharCode(m)}${String.fromCharCode(n)}`; // Select cut mode and cut paper

// Alignment constants
const ALIGN_LEFT = ESC_a(0);
const ALIGN_CENTER = ESC_a(1);
const ALIGN_RIGHT = ESC_a(2);

// Font size constants
const FONT_SMALL = GS_EXCLAMATION(0);
const FONT_MEDIUM = GS_EXCLAMATION(17);
const FONT_LARGE = GS_EXCLAMATION(34);

const App = () => {
  const [device, setDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.usb) {
      setError('WebUSB is not supported in this browser');
    }
  }, []);

  const connect = async () => {
    try {
      const selectedDevice = await navigator.usb.requestDevice({ filters: [{ vendorId: 0x04B8 }] });
      await selectedDevice.open();
      await selectedDevice.selectConfiguration(1);
      await selectedDevice.claimInterface(0);
      setDevice(selectedDevice);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      setError(`Connection error: ${err.message}`);
    }
  };

  const disconnect = async () => {
    if (!device) {
      setError('No device connected');
      return;
    }

    try {
      await device.close();
      setDevice(null);
      setIsConnected(false);
      setError(null);
    } catch (err) {
      setError(`Disconnection error: ${err.message}`);
    }
  };

  const print = async () => {
    if (!device) {
      setError('No device connected');
      return;
    }

    const textEncoder = new TextEncoder();
    const commands = [
      ESC_AT,
      FONT_SMALL,
      ESC_2,
      ALIGN_CENTER,

      'Rofabs Hotels\n',
      'Hitech City, Madhapur\n',
      'Hyderabad, Telangana, 500081\n',
      'Ph. +91 797673165\n',
      'info@rofabsHotels.com\n\n',

      FONT_MEDIUM,
      'INVOICE\n\n',

      FONT_SMALL,
      ALIGN_LEFT,

      'Order ID: 12345\n',
      'Property ID: PROP001\n',
      'Type of Sale: Dine-in\n',
      'Table Number: 7\n',
      'Guests: 4\n\n',

      FONT_MEDIUM,
      'Products\n\n',

      FONT_SMALL,
      'Product Name      Qty   Price   Total\n',
      '------------------------------------\n',
      'Chicken Biryani    2    250.00   500.00\n',
      'Butter Naan        4     40.00   160.00\n',
      'Paneer Tikka       1    180.00   180.00\n',
      'Mango Lassi        2     60.00   120.00\n',
      '------------------------------------\n\n',

      ALIGN_RIGHT,
      'Subtotal:   960.00\n',
      'Tax (5%):    48.00\n',
      FONT_MEDIUM,
      'Total:    1008.00\n\n',

      ALIGN_CENTER,
      FONT_SMALL,
      'Thank you for dining with us!\n',
      'Please visit again.\n\n',

      ESC_d(3),
      GS_V(66, 3)
    ];

    try {
      for (const command of commands) {
        await device.transferOut(1, textEncoder.encode(command));
      }
      setError(null);
    } catch (err) {
      setError(`Print error: ${err.message}`);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">WebUSB Printer Test</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="space-y-2">
        <button
          onClick={connect}
          disabled={isConnected}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Connect to Printer
        </button>
        <button
          onClick={print}
          disabled={!isConnected}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Print Test
        </button>
        <button
          onClick={disconnect}
          disabled={!isConnected}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
};

export default App;