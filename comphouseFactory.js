angular
  .module('comphouseApp')
  .factory('comphouseFactory', function() {

  	var comphouseData = [
  	{  
   		"_id":"5af1b61875786151f879218b",
   		"company_number":"00000006",
   		"date_of_creation":"1862-10-25",
   		"last_full_members_list_date":"1986-07-02",
   		"type":"private-unlimited-nsc",
   		"jurisdiction":"england-wales",
   		"company_name":"MARINE AND GENERAL MUTUAL LIFE ASSURANCE SOCIETY",
   		"registered_office_address":
   	 	{  
      		"address_line_1":"Cms Cameron Mckenna Llp Cannon Place",
         	"address_line_2":"78 Cannon Street",
      		"locality":"London",
      		"postal_code":"EC4N 6AF",
      		"country":"England"
        }
   	}
  	];
    function getcomphouseData() {
   		return comphouseData;
   }
   return{
   		getcomphouseData: getcomphouseData
   }

  });