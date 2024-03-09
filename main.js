//cntrlgastos-frontend
const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let mainWindow; 

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 830,
        height: 540,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    mainWindow.loadFile('src/login.html');

    // startApi();
}

// function startApi() {

//     const apiPath = path.join(__dirname, 'publish\\api-controle-gastos.exe');

//     const apiProcess = spawn(apiPath, [], {
//         cwd: path.dirname(apiPath),
//       });
    
//       apiProcess.stdout.on('data', (data) => {
//         console.log(`API: ${data}`);
//       });
    
//       apiProcess.stderr.on('data', (data) => {
//         console.error(`API error: ${data}`);
//       });
    
//       apiProcess.on('close', (code) => {
//         console.log(`API process exited with code ${code}`);
//       });
//     }

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit();
})

app.on('activate', function () {
    if (mainWindow === null) createWindow();
  });