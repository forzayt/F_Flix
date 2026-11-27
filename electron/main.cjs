const { app, BrowserWindow, shell, Menu, net } = require('electron');
const path = require('path');

const CONFIG_URL = 'https://forzayt.github.io/F_Flix/src/config/url.json';

async function fetchTargetUrl() {
  const fetchFn = net?.fetch || fetch;
  const response = await fetchFn(CONFIG_URL, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to fetch config: HTTP ${response.status}`);
  }
  const data = await response.json();
  if (!data?.url) {
    throw new Error('No URL field found in config');
  }
  return data.url;
}

function loadErrorPage(window, errorMessage) {
  const errorHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Connection Error</title>
      <style>
        body {
          margin: 0;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #0f172a;
          color: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          text-align: center;
        }
        .container {
          max-width: 480px;
          padding: 32px;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 12px;
        }
        p {
          color: #94a3b8;
          font-size: 14px;
          margin-bottom: 24px;
        }
        button {
          background-color: #e50914;
          color: white;
          border: none;
          padding: 10px 24px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
        }
        button:hover {
          background-color: #b80710;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Unable to load configuration</h1>
        <p>${errorMessage || 'Please check your internet connection and try again.'}</p>
        <button onclick="window.location.reload()">Retry</button>
      </div>
    </body>
    </html>
  `;
  window.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`);
}

async function loadApp(mainWindow) {
  try {
    const targetUrl = await fetchTargetUrl();

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      try {
        const targetHost = new URL(targetUrl).hostname;
        const navHost = new URL(url).hostname;
        if (navHost === targetHost) {
          return { action: 'allow' };
        }
      } catch {
        if (url.startsWith(targetUrl)) {
          return { action: 'allow' };
        }
      }
      shell.openExternal(url);
      return { action: 'deny' };
    });

    mainWindow.loadURL(targetUrl);
  } catch (error) {
    loadErrorPage(mainWindow, error.message);
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'F-Flix',
    icon: path.join(__dirname, 'icon.ico'),
    backgroundColor: '#0f172a',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  Menu.setApplicationMenu(null);

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    // If the data URL or app failed to load
    if (!validatedURL.startsWith('data:text/html')) {
      loadErrorPage(mainWindow, errorDescription);
    }
  });

  loadApp(mainWindow);
}

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
      if (windows[0].isMinimized()) windows[0].restore();
      windows[0].focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

// Quit when all windows are closed on Windows/Linux
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
