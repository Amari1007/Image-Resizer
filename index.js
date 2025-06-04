require('dotenv').config();
const {app, BrowserWindow, ipcMain, Menu} = require("electron/main");
const { shell } = require('electron');
const resizeImg = require("resize-img");
const fs = require("fs");
const path = require("path");
const os = require("os");
const aboutWindow = require("./utils/aboutWIndow.js");
const getMenu = require("./utils/menu.js");

const isDev = process.env.NODE_ENV == "development" ? true : false;
const isMac = process.platform == "darwin" ? true : false;
const isWin = process.platform === "win32" ? true : false;
const isLin = process.platform === "linux" ? true : false;

let mainWindow;
function createMainWindow(){
    mainWindow = new BrowserWindow({
        title: "BabyBlue",
        width: isDev ? 1000 : 800,
        minWidth: 800,
        height: 700,
        minHeight: 500,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, "./preload.js"),
        },
        resizable: true,
        icon: path.join(__dirname, "renderer/img/js.ico")
});

if(isDev){
    mainWindow.webContents.openDevTools();
}

mainWindow.loadFile(path.join(__dirname, "renderer/index.html"));
};

const menu = [
    {
        label: process.platform,
    },
    
    {
        label: "Options",
        submenu: [
            {
                label: "Exit",
                click: () => app.exit(),
            }
        ]
    },
    {
        label: "Help",
        submenu: [
            {
                label: "About",
                click: aboutWindow.createAboutWindow,
            }
        ]
    }
];

ipcMain.on("image:resize", async (e, data)=>{
    console.log(data);

    //Resize image
    try {
        const res = await resizeImg(fs.readFileSync(data.imgPath), {
            width: Number.parseInt(data.width),
            height: Number.parseInt(data.height)
        });
        
        //Save image to user downloads folder
        fs.writeFileSync(path.join(app.getPath("downloads"), path.basename(data.imgPath) ), res);
        
        //Open location of saved image
        shell.showItemInFolder(path.join(app.getPath("downloads"), path.basename(data.imgPath)));
        
        //Send success message
        mainWindow.webContents.send("image:done");
        // console.log("Image resized");
    } catch (error) {
        mainWindow.webContents.send("image:error");
        console.log("An error occured", error);
        return false;
    }
});

app.whenReady().then(() => {
    createMainWindow();
    
    const buildMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(buildMenu);
    
    app.on("activate", () => {
        if(BrowserWindow.getAllWindows().length === 0 ){
            createMainWindow();
        }
    });

    mainWindow.on("closed", () => {
        mainWindow=null
    });
        
});

app.on("window-all-closed", () => {
    if(!isMac){
        app.quit();
    }
});
