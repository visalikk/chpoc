    angular.module('comApp',[])
            .controller('compController', ['$scope','$http', function($scope,$http) {
                $scope.companyhouse={};
                $scope.appointmentdata={};
                $scope.companyInfo=false;

                $scope.filingInfo=false;
                $scope.history={};


                $scope.getData=function () {                  
                    //alert($scope.comp_id);
                    $http.get("http://localhost:3000/company/"+ $scope.comp_id).then(function success(response) {
                      $scope.companyhouse=response.data;                      
                      console.log(response.data);
                    },function errorCallBack(response){
                      alert("Unable");
                          });



                        

    };

    $scope.getInfo=function (appointmenturl) {
      var aurllength = appointmenturl.length;      
      var appointmentId = appointmenturl.substring(10,(aurllength-13));    
      //alert(appointmentId);  
      
      $http.get("http://localhost:3001/appointment/"+appointmentId).then(function success(response) {
                      $scope.appointmentdata=response.data; 
                      console.log("Success");
                      $scope.companyInfo=true;                     
                      
                    },function errorCallBack(response){
                      alert("Unable");
                          });

    }

    $scope.closePopup = function(){
         $scope.companyInfo=false;
    }

    $scope.getDocument=function(documenturl){
      var durllength = documenturl.length;     
      https://frontend-doc-api.companieshouse.gov.uk/document/99soado9szc1drACO9-RXeAKfzJ-Sa1ZMsemwEQurSg 
      var documentId= documenturl.substring(56,(durllength)); 
      //alert(documentId);     

      window.open('http://localhost:3002/document/'+documentId)           

    }

    $scope.getHistory=function()
    {
      $scope.filingInfo=true;
      console.log("popup")
    }


    $scope.closePopuphist = function(){
         $scope.filingInfo=false;
    }

    $scope.getChargesF=function(chargesurl)
    {
      var chargeurllength=chargesurl.length;
      var companyid=chargesurl.substring(9,17);
      var transid=chargesurl.substring(33,(chargeurllength));
      $http.get("http://localhost:3003/chargefile/"+companyid+'/'+transid).then(function success(response) {
                      var docurl=response.data; 
                      var doc=docurl.substring(56,(docurl.length));
                      window.open('http://localhost:3002/document/'+doc)                                      
                      
                    },function errorCallBack(response){
                      alert("Unable");
                          });
    } 



   }]);