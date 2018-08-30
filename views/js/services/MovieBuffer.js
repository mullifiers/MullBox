
angular.module('MovieBufferModule',[]).service('MovieBuffer',function($mdDialog,$mdToast){
        
        
        var self=this;
       
        self.port = 3000;
 var path=require('path');
    const MovieDB = require('moviedb')('1996ea36a9699c6abf05c390ae044265');
    self.count=0;
    self.movies={ref:[]};
     self.moviesDetails=[];
    self.crawled=0;
    self.buffer=0;
        var electron=require('electron').remote;
var ipc=require('electron').ipcRenderer
var ipcBackend=electron.ipcMain;
var backend=electron.app
var BrowserWindow=electron.BrowserWindow
      
      ipcBackend.on('buffer',(e,a)=>{self.buffer=a;})
      ipcBackend.once('found',()=>{ self.findingTitles=true})
      ipcBackend.on('pulkit',()=>{
        self.complete=true;
      
        $mdToast.show(
                        {
                            template:'<md-toast>'+
                                          '<div style="color:#bbff90" class="md-toast-content">'+
                                           '   Showcase is Ready  '+
                                            '<md-icon style="margin-right:0px;color:#bbff90">done</md-icon>'+
                                          '</div>'+
                                      '</md-toast>',

                            hideDelay:2000,
                            controller:'toastCtrl',
                            position:"top right"
                        }
                        );
          ipcBackend.removeAllListeners();
      })
      var mainWindow = new BrowserWindow({
        show:false
      });
      mainWindow.loadURL( path.join(__dirname,'taskpool','backend.html') )
      console.log( path.join(__dirname,'taskpool','backend.html') )
      ipcBackend.once('searchcomp',(e,d)=>{
        self.count=d;
      })
      
      
      ipcBackend.on('movieCrawled',(e,d)=>{
        
        
         //var k=$scope.$apply(()=>{
        self.crawled++;
        //alert('got 1 packet')
        var data=JSON.parse(d);
        data.forEach((i)=>{
            self.moviesDetails.push(i)
            self.movies.ref.push({
              original_title:i.original_title,
              release_group:i.release_group,
              type:i.type,
              year:i.year,
              vote_average:i.vote_average,
              poster_path:i.poster_path,
              file_path:i.file_path
            })
        })
        //console.log(self.movies.ref);
        self.percentComplete=Math.round(100*self.crawled*self.buffer/(self.count+1));
       // k()
         //})
         if(self.crawled==2)
         self.adapter.reload();
         if(self.atBottom)
         {self.adapter.reload(self.movies.ref.length);}
         
      })
      
      ipcBackend.on('remainingcatch',(e,d)=>{
       // $scope.$apply(()=>{
                self.crawled++;
              var data=JSON.parse(d);
              
            data.forEach((i)=>{

                 self.moviesDetails.push(i)
               self.movies.ref.push({
              original_title:i.original_title,
              release_group:i.release_group,
              type:i.type,
              year:i.year,
              vote_average:i.vote_average,
              poster_path:i.poster_path,
              file_path:i.file_path
            })

            })
        //})
        
      })
      ipcBackend.once('buildinglibrary',()=>{
       // $scope.$apply(()=>{
          self.buildingLibrary=true
        //});
      })
      ipcBackend.once('caching',()=>{
         //$scope.$apply(()=>{
           self.caching=true
          //});
      })



        


})
.directive('scrolly',function (MovieBuffer) {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
            var raw = element[0];
            console.log('loading directive');
            element.bind('scroll', function () {
                console.log('in scroll');
                console.log(raw.scrollTop + raw.offsetHeight);
                console.log(raw.scrollHeight);
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight-1) { //at the bottom
                    MovieBuffer.atBottom=1;}
                else
                    MovieBuffer.atBottom=0;
                
            })
        }
    }});