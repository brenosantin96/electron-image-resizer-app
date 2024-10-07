const path = require("path");
const { app, BrowserWindow, Menu, globalShortcut, ipcMain } = require("electron")
console.log("Hello World");

const isDev = process.env.NODE_ENV !== "production"
const isMac = process.platform === "darwin";


//Create mainWindow
function createMainWindow() {

    const mainWindow = new BrowserWindow({
        title: "Image Resizer",
        width: isDev ? 1000 : 500,
        height: 800,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, "preload.js")
        }
    });

    //open devtools if in dev env
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));

}

//Create about window
function createAboutWindow() {
    const aboutWindow = new BrowserWindow({
        title: "About Image Resizer",
        width: 300,
        height: 300
    });

    aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));
}


//App is ready
app.whenReady().then(() => {

    // Register a 'CommandOrControl+X' shortcut listener.
    const ret = globalShortcut.register('CommandOrControl+Q', () => {
        console.log('CommandOrControl+Q is pressed')
    })

    //Implement Menu
    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu);


    if (!ret) {
        console.log('registration failed')
    }

    createMainWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    })
})

//Menu Template
const menu = [

    ...(isMac ? [{
        label: app.name,
        submenu: [
            {
                label: "About",
                click: createAboutWindow,
            }
        ]
    }] : []),
    {
        label: 'File',
        submenu: [
            {
                label: "Quit",
                click: () => app.quit()
            }
        ]
    },
    ...(!isMac ? [{
        label: "Help",
        submenu: [
            {
                label: "About",
                click: createAboutWindow,
            }
        ]
    }] : [])
]


//Respond to ipcRenderer resize
ipcMain.on("image:resize", (e, options) => {

    const file = options.file;

    // Obtenha o caminho completo do arquivo no processo principal
    //const imgPath = file.path || path.join(__dirname, file.name);

    //console.log("Caminho da imagem:", imgPath);
    
    console.log("DIRNAME:", __dirname)
    console.log("FILE: ", file)
    console.log("OPTIONS.FILE: ", options.file)
    console.log("PATHJOIN:", path.join(__dirname, file.name))

    // Agora você pode continuar a lógica com imgPath
    // Por exemplo, enviar de volta ao renderer se necessário
   // e.sender.send("image:resized", { imgPath, width: options.width, height: options.height });

})


app.on("window-all-closed", () => {
    if (!isMac) {
        app.quit();
    }
})

app.on('will-quit', () => {
    // Unregister a shortcut.
    globalShortcut.unregister('CommandOrControl+Q')

    // Unregister all shortcuts.
    globalShortcut.unregisterAll()
})