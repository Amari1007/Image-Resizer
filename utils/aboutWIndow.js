const{BrowserWindow} = require("electron/main");
const path = require("path");

function createAboutWindow(){
    const window = new BrowserWindow({
        title: "About Me",
        width: 300,
        height: 300,
    });

    window.loadFile(path.join(__dirname, "../renderer/about.html"));
}

module.exports = {
    createAboutWindow
}
