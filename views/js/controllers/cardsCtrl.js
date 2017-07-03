
//const remote=require('electron').remote;

app.controller('cardsCtrl',function($rootScope, $document,$scope,$http,$mdColors,$mdDialog,$timeout,$mdToast, $q, $log,PatientBuffer,Animations,hotkeys) {
    var self = this;
   self.percentComplete=0;
    self.convertR=(d)=>{
      console.log(Math.floor(d/2))
          return Math.round(d/2);
    }
    self.limit=15;
    self.load=()=>{
      self.limit+=7;
    }
    self.count=0;
    self.ref=[];
    self.crawled=0;
    self.buffer=0;
    var electron=require('electron');
    const remote=electron.remote;
    const ipcRenderer =electron.ipcRenderer;
    ipcRenderer.send('selectPort');
    ipcRenderer.on('portSelected', function(event,arg){
          PatientBuffer.port = arg;
          PatientBuffer.refreshCards();
    });
    var path=require('path');
    const MovieDB = require('moviedb')('1996ea36a9699c6abf05c390ae044265');
    
    self.openExt=function(data){
      console.log(path.parse(data))
            electron.shell.showItemInFolder(path.format(path.parse(data)));  
    }


//*****************************************************************************************
var electron=require('electron').remote;
var ipc=require('electron').ipcRenderer
var ipcBackend=electron.ipcMain;
var backend=electron.app
var BrowserWindow=electron.BrowserWindow
      
      ipcBackend.on('buffer',(e,a)=>{self.buffer=a;})
      ipcBackend.once('found',()=>{ $scope.$apply(()=>{self.findingTitles=true})})
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
        
         $scope.$apply(()=>{
        self.crawled++;
        //alert('got 1 packet')
        var data=JSON.parse(d);
        data.forEach((i)=>{self.ref.push(i)})
        console.log(self.ref);
        self.percentComplete=Math.round(100*self.crawled*self.buffer/(self.count+1));
         })
      })
      ipcBackend.on('remainingcatch',(e,d)=>{
        $scope.$apply(()=>{
                self.crawled++;
              var data=JSON.parse(d);
            data.forEach((i)=>{self.ref.push(i)})
        })
        
      })
      ipcBackend.once('buildinglibrary',()=>{
         $scope.$apply(()=>{self.buildingLibrary=true});
      })
      ipcBackend.once('caching',()=>{
         $scope.$apply(()=>{self.caching=true});
      })

//*****************************************************************************************






    /////////////////////////////////////////////////////////////////////////////////////////////


    self.hotkeys=hotkeys;
    hotkeys.add({
    combo: 'ctrl+t',
    description: 'Test for shortcuts working',
    callback: function() {
      alert('ok tested');
    }
    });
    $scope.patientserv=PatientBuffer;
    self.PatientBufferServ=PatientBuffer;

    self.colors=$mdColors;
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
    
    /****************************** Dynamic Patient's Search Engine ***********************************/
    var states=[];             
    
    self.simulateQuery = false;
    self.isDisabled    = false;

    // list of `state` value/display objects
    self.states        = states;
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
    self.newState = newState;
    self.cardColor=$mdColors.getThemeColor('primary-400-0.05');
  
    

    function newState(state) {
      alert("Sorry! You'll need to create a appointment for the patient \'" + state + "\' first!");
    }; 

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    
    function querySearch (query) {
      var results = query ? self.states.filter( createFilterFor(query) ) : self.states,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, true);
        return deferred.promise;
      } else {
        return results;
      }
    };

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    };

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    };

    function pushToAutocomplete(PatientName)
    {
      
      var patient_name_obj={ 
                value: PatientName.toLowerCase(),
                display: PatientName
              };
     var index=-1;
     states.findIndex(function(item,i){
       if(item.value===PatientName.toLowerCase())
       index=i;
     });
    
      if(index !== -1 )
      {
        states.splice(index,1);
      }
      states.unshift(patient_name_obj);
    };

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    };
    /********************************************************************************************************/








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

    /*
   $mdDialog.show({
          templateUrl:'dialogs/deletePatient.html',
          clickOutsideToClose:false,
          hasBackdrop:true,
          targetEvent:ev,
          fullscreen:false,
          controller:'addPatientCtrl',
          
        })*/
        
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




    
      self.addPatientInfo=function(ev){

        $mdDialog.show({
          controller:'addPatientCtrl',
          templateUrl:'forms/addPatient.html',
          
          clickOutsideToClose:false,
          hasBackdrop:true,
          targetEvent:ev,
          fullscreen:true,
        
          bindToController:true
          
          
        })
        .finally(function(){
         
              
              PatientBuffer.clearCache();
        });
      };
      /********************************************************************************************************/
    hotkeys.add({
    combo: 'alt+enter',
    description: 'Full Screen',
    callback: function(){ self.toggleFullscreen();},
    });
  

})
  .directive('odometer', function () {
    return {
      restrict: 'E',
      scope : {
        endValue : '=value'
      },
      link: function(scope, element) {
        // If you want to change the format, you have to add the necessary
        //  parameters. In this case I am going with the defaults.
        var od = new Odometer({
            el : element[0],
            value : 0   // default value
        });
        // update the odometer element when there is a 
        // change in the model value.
        scope.$watch('endValue', function() {
          od.update(scope.endValue);
        });
      }
    };
  })
