<?php
/**
 * Created by PhpStorm.
 * User: stefvangils
 * Date: 31/10/15
 * Time: 16:27
 */

include_once '../../../../php/Database.php';
$conn = getDatabase();

$app = $_GET['app'];
$number = $_GET['number'];
$number2 = $_GET['number2'];
$number3 = $_GET['number3'];

$type = $_GET['type'];
$date = $_GET['date'];
$device = $_GET['device'];
$version = $_GET['version'];

if(strlen($date) <= 10){
    $query = "SELECT AVG(value) AS avg FROM Meter_View WHERE type='$type' AND date='$date' AND device='$device' AND version='$version' AND appName='$app'";
}else {
    $nextDate = strtotime($date) + 3*3600;
    $nextDate = date("Y-m-d H:i:s", $nextDate);
    $query = "SELECT AVG(value) AS avg FROM Meter_View WHERE type='$type' AND date >= '$date' AND date <= '$nextDate' AND device='$device' AND version='$version' AND appName='$app'";
}



$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}


$row = mysql_fetch_assoc($result);
$object['avg'] = doubleval($row['avg']);
$object['number2'] = $number2;
$object['number3'] = $number3;
$output[$number] =  $object;

echo(json_encode($output));


?>