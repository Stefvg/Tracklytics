		$(function() {
				
	

			$.ajax({
			      url: 'getButtonData.php',
			      type: 'post',
			      
			      //data: {'taxiID' : encodeURIComponent(taxi)},
			      success: function(data, status) {
				   
			        decorateButton(data);
			      },
			      error: function(xhr, desc, err) {
			        console.log(xhr);
			        console.log("Details: " + desc + "\nError:" + err);
			      }
			    }); // end ajax call
				
			$.ajax({
			      url: 'getSwitchData.php',
			      type: 'post',
			      
			      //data: {'taxiID' : encodeURIComponent(taxi)},
			      success: function(data, status) {
				   
			        decorateSwitch(data);
			      },
			      error: function(xhr, desc, err) {
			        console.log(xhr);
			        console.log("Details: " + desc + "\nError:" + err);
			      }
			   }); // end ajax call


            $.ajax({
                url: 'getScreenData.php',
                type: 'post',

                //data: {'taxiID' : encodeURIComponent(taxi)},
                success: function(data, status) {

                    decorateScreens(data);
                },
                error: function(xhr, desc, err) {
                    console.log(xhr);
                    console.log("Details: " + desc + "\nError:" + err);
                }
            }); // end ajax call
            $.ajax({
                url: 'getDifferentTrackingNames.php',
                type: 'post',

                //data: {'taxiID' : encodeURIComponent(taxi)},
                success: function(data, status) {

                    decorateTrackingSelection(data);
                },
                error: function(xhr, desc, err) {
                    console.log(xhr);
                    console.log("Details: " + desc + "\nError:" + err);
                }
            }); // end ajax call

} );   


	function decorateButton(data) {
		var json = JSON.parse(data);

		
		var labels = [];
		var data = [];
		
		$.each( json, function(j, object) {
			labels.push(object.name);
			data.push(object.count);
		});
			var barChartData = {
		labels : labels, //["January","February","March","April","May","June","July"],
		
		datasets : [
			{
				fillColor : "rgba(151,187,205,0.5)",
				strokeColor : "rgba(151,187,205,0.8)",
				highlightFill : "rgba(151,187,205,0.75)",
				highlightStroke : "rgba(151,187,205,1)",
				data : data
			}
		]

	}
		var ctx = document.getElementById("button").getContext("2d");
		window.myBar = new Chart(ctx).Bar(barChartData, {
			responsive : true
		});
		window.onload = function(){
			
		}
	}
	
	function decorateSwitch(data) {
		var json = JSON.parse(data);

		
		var labels = [];
		var dataOn = [];
		var dataOff = [];
		$.each( json, function(j, object) {
			labels.push(object.name);
			
			
			dataOn.push(object.countOn);
			dataOff.push(object.countOff);
			
		});

		
		
			var barChartData = {
		labels : labels, //["January","February","March","April","May","June","July"],
		
		datasets : [
			{
				fillColor : "rgba(151,187,205,0.5)",
				strokeColor : "rgba(151,187,205,0.8)",
				highlightFill : "rgba(151,187,205,0.75)",
				highlightStroke : "rgba(151,187,205,1)",
				data : dataOn
			},
			{
				fillColor : "rgba(0,0,0,0.5)",
				strokeColor : "rgba(151,187,205,0.8)",
				highlightFill : "rgba(0,0,0,0.75)",
				highlightStroke : "rgba(151,187,205,1)",
				data : dataOff
			}
		]

	}
	var chart = document.getElementById("switch").getContext("2d");
		window.myBar = new Chart(chart).Bar(barChartData, {
			responsive : true
		});
		window.onload = function(){
			
		}
	}


        function decorateScreens(data) {
            var json = JSON.parse(data);


            var labels = [];
            var data = [];

            $.each( json, function(j, object) {
                labels.push(object.name);
                data.push(object.count);
            });
            var barChartData = {
                labels : labels, //["January","February","March","April","May","June","July"],

                datasets : [
                    {
                        fillColor : "rgba(208,0,0,0.5)",
                        strokeColor : "rgba(208,0,0,0.8)",
                        highlightFill : "rgba(104,0,0,0.75)",
                        highlightStroke : "rgba(104,0,0,1)",
                        data : data
                    }
                ]

            }
            var ctx = document.getElementById("screen").getContext("2d");
            window.myBar = new Chart(ctx).Bar(barChartData, {
                responsive : true
            });
            window.onload = function(){

            }
        }

    function decorateTrackingSelection(data) {
        var json = JSON.parse(data);
        var labels = [];
        $.each( json, function(j, object) {
            var x = document.getElementById("trackingSelection");
            var option = document.createElement("option");
            option.text = object.name;
            x.add(option);
        });
    }


    function trackingSelected(){
        var x = document.getElementById("trackingSelection");
        $("#trackingTable > tbody").html("");
        if(x.value != "---") {
            $.ajax({
                url: 'getTrackingData.php',
                type: 'post',

                data: {'name' : x.value},
                success: function(data, status) {
                    var json = JSON.parse(data);
                    var labels = [];
                    $.each( json, function(j, object) {
                        var tableRef = document.getElementById('trackingTable').getElementsByTagName('tbody')[0];

// Create an empty <tr> element and add it to the 1st position of the table:
                        var row = tableRef.insertRow(tableRef.rows.length);

// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);

// Add some text to the new cells:
                        cell1.innerHTML =object.device;
                        cell2.innerHTML = object.durationTime;
                    });
                },
                error: function(xhr, desc, err) {
                    console.log(xhr);
                    console.log("Details: " + desc + "\nError:" + err);
                }
            }); // end ajax call
        }
    }
