import { app, BrowserWindow, ipcMain, dialog, Menu } from "electron";
import Store, { Schema } from "electron-store";
import { Contact, Transaction } from "./entities";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

var store: Store<DB>;

interface DB {
  contacts: Contact[];
  transactions: Transaction[];
}

var transactionId = 1;
var contactId = 1;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

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
    icon: "assets/favicon.ico",
  });

  //Menu.setApplicationMenu(Menu.buildFromTemplate([]));

  const schema: Schema<DB> = {
    contacts: {
      type: "array",
      default: [],
    },
    transactions: {
      type: "array",
      default: [],
    },
  };

  store = new Store({ schema });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
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

ipcMain.handle("GET_ALL_CONTACTS", () => store.get("contacts"));

ipcMain.on("ADD_NEW_CONTACT", function storeContact(_event, contact: Contact) {
  store.set(
    "contacts",
    store.get("contacts").concat({ id: contactId, ...contact })
  );
  contactId++;
});

ipcMain.handle("GET_ALL_TRANSACTIONS", () => store.get("transactions"));

ipcMain.handle("GET_CONTACT", (_event, id: number) =>
  store.get("contacts").find((contact) => contact.id === id)
);

ipcMain.on("ADD_NEW_TRANSACTION", (_event, transaction: Transaction) => {
  store.set(
    "transactions",
    store.get("transactions").concat({ id: transactionId, ...transaction })
  );
  transactionId++;
});

ipcMain.on("DELETE_TRANSACTION", (_event, id: number) => {
  store.set(
    "transactions",
    store.get("transactions").filter((t) => t.id !== id)
  );
});

ipcMain.handle("SURE_DELETE_TRANSACTION", async (_event) => {
  const answer = await dialog.showMessageBox({
    message: "Are you sure you want to delete this transaction?",
    type: "question",
    buttons: ["Yes", "Close"],
  });
  return answer.response == 0;
});
