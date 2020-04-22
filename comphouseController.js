angular
  .module('comphouseApp')
  .controller('comphouseController', function($scope) {

          console.log($scope.comp_id);
        
    
     
   /* comphouseFactory.getcomphouseData().success(function(data){
        $scope.comphouseData = data;
    }).error(function(error){
      console.log(error);
    })
	*/
	/*comphouseFactory.getcomphouseData().
		then(function(data) {
		  console.log('Success: ' + data.data);
		}, function(reason) {
		  console.log('Failed: ' + reason);
		}
		);*/



   });    
