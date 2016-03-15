<?php
/**
 * Created by PhpStorm.
 * User: stefvangils
 * Date: 31/10/15
 * Time: 16:27
 */

include_once 'Database.php';
$conn = getDatabase();

$app = $_GET['app'];
$number = $_GET['number'];
$number2 = $_GET['number2'];
$type = $_GET['type'];
$date = $_GET['date'];
$offset = $_GET['offset'];
$maxValue = $value + $offset;



if(strlen($date) <= 10){
    $query = "SELECT AVG(value) AS avg FROM Meter_View WHERE type='$type' AND DATE(date)='$date' AND appName='$app'";
}else {
   // $tmpDate = date("Y-m-d H:i:s", $date);
    $nextDate = strtotime($date) + 3*3600;
    $nextDate = date("Y-m-d H:i:s", $nextDate);
    $query = "SELECT AVG(value) AS avg FROM Meter_View WHERE type='$type' AND date >= '$date' AND date <= '$nextDate' AND appName='$app'";
}


$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}




$row = mysql_fetch_assoc($result);
$object['avg'] = doubleval($row['avg']);
$object['number2'] = $number2;
$output[$number] =  $object;

echo(json_encode($output));


?>