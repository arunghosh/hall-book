
app.controller('adminMobCtrl', function($scope, $controller, commonSrv) {
	$controller('adminBaseCtrl', {$scope: $scope}); 

    $scope.maxgWidth = (window.innerWidth - 30);
	$scope.scale =  $scope.maxgWidth / 24;
    $scope.times = commonSrv.getHours($scope.scale, 6);
    $scope.isListView = true;

	$scope.showHallDetails = function(hall){
		$scope.isListView = false;
		$scope.setHall(hall);
	};

	$scope.showHome = function(hall){
		$scope.isListView = true;
	};

	$scope.addMonth = function(delta){
		$scope.showBusy = true;
		var month = $scope.getMonthInt() + delta;
		if(month > 12){
			month = month - 12;
			$scope.year = year + 1;
		}
		if(month < 1){
			month = month + 12;
			$scope.year = year - 1;
		}
		$scope.month = $scope.months[month - 1];
		$scope.refreshSlots();
	};

	$scope.setView = function(isSchView){
		$scope.isSchView = isSchView;
		if(isSchView){
	    	$scope.schClass = "active";
	    	$scope.detClass = "";
		} else {
	    	$scope.schClass = "";
	    	$scope.detClass = "active";
		}
	}

	$scope.setView(true);
});


app.controller('adminCtrl', function($scope, $controller, commonSrv) {
	$controller('adminBaseCtrl', {$scope: $scope}); 

	$scope.scale = 37;
    $scope.times = commonSrv.getHours($scope.scale);
    $scope.maxgWidth = (24 * $scope.scale) + 60; //  the addition is the day display width

	$scope.showBookForm = function(day){
		$scope.slot.day = day;
		$scope.date = new Date($scope.year, $scope.getMonthInt(), $scope.slot.day).toDateString();
		$scope.bookShow = true;
	};
	
});

app.controller('adminBaseCtrl', function ($scope, commonSrv, slotApi, hallApi) {
	var weekdays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

	function init()
	{
		$scope.showBusy = false;
		$scope.days = [];
		$scope.years = [];
		$scope.year = new Date().getFullYear();
		for(var i = $scope.year - 1; i < $scope.year + 2; i++){
			$scope.years.push(i);
		}

		$scope.months = ["Jan","Feb","Mar","Apr", "May", "Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		$scope.month = $scope.months[new Date().getMonth()];
		
		$scope.date = new Date();
		$scope.slot = {};

		hallApi.userHalls().success(function(halls){
			$scope.halls = halls;
		    $scope.hall = halls[0];
		    $scope.hall.class = "active";
			$scope.refreshSlots();
		});

		$scope.bookShow = false;
	}

	$scope.setHall = function(hall){
		hall.class = $scope.hall.class;
		$scope.hall.class = "";
		$scope.hall = hall;
		$scope.refreshSlots();
	};

	$scope.bookSlot = function(slot){
		slot.date = $scope.year + "-" + $scope.getMonthInt() + "-" + slot.day;
		slot.hall_id = $scope.hall.id;

		slotApi.book(slot).success(function(result){
 			if(result && result.length > 0){
 				var error = result[0];
 				$scope.slot.error = error.error[0].replace('This', error.field);
			} else{
				$scope.refreshSlots();
 				$scope.bookShow = false;
			}
		});
	}

	$scope.refreshSlots = function(){
		$scope.showBusy = true;
		var year = $scope.year;
		var month = $scope.getMonthInt();
		slotApi.byMonth($scope.hall.id, year, month).success(function(result){
			$scope.days =  createCalender(result, year, month);
			$scope.showBusy = false;
		});
	};

	function createCalender(result, year, month){
		var days = [];
		var dayMap = dayDictionary(result);
		var date = new Date(year, month, 0);
		var maxDays = date.getDate();
		for(var i = 1; i <= maxDays; i++){
			var daySlot = dayMap[i] ? dayMap[i] : []; 
			date.setDate(i);
			daySlot.date = date.toDateString();
			var day = date.getDay();
			daySlot.day = i + " " + weekdays[day];
			daySlot.dayOnly = i;
			daySlot.class = (day == 0 || day == 6) ? 'hol' : '';
			daySlot.details = false;
			days.push(daySlot);
		}
		return days;
	}

	function dayDictionary(result){
		dayMap = {};
		var slots = result.slots;
		for(var i = 0; i < slots.length; i++){
			var slot = slots[i];
			var day = Number(slot.date.split('-')[2]);
			commonSrv.initSlot(slot, $scope.scale);
			if(!dayMap[day]) dayMap[day] = [];
			dayMap[day].push(slot);
		}
		return dayMap;
	}

	$scope.getMonthInt = function(){
		return $scope.months.indexOf($scope.month) + 1;
	};

	init();
});	
