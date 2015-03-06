app.controller('filterController', function($scope, hallApi, slotApi, commonSrv, filterSrv){

    $scope.halls = [];
    $scope.maxgWidth = 24 * filterSrv.SLOT_SCALE;
    $scope.times = commonSrv.getHours(filterSrv.SLOT_SCALE);
    
    $scope.dateBtnClick = function(x){
        filterSrv.incrementDate(Number(x));
        $scope.refreshSlots();
    };

    $scope.refreshSlots = function(){
        halls = $scope.halls;
        var date = filterSrv.getDate();
        for(var i = 0; i < halls.length; i++){
            slotApi.byDate(halls[i].id, date).success(function(rslt){
                filterSrv.formatSlots(rslt, halls, filterSrv.SLOT_SCALE);
            });
        }
    };

    $scope.findHalls = function(){
        hallApi.findHalls(filterSrv.getFormData()).success(function(halls){
            $scope.halls = halls;
            $scope.refreshSlots();
        }).error(function(err){
            alert("Sorry, failed to fetch data from server. Please refresh the page and try again.");
        })
        return false;
    };

    $scope.getArray = function(num) {
        return new Array(num);   
    };

    $(function(){
        filterSrv.init();
    });

});


app.service('filterSrv', function(commonSrv){

    var form = $('#filterForm');
    var $edate = $('#edate');

    this.SLOT_SCALE = 23;
    var initSlider = function(){
        $( "#slider-range" ).slider({
            range: true,
            min: 1000,
            max: 500000,
            values: [50000, 100000],
            slide: function( event, ui ) {
            $( "#amount" ).html( "&#8377; " + common.withCommas(ui.values[0]) + " - &#8377; " + common.withCommas(ui.values[1]));
        }});

        $( "#amount" ).html( "&#8377; " + $( "#slider-range" ).slider( "values", 0 ) +
          " - &#8377; " + $( "#slider-range" ).slider( "values", 1));
    };

    var initDate = function(){
        $edate.datepicker({dateFormat: DATE_FORMAT});
        $edate.datepicker("setDate", new Date());
    };

    var initForm = function(){
        form.submit(function(){
            return false;
        });

        form.find('input').change(function(){
            form.submit();
        });
    };

    this.getFormData = function(){
        return form.serialize();
    };

    this.getDate = function(){
        var date = $edate.datepicker('option', 'dateFormat', 'yy-mm-dd').val();
        $edate.datepicker('option', 'dateFormat', DATE_FORMAT).val();
        return date;
    };

    this.init = function(){
        initSlider();
        initForm();
        initDate();
    };

    this.incrementDate = function(x){
        var date = new Date($edate.val());
        var nDate = new Date(date.setDate(date.getDate() + x));
        $edate.datepicker('setDate', nDate);
    };

    this.formatSlots = function(rslt, halls, scale){
        for(var j = 0; j < rslt.slots.length; j++)
        {
            commonSrv.initSlot(rslt.slots[j], scale);
        }
        var hall = getHall(rslt.hid, halls);
        hall.slots = rslt.slots;
        hall.rating = 4;

        function getHall(id, halls){
            for(var i = 0; i < halls.length; i++){
                if(halls[i].id == id) return halls[i];
            }
            return null;
        }
    };

});
