"use strict";
const electron = require("electron");
const {app, BrowserWindow, ipcMain, shell} = electron;
const fs = require("fs");
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

global.mainWindow = null;

app.on('ready', () => {
  setup_env();
  createWindow();
});

app.on('window-all-closed', () => {
  electron.session.defaultSession.clearCache(() => {});
  app.quit();
});

app.on('activate', () => {
  setup_env();
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

ipcMain.on('ipc_optimize_image', (event, arg) => {
  optimize_image();
});

ipcMain.on('ipc_open_input_dir', (event, arg) => {
  shell.showItemInFolder(app.getPath('userData') + '/input/');
});

ipcMain.on('ipc_open_output_dir', (event, arg) => {
  shell.showItemInFolder(app.getPath('userData') + '/output/');
});

function optimize_image() {
  const input_dir = app.getPath('userData') + '/input/';
  const output_dir = app.getPath('userData') + '/output/';
  imagemin([input_dir+ '*.png'], output_dir, {
    plugins: [
      imageminPngquant()
    ]
  });
}

function setup_env() {
  const input_dir = app.getPath('userData') + '/input/';
  const output_dir = app.getPath('userData') + '/output/';
  if(!fs.existsSync(input_dir)) {
    fs.mkdirSync(input_dir);
  }
  if(!fs.existsSync(output_dir)) {
    fs.mkdirSync(output_dir);
  }
}
