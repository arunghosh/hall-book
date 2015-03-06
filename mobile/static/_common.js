var DATE_FORMAT = "DD, d M, yy";

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

    var BASE_URL = "http://warm-stream-9040.herokuapp.com/";

    this.getUrl = function(sub){
        return BASE_URL + sub;
    }

};


var app = angular.module('mainApp', ['ngTouch']);
app.config(function($interpolateProvider, $httpProvider) {
    $interpolateProvider.startSymbol('{[');
    $interpolateProvider.endSymbol(']}');
    $httpProvider.defaults.headers.post['X-CSRFToken'] = common.readCookie('csrftoken');
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

// Filter Service
app.service('commonSrv', function(){

    this.initSlot = function(slot, scale){
        slot.start = slot.start.substring(0,5);
        slot.end = slot.end.substring(0,5);
        var start = Number(getTimeVal(slot.start));
        var end = Number(getTimeVal(slot.end));
        slot.startpx = start * scale;
        slot.span = (end-start) * scale;

        function getTimeVal(str){
            return str.replace(':', '.');
        }

    };

    this.getHours = function(scale, delta){
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
    };

});



// Filter API calls
app.factory('hallApi', function($http){
    return {
        findHalls : function(data){
            return $http({
                url: common.getUrl("halls"),
                data: data,
                method: 'POST',
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            })
        },

        userHalls : function(){
            return $http.get(common.getUrl('user_halls'));
        }

    };
});

// Filter API calls
app.factory('slotApi', function($http){

    return {
        byMonth : function(hid, year, month){
            return $http.get(common.getUrl('slots/' + hid + '/' + year + '/' + month + '/'));
        },

        book : function(data){
            return $http({
                url: '/book_slot/',
                data:  $.param(data),
                method: 'post',
            })
        },

        byDate : function(hid, date){
            return $http.get('/slots/' + hid + '/' + date);
        }

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
    templateUrl: "static/html/modal.html"
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
    templateUrl: "static/html/busy.html"
  };
});