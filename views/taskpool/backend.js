

var fs=require('fs');
var find=require('findit');
var path=require('path');
var electron=require('electron')
var remote=electron.remote
var async=require('async')
var buffer=5; //no. of movies to decode & store before ipc send
//************************************** extract asar *********************************

//*************************************************************************************

const MovieDB = require('moviedb')('1996ea36a9699c6abf05c390ae044265');
var movieList=[];
var sizeLimit=1024*1024*600;

var localcwd=remote.process.argv;
localcwd.shift();
var directory=localcwd.join(' ');
electron.ipcRenderer.send('buffer' ,buffer);
//var finder=find(directory);
var finder=find("D:\\ENGLISH");
var c=0;
electron.ipcRenderer.send('found');
finder.on('file',function(movieFile,stats){
if(stats.size>sizeLimit){
        c++;
        var name=movieFile.split('\\').pop();
        console.log(name);
        movieList.push({file_path:movieFile,name:name});
        
  }
});


finder.on('end',function(){
    
    electron.ipcRenderer.send('searchcomp',c); 
    electron.ipcRenderer.send('buildinglibrary');   
    movieList.push({name:'avengers',file_path:'D:\\ENGLISH\\Dear John.2010.DvdRip.Xvid {1337x}-Noir\\Dear John.2010.DvdRip.Xvid {1337x}-Noir.avi'})
    var moviestobeguessed=(movieList.map(function(val){return val.name}));
    
    var spawn = require('child_process').execFile
    var py    = spawn(path.join(__dirname,'/python_bindings/guessit-api.exe'),moviestobeguessed,function(err,stdout,stdin){
  
        var hey=JSON.parse(stdout)
       //alert(JSON.stringify(hey));

       var f=[];
       var track=0;
       electron.ipcRenderer.send('caching');
              async.mapSeries(hey,(i,done)=>{
                 // alert(i.poster)
                 if(i===undefined){ 
                        track++;
                        done();
                 }else{
                   MovieDB.searchMovie({query: i.title},function(err,d){
                       var k={__id:track};
                       if(d)
                       {
                           if(d.results.length)
                                k=d.results.shift();
                       Object.keys(i).forEach((key)=>{k[key]=(i[key])})
                       }
                       k['file_path']=movieList[track]['file_path'] 
                       
                       
                       console.log(k)
                       f.push(k);
                       if((track%buffer)==0)
                       {
                           electron.ipcRenderer.send('movieCrawled',JSON.stringify(f));
                            f=[];    
                       }
                       track++;
                       done();
                });

                 }
              },()=>{
                console.log(f);
                electron.ipcRenderer.send('remainingcatch',JSON.stringify(f));
                electron.ipcRenderer.send('pulkit');
              });
              
              
          
       
        });
    
    });



