<?php

include_once '../php/Database.php';
include 'MetadataManager.php';

$conn = getDatabase();

$type = $_POST['type'];
$name = $_POST['name'];
$value = $_POST['value'];
$date = $_POST['date'];
$UUID = $_POST['UUID'];

$databaseID = $_POST['databaseID'];

$metadataID = getMetadataID();

if($databaseID=="") {
    $query = "INSERT INTO Meter(type, name, value, date, UUID, metadataID) VALUES('$type','$name','$value', '$date', '$UUID', '$metadataID')";
    $result = mysql_query($query);
    $id = mysql_insert_id();
    echo($id . "#SUCCESS");
}else{
    $query = "UPDATE Meter SET value='$value', metadataID='$metadataID' WHERE id='$databaseID'";
    $result = mysql_query($query);

    echo($databaseID . "#SUCCESS");
}

?>