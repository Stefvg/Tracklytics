<?php

include_once '../php/Database.php';
include 'MetadataManager.php';

$conn = getDatabase();

$type = $_POST['type'];
$name = $_POST['name'];
$durationTime = $_POST['durationTime'];
$date = $_POST['date'];

$databaseID = $_POST['databaseID'];

$metadataID = getMetadataID();

if($databaseID=="") {
    $query = "INSERT INTO Timer(type, name, durationTime, date, metadataID) VALUES('$type','$name', '$durationTime','$date', '$metadataID')";
    $result = mysql_query($query);
    $id = mysql_insert_id();
    echo($id . "#SUCCESS");
}else {
    $query = "UPDATE Timer SET durationTime='$durationTime', metadataID='$metadataID' WHERE id='$databaseID'";
    $result = mysql_query($query);
    echo($databaseID . "#SUCCESS");
}

?>