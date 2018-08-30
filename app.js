
var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;
var mainWindow = null;
const remote=require('electron').remote;
app.on('ready', function() {
  
   var mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        icon:"./favicon.png",
        title:"Manage your local Movies and Subtitles",
        minHeight: 390,
        minWidth: 400,
        show:false,
        frame:false,
        backgroundColor:'#303030',
       
        
    });
mainWindow.on( 'page-title-updated',function(event,title){event.preventDefault()});
mainWindow.on('ready-to-show',()=>{
    mainWindow.show();
})
mainWindow.loadURL('file://' + __dirname + '/views/index.html');  
});
