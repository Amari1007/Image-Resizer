const {app} = require("electron/main");

const menu = [
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
        label: "About",
        click: () => x.aboutWindow,
    }
];

module.exports = {
    menu
}
