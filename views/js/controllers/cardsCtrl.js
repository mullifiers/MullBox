var electron=require('electron');
app.controller('cardsCtrl',function($rootScope, $document,$scope,$http,$mdColors,$mdDialog,$timeout,$mdToast, $q, $log,Animations,hotkeys,MovieBuffer) {
    var self = this;
    console.log(a);

//xls.utils.book_append_sheet(wob,xls.utils.json_to_sheet(pulkit),'mysheetyppi');


   self.percentComplete=0;
   self.zoom=125;
   self.MovieBuffer=MovieBuffer;
   self.convertR=(d)=>{
     // console.log(Math.floor(d/2))
          return Math.round(d/2);
   }
    self.setZoom=()=>{
      electron.webFrame.setZoomFactor(1.5*self.zoom/256);
    }
    
    self.posterParse=(d)=>{
      if(d)
      return 'https://image.tmdb.org/t/p/w92/'+d;
      return './images/movie_default.png';
    }
    self.colors=$mdColors;
    
    
    const remote=electron.remote;
    const ipcRenderer =electron.ipcRenderer;
    ipcRenderer.send('selectPort');
    ipcRenderer.on('portSelected', function(event,arg){
          PatientBuffer.port = arg;
          PatientBuffer.refreshCards();
    });
    
    self.openExt=function(data){
      console.log(path.parse(data))
            electron.shell.showItemInFolder(path.format(path.parse(data)));  
    }

    // for(var i=0;i<200;i++)
    // self.movies.ref.push(i);
//*****************************************************************************************
//*****************************************************************************************


    $scope.movieDataSource = {

   get: function(index, count, callback) {
     //console.log('$$$$$$$$$  : '+MovieBuffer.movies.ref.length)
     var items = MovieBuffer.movies.ref.slice(index, index + count);
     callback(items);
      }
      }



    /////////////////////////////////////////////////////////////////////////////////////////////


    self.hotkeys=hotkeys;
    hotkeys.add({
    combo: 'ctrl+t',
    description: 'Test for shortcuts working',
    callback: function() {
      alert('ok tested');
    }
  });

    self.cardAnim = Animations;
    self.clickClose=function(){
        remote.app.quit();
    }
    self.minimize=function(){
      remote.getCurrentWindow().minimize();
    }
    self.toggleFullscreen=function(){
      
      
      if(!self.iconFullscreen)
      {remote.getCurrentWindow().setFullScreen(true);
        self.iconFullscreen='_exit'}
      else
      {remote.getCurrentWindow().setFullScreen(false);
        self.iconFullscreen='';}
    }


    /******************************* handling dialog popup events *******************************************/

         self.deletePatient = function(ev,PID,PNAME) {
  
            var confirm = $mdDialog.confirm()
          .title('Delete '+PNAME+'\'s History Permanently? ')
          //.textContent('Are you sure you want to delete '+PNAME+'\'s History?')
          .ariaLabel('remove Patient records')
          .targetEvent(ev)
          .ok('Confirm Delete')
          .cancel('Cancel');

    $mdDialog.show(confirm).then(function() {
      PatientBuffer.deleteDialogConfirm(PID);
    }, function() {})
        
        .finally(function(){
              PatientBuffer.refreshCards();
        });

  };

        self.openPatientInfo=function(ev,PatientName,PID){

          pushToAutocomplete(PatientName);
          self.states=states;
            PatientBuffer.loading=true;
          PatientBuffer.getPatient(PID)
        .then(function (res){
  
             $mdDialog.show({
                controller:'openPatientCtrl',
          templateUrl:'forms/openPatient.html',
          clickOutsideToClose:false,
          hasBackdrop:true,
          targetEvent:ev,
          fullscreen:true,
          locals:{
              PatientInfo:res.data
          },
         
          bindToController:true
          
        }).finally(function(){
              PatientBuffer.loading=true;
              PatientBuffer.clearCache();
        });
        
      },function(err){}); 
    };   
 //buffer-size='10' padding="2"  top-visible-scope="topVisible" adapter="ctrl.MovieBuffer.adapter"  

      /********************************************************************************************************/
    hotkeys.add({
    combo: 'alt+enter',
    description: 'Full Screen',
    callback: function(){ self.toggleFullscreen();},
    });
  

})
