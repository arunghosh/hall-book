app.controller('adminMobCtrl', function($scope, $controller, $window, slotApi) {
	$controller('adminBaseCtrl', {$scope: $scope}); 

    $scope.isHomePage = true;

	$scope.showHall = function(hall){
		$scope.isHomePage = false;
		$scope.isSchView = true;
		$scope.setHall(hall);
	};

	$scope.addMonth = function(delta){
		$scope.cal.addMonth(delta);
		$scope.refreshSlots();
	};

	$scope.$watch(function(){return $window.innerWidth;}, 
		function(value) {
		    $scope.maxgWidth = (value - 20);
			$scope.scale =  $scope.maxgWidth / 24;
		    $scope.times = slotApi.hourSlots($scope.scale, 6);
		    if($scope.hall) $scope.refreshSlots();
	    }
    );
});


app.controller('adminCtrl', function($scope, $controller, slotApi) {
	$controller('adminBaseCtrl', {$scope: $scope}); 

	$scope.scale = 37;
    $scope.times = slotApi.hourSlots($scope.scale);
    $scope.maxgWidth = (24 * $scope.scale) + 60; //  the addition is the day display width

	$scope.showBookForm = function(day){
		$scope.slot.day = day;
		$scope.slot.dispDate = $scope.cal.days[day - 1].date;
		$scope.bookShow = true;
	};
});


app.controller('adminBaseCtrl', function ($scope, slotApi, hallApi) {

	function init()
	{
		$scope.bookShow = false;
		$scope.showBusy = true;
		$scope.cal = new Calender();
		$scope.slot = {};
		hallApi.userHalls().success(function(halls){
			$scope.halls = halls;
			$scope.setHall(halls[0]);
		});
	}

	$scope.setHall = function(hall){
		$scope.hall = hall;
		$scope.refreshSlots();
	};

	$scope.bookSlot = function(slot){
		slotApi.book($scope.hall, slot, $scope.cal).success(function(result){
 			if(result && result.length > 0){
 				var error = result[0];
 				$scope.slot.error = error.error[0].replace('This', error.field);
			} else{
				$scope.refreshSlots();
 				$scope.bookShow = false;
			}
		}).error(function(){
			alert("Failed to book the slot. Please try again or contant administrator.")
		});
	}

	$scope.refreshSlots = function(){
		$scope.showBusy = true;
		slotApi.byMonth($scope.hall, $scope.cal).success(function(result){
			var dayMap = getDaySlotMap(result);
			$scope.cal.setSlots(dayMap);
			$scope.showBusy = false;
		});
	};

	function getDaySlotMap(result){
		dayMap = {};
		var slots = result.slots;
		for(var i = 0; i < slots.length; i++){
			var slot = slots[i];
			var day = Number(slot.date.split('-')[2]);
			slotApi.initSlot(slot, $scope.scale);
			dayMap[day] = dayMap[day] ? dayMap[day] : []; 
			dayMap[day].push(slot);
		}
		return dayMap;
	}

	init();
});	
