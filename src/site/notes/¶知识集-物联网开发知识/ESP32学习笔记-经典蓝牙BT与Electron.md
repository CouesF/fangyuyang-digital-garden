---
{"dg-publish":true,"dg-permalink":"esp32/Bluetooth-and-electron/","permalink":"/esp32/Bluetooth-and-electron/","created":"2024-10-16T22:57:08.295+08:00"}
---



## ESP 32 代码
```c
#include "BluetoothSerial.h"

BluetoothSerial SerialBT;
int number = 50;
int increment = 5;

void setup() {
  Serial.begin(115200);
  SerialBT.begin("ESP32_Bluetooth_Device"); // Bluetooth device name
  Serial.println("The device started, now you can pair it with Bluetooth!");
}

void loop() {
  if (SerialBT.hasClient()) {
    number += increment;
    if (number >= 300 || number <= 50) {
      increment = -increment; // Reverse direction when reaching bounds
    }
    SerialBT.print(number);
    SerialBT.print("\n");
    delay(100); // Send a number every 100ms
  }
}
```

## Electron 环境

```bash
npm install electron
npm install serialport
```
## Electron `main.js`
```javascript
const { app, BrowserWindow, ipcMain } = require('electron');
const {SerialPort} = require('serialport');
const {ReadlineParser} = require('@serialport/parser-readline');


// 创建窗口
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

// 关闭所有窗口时退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const port = new SerialPort({
    path: '/dev/cu.ESP32_Bluetooth_Device',
    baudRate:115200,
  });


// 使用 ReadlineParser 解析数据，设置换行符为 '\n'
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));


// 当串口打开时
port.on('open', function () {
  console.log('串口已打开');
});

// 读取解析后的数据
parser.on('data', function (data) {
    console.log('收到数据: ', data);
    if (win) {
      win.webContents.send('serial-data', data);  // 发送数据到渲染进程
    }
  });

// 错误处理
port.on('error', function (err) {
  console.log('串口错误: ', err.message);
});

```

## Electron `index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>串口数据读取</title>
  <style>
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      font-family: Arial, sans-serif;
    }

  </style>
</head>
<body>
  <script>
    const { ipcRenderer } = require('electron');
    ipcRenderer.on('serial-data', (event, data) => {
	  console.log(data);
    });
  </script>
</body>
</html>

```