/**
 * Created by stefvangils on 1/11/15.
 */
$(function() {
    $.ajax({
        url: 'getDifferentNetworkingNames.php',
        type: 'post',

        //data: {'taxiID' : encodeURIComponent(taxi)},
        success: function (data, status) {

            var json = JSON.parse(data);
            var labels = [];
            $.each( json, function(j, object) {
                $.ajax({
                    url: 'getNetworkingData.php',
                    type: 'post',

                    data: {'name' : object.name},
                    success: function (data, status) {
                        addToTable(object.name, data);

                    },
                    error: function (xhr, desc, err) {
                        console.log(xhr);
                        console.log("Details: " + desc + "\nError:" + err);
                    }
                });
            });
        },
        error: function (xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
        }
    }); // end ajax call

});


function addToTable(label, data){
    var json = JSON.parse(data);
    var tableRef = document.getElementById('networkingTable');

    var header = tableRef.insertRow(tableRef.rows.length);
    var headerCell = header.insertCell(0);
    headerCell.innerHTML = "<h3>" + label + "</h3>";

    var headerRow = tableRef.insertRow(tableRef.rows.length);
// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var headerCell1 = headerRow.insertCell(0);
    var headerCell2 = headerRow.insertCell(1);
    var headerCell3 = headerRow.insertCell(2);
// Add some text to the new cells:
    headerCell1.innerHTML = "<h4>Device</h4>";
    headerCell2.innerHTML = "<h4>Connection Type</h4>";
    headerCell3.innerHTML = "<h4>Duration Time</h4>";

    $.each( json, function(j, object) {


// Create an empty <tr> element and add it to the 1st position of the table:
        var row = tableRef.insertRow(tableRef.rows.length);

// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);

// Add some text to the new cells:
        cell1.innerHTML =object.device;
        cell2.innerHTML =object.connectionType;
        cell3.innerHTML = object.durationTime;
    });


}