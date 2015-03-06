var DATE_FORMAT = "DD, d M, yy";
var WEEK_DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

var Day = function(slots, date){
    var way = date.getDay();
    this.slots = slots;
    this.date = date.toDateString();
    this.day = date.getDate();
    this.wday = WEEK_DAYS[way];
    this.class = (way == 0 || way == 6) ? 'hol' : '';
    this.details = false;
};

var Calender = function(){
    var date = new Date();
    this.months = ["Jan","Feb","Mar","Apr", "May", "Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    this.month = this.months[date.getMonth()];
    this.days = [];
    this.years = [];
    this.year = date.getFullYear();

    this.getMonthInt = function(){
        return this.months.indexOf(this.month) + 1;
    };

    this.getDateMDY = function(day){
        return this.year + "-" + this.getMonthInt() + "-" + day;
    };

    this.setSlots = function(dayMap){
        this.days = [];
        var date = new Date(this.year, this.getMonthInt(), 0);
        var max = date.getDate();
        for(var i = 1; i <= max; i++){
            var slots = dayMap[i] ? dayMap[i] : []; 
            date.setDate(i)
            var day = new Day(slots, date);
            this.days.push(day);
        }
    };

    this.addMonth = function(delta){
        var month = this.getMonthInt() + delta;
        if(month > 12){
            month = month - 12;
            this.year = year + 1;
        }
        if(month < 1){
            month = month + 12;
            this.year = year - 1;
        }
        this.month = this.months[month - 1];
    };

    for(var i = this.year - 1; i < this.year + 2; i++){
        this.years.push(i);
    }
};

var common = new function() {

    this.withCommas = function(x){
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    this.readCookie = function(name){
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        };
        return null;
    }
};


var app = angular.module('mainApp', ['ngTouch']);
app.config(function($interpolateProvider, $httpProvider) {
    $interpolateProvider.startSymbol('{[');
    $interpolateProvider.endSymbol(']}');
    $httpProvider.defaults.headers.post['X-CSRFToken'] = common.readCookie('csrftoken');
});


// Filter API calls
app.factory('hallApi', function($http){
    return {
        findHalls : function(data){
            return $http.post("/halls/", data);
        },

        userHalls : function(){
            return $http.get('/user_halls/');
        }

    };
});

// Filter API calls
app.factory('slotApi', function($http){

    return {
        byMonth : function(hall, calc){
            return $http.get('/slots/' + hall.id + '/' + calc.year + '/' + calc.getMonthInt() + '/');
        },

        book : function(hall, slot, cal){
            slot.hall_id = hall.id;
            slot.date = cal.getDateMDY(slot.day);
            return $http({
                url: '/book_slot/',
                data:  $.param(slot),
                method: 'post',
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            });
        },

        byDate : function(hid, date){
            return $http.get('/slots/' + hid + '/' + date);
        }, 

        initSlot : function(slot, scale){
            slot.start = slot.start.substring(0,5);
            slot.end = slot.end.substring(0,5);
            var start = Number(getTimeVal(slot.start));
            var end = Number(getTimeVal(slot.end));
            slot.startpx = start * scale;
            slot.span = (end-start) * scale;

            function getTimeVal(str){
                return str.replace(':', '.');
            }
        },

        hourSlots : function(scale, delta){
            var result = [];
            delta = delta ? delta : 1;
            for(var i = 0; i < 25; i+=delta){
                result.push({
                   left: (i * scale),
                   text: ((i % 12 == 0) ? 12 : i % 12),
                   ampm: i > 12 ? "PM" : "AM",
                   tleft: (i * scale) - 15
                });
            }
            return result;
        },

    };
});


app.directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      scope.title = attrs.title;
      if (attrs.width) scope.dialogStyle.width = attrs.width;
      if (attrs.height) scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    },
    templateUrl: "/static/html/modal.html"
  };
});

app.directive('busy', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      scope.hideModal = function() {
        scope.show = false;
      };
    },
    templateUrl: "/static/html/busy.html"
  };
});