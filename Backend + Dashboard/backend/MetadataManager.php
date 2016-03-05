<?php
/**
 * Created by PhpStorm.
 * User: stefvangils
 * Date: 19/11/15
 * Time: 21:53
 */
include_once '../php/Database.php';

function getMetadataID(){
    $conn = getDatabase();
    $appCode = $_POST['appCode'];
    $device = $_POST['device'];
    $connectionType = $_POST['connectionType'];
    $bundleID = $_POST['bundleID'];
    $version = $_POST['version'];
    $query = "SELECT * FROM Metadata WHERE appCode='$appCode' AND device='$device' AND connectionType='$connectionType' AND bundleID='$bundleID' AND version='$version'";
    $result = mysql_query($query);

    if(mysql_num_rows($result) == 0){
        $query = "INSERT INTO Metadata(appCode, device, connectionType, bundleID, version) VALUES('$appCode','$device','$connectionType','$bundleID','$version')";
        $result = mysql_query($query);
        return mysql_insert_id();
    }else {
        $row = mysql_fetch_assoc($result);
        return $row['id'];
    }

}