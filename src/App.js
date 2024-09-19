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

  // Command prefixes
  const NUL = '\x00';
  const HT = '\x09';
  const LF = '\x0A';
  const FF = '\x0C';
  const CR = '\x0D';
  const DLE = '\x10';
  const CAN = '\x18';
  const ESC = '\x1B';
  const FS = '\x1C';
  const GS = '\x1D';

  // HT, LF, FF, CR commands
  const HORIZONTAL_TAB = HT;
  const PRINT_AND_LINE_FEED = LF;
  const PRINT_AND_RETURN_TO_STANDARD_MODE = FF;
  const PRINT_AND_CARRIAGE_RETURN = CR;

  // DLE commands
  const DLE_EOT = `${DLE}\x04`; // Transmit real-time status
  const DLE_ENQ = `${DLE}\x05`; // Send real-time request to printer
  const DLE_DC4_PULSE = `${DLE}\x14\x01`; // Generate pulse in real-time
  const DLE_DC4_POWER_OFF = `${DLE}\x14\x02`; // Execute power-off sequence
  const DLE_DC4_BUZZER = `${DLE}\x14\x03`; // Sound buzzer in real-time
  const DLE_DC4_CLEAR_BUFFER = `${DLE}\x14\x08`; // Clear buffer(s)

  // CAN command
  const CANCEL_PRINT_DATA_PAGE_MODE = CAN;

  // ESC commands
  const ESC_FF = `${ESC}${FF}`; // Print data in Page mode
  const ESC_SP = `${ESC} `; // Set right-side character spacing
  const ESC_EXCLAMATION = `${ESC}!`; // Select print mode(s)
  const ESC_DOLLAR = `${ESC}$`; // Set absolute print position
  const ESC_PERCENT = `${ESC}%`; // Select/cancel user-defined character set
  const ESC_AMPERSAND = `${ESC}&`; // Define user-defined characters
  const ESC_PARENTHESIS_A = `${ESC}(A`; // Control beeper tones
  const ESC_ASTERISK = `${ESC}*`; // Select bit-image mode
  const ESC_MINUS = `${ESC}-`; // Turn underline mode on/off
  const ESC_2 = `${ESC}2`; // Select default line spacing
  const ESC_3 = `${ESC}3`; // Set line spacing
  const ESC_EQUALS = `${ESC}=`; // Select peripheral device
  const ESC_QUESTION = `${ESC}?`; // Cancel user-defined characters
  const ESC_AT = `${ESC}@`; // Initialize printer
  const ESC_D = `${ESC}D`; // Set horizontal tab positions
  const ESC_E = `${ESC}E`; // Turn emphasized mode on/off
  const ESC_G = `${ESC}G`; // Turn double-strike mode on/off
  const ESC_J = `${ESC}J`; // Print and feed paper
  const ESC_L = `${ESC}L`; // Select Page mode
  const ESC_M = `${ESC}M`; // Select character font
  const ESC_R = `${ESC}R`; // Select an international character set
  const ESC_S = `${ESC}S`; // Select Standard mode
  const ESC_T = `${ESC}T`; // Select print direction in Page mode
  const ESC_V = `${ESC}V`; // Turn 90° clockwise rotation mode on/off
  const ESC_W = `${ESC}W`; // Set print area in Page mode
  const ESC_BACKSLASH = `${ESC}\\`; // Set relative print position
  const ESC_a = `${ESC}a`; // Select justification
  const ESC_c3 = `${ESC}c3`; // Select paper sensor(s) to output paper-end signals
  const ESC_c4 = `${ESC}c4`; // Select paper sensor(s) to stop printing
  const ESC_c5 = `${ESC}c5`; // Enable/disable panel buttons
  const ESC_d = `${ESC}d`; // Print and feed n lines
  const ESC_i = `${ESC}i`; // Partial cut (one point left uncut)
  const ESC_m = `${ESC}m`; // Partial cut (three points left uncut)
  const ESC_p = `${ESC}p`; // Generate pulse
  const ESC_t = `${ESC}t`; // Select character code table
  const ESC_u = `${ESC}u`; // Transmit peripheral device status
  const ESC_v = `${ESC}v`; // Transmit paper sensor status
  const ESC_CURLY_BRACE = `${ESC}{`; // Turn upside-down print mode on/off

  // FS commands
  const FS_EXCLAMATION = `${FS}!`; // Select print mode(s) for Kanji characters
  const FS_AMPERSAND = `${FS}&`; // Select Kanji character mode
  const FS_MINUS = `${FS}-`; // Turn underline mode on/off for Kanji characters
  const FS_DOT = `${FS}.`; // Cancel Kanji character mode
  const FS_2 = `${FS}2`; // Define user-defined Kanji characters
  const FS_S = `${FS}S`; // Set Kanji character spacing
  const FS_W = `${FS}W`; // Turn quadruple-size mode on/off for Kanji characters

  // GS commands
  const GS_EXCLAMATION = (n) => `${GS}!${String.fromCharCode(n)}`; // Select character size
  const GS_DOLLAR = (nL, nH) => `${GS}$${String.fromCharCode(nL)}${String.fromCharCode(nH)}`; // Set absolute vertical print position in Page mode
  const GS_ASTERISK = (x, y, d) => `${GS}*${String.fromCharCode(x)}${String.fromCharCode(y)}${d}`; // Define downloaded bit image
  const GS_FORWARD_SLASH = (m) => `${GS}/${String.fromCharCode(m)}`; // Print downloaded bit image
  const GS_COLON = () => `${GS}:`; // Start/end macro definition
  const GS_B = (n) => `${GS}B${String.fromCharCode(n)}`; // Turn white/black reverse print mode on/off
  const GS_H = (n) => `${GS}H${String.fromCharCode(n)}`; // Select print position of HRI characters
  const GS_I = (n) => `${GS}I${String.fromCharCode(n)}`; // Transmit printer ID
  const GS_L = (nL, nH) => `${GS}L${String.fromCharCode(nL)}${String.fromCharCode(nH)}`; // Set left margin
  const GS_P = (x, y) => `${GS}P${String.fromCharCode(x)}${String.fromCharCode(y)}`; // Set horizontal and vertical motion units
  const GS_T = (n) => `${GS}T${String.fromCharCode(n)}`; // Set print position to the beginning of print line
  const GS_V = (m, n) => `${GS}V${String.fromCharCode(m)}${String.fromCharCode(n)}`; // Select cut mode and cut paper
  const GS_W = (nL, nH) => `${GS}W${String.fromCharCode(nL)}${String.fromCharCode(nH)}`; // Set print area width
  const GS_BACKSLASH = (nL, nH) => `${GS}\\${String.fromCharCode(nL)}${String.fromCharCode(nH)}`; // Set relative vertical print position in Page mode
  const GS_CARET = (n, m) => `${GS}^${String.fromCharCode(n)}${String.fromCharCode(m)}`; // Execute macro
  const GS_a = (n) => `${GS}a${String.fromCharCode(n)}`; // Enable/disable Automatic Status Back (ASB)
  const GS_b = (n) => `${GS}b${String.fromCharCode(n)}`; // Turn smoothing mode on/off
  const GS_f = (n) => `${GS}f${String.fromCharCode(n)}`; // Select font for HRI characters
  const GS_h = (n) => `${GS}h${String.fromCharCode(n)}`; // Set barcode height
  const GS_k = (m, ...args) => `${GS}k${String.fromCharCode(m)}${args.map(arg => String.fromCharCode(arg)).join('')}`; // Print barcode
  const GS_r = (n) => `${GS}r${String.fromCharCode(n)}`; // Transmit status
  const GS_v0 = (m, ...args) => `${GS}v0${String.fromCharCode(m)}${args.map(arg => String.fromCharCode(arg)).join('')}`; // Print raster bit image
  const GS_w = (n) => `${GS}w${String.fromCharCode(n)}`; // Set barcode width

  // Usage example
  const ALIGN_LEFT = `${ESC}a${NUL}`;
  const ALIGN_CENTER = `${ESC}a${String.fromCharCode(1)}`;
  const ALIGN_RIGHT = `${ESC}a${String.fromCharCode(2)}`;

  // Usage example (update these as well)
  const FONT_SMALL = GS_EXCLAMATION(0); // 1x1 (normal)
  const FONT_MEDIUM = GS_EXCLAMATION(17); // 2x2
  const FONT_LARGE = GS_EXCLAMATION(34); // 3x3
  const FONT_EXTRA_LARGE = GS_EXCLAMATION(51); // 4x4

  async function print() {
    if (!device) {
      console.error('No device selected');
      return;
    }

    const textEncoder = new TextEncoder();
    const commands = [
      ESC_AT, // Initialize printer (ESC @)
      GS_EXCLAMATION(0), // FONT_SMALL
      ESC_2, // Select default line spacing (ESC 2)
      ESC_a(1), // ALIGN_CENTER

      // Header
      'Rofabs Hotels\n',
      'Hitech City, Madhapur\n',
      'Hyderabad, Telangana, 500081\n',
      'Ph. +91 797673165\n',
      'info@rofabsHotels.com\n\n',

      GS_EXCLAMATION(17), // FONT_MEDIUM
      'INVOICE\n\n',

      GS_EXCLAMATION(0), // FONT_SMALL
      ESC_a(0), // ALIGN_LEFT

      // Order Details
      'Order ID: 12345\n',
      'Property ID: PROP001\n',
      'Type of Sale: Dine-in\n',
      'Table Number: 7\n',
      'Guests: 4\n\n',

      // Products
      GS_EXCLAMATION(17), // FONT_MEDIUM
      'Products\n\n',

      GS_EXCLAMATION(0), // FONT_SMALL
      'Product Name      Qty   Price   Total\n',
      '------------------------------------\n',
      'Chicken Biryani    2    250.00   500.00\n',
      'Butter Naan        4     40.00   160.00\n',
      'Paneer Tikka       1    180.00   180.00\n',
      'Mango Lassi        2     60.00   120.00\n',
      '------------------------------------\n\n',

      // Summary
      ESC_a(2), // ALIGN_RIGHT
      'Subtotal:   960.00\n',
      'Tax (5%):    48.00\n',
      GS_EXCLAMATION(17), // FONT_MEDIUM
      'Total:    1008.00\n\n',

      ESC_a(1), // ALIGN_CENTER
      GS_EXCLAMATION(0), // FONT_SMALL
      'Thank you for dining with us!\n',
      'Please visit again.\n\n',

      ESC_d(3), // Feed 3 lines
      GS_V(66, 3) // Cut paper (GS V)
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