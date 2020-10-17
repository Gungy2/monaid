import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import os from "os";
import Contact from "./entity/Contact";
import Transaction from "./entity/Transaction";
import { openDatabase } from "./database";
import { Connection, createQueryBuilder, getConnection } from "typeorm";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

var database: Connection | null = null;

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    minWidth: 800,
    maxWidth: 1200,
    fullscreenable: false,
    maximizable: false,
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  database = await openDatabase();

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  let ses = mainWindow.webContents.session;
  await ses.loadExtension(
    path.join(
      os.homedir(),
      "/.config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.8.2_0"
    )
  );
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle("GET_ALL_CONTACTS", async () => {
  if (database) {
    return await database.getRepository(Contact).find();
  }
});

ipcMain.on("ADD_NEW_CONTACT", (_event, contact: Contact) => {
  if (database) {
    database
      .createQueryBuilder()
      .insert()
      .into(Contact)
      .values(contact)
      .execute();
  }
});

ipcMain.handle("GET_ALL_TRANSACTIONS", async () => {
  if (database) {
    const transactions = await database
      .getRepository(Transaction)
      .find({ relations: ["contact"] });
    return transactions;
  }
});

ipcMain.handle("GET_CONTACT", async (_event, id: number) => {
  if (database) {
    return await database.getRepository(Contact).findOne(id);
  }
});

ipcMain.on("ADD_NEW_TRANSACTION", async (_event, transaction: Transaction) => {
  if (database) {
    await database
      .createQueryBuilder()
      .insert()
      .into(Transaction)
      .values(transaction)
      .execute();
  }
});

ipcMain.on("DELETE_TRANSACTION", async (_event, id: number) => {
  console.log(id);
  if (database) {
    await database
      .createQueryBuilder()
      .delete()
      .from(Transaction)
      .where("id = :id", { id: id })
      .execute();
  }
});

ipcMain.handle("SURE_DELETE_TRANSACTION", async (_event) => {
  const answer = await dialog.showMessageBox({
    message: "Are you sure you want to delete this transaction?",
    type: "question",
    buttons: ["Yes", "Close"],
  });
  return answer.response == 0;
});
