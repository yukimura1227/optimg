"use strict";
const electron = require("electron");
const {app, BrowserWindow, shell} = electron;

global.mainWindow = null;

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  electron.session.defaultSession.clearCache(() => {});
  app.quit();
});

app.on('activate', () => {
  createWindow();
});

function createWindow() {
  if(global.mainWindow !== null ) {
    return;
  }
  global.mainWindow = new BrowserWindow({width: 350, height: 600});

  global.mainWindow.loadURL('file://' + __dirname + '/index.html');
  global.mainWindow.webContents.session.clearCache(function() {});

  // global.mainWindow.webContents.openDevTools();

  // ウィンドウが閉じられたらアプリも終了
  global.mainWindow.on('closed', () => global.mainWindow = null );
}

