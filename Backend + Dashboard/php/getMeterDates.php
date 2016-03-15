<?php
/**
 * Created by PhpStorm.
 * User: stefvangils
 * Date: 31/10/15
 * Time: 16:27
 */

include_once 'Database.php';
$conn = getDatabase();

$number = $_GET['number'];
$type = $_GET['type'];
$app = $_GET['app'];

$min = (string)$_GET['min'];
$max = (string)$_GET['max'];



if($min && $max){
    $query = "SELECT DISTINCT date FROM Meter_View WHERE type='$type' AND DATE(date) <='$max' AND DATE(date) >= '$min' AND appName='$app' ORDER BY date ASC";
}else {
    $query = "SELECT DISTINCT date FROM Meter_View WHERE type='$type' AND appName='$app' ORDER BY date ASC";
}


$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}


$array = array();

while ($row = mysql_fetch_assoc($result)) {
    $date = $row['date'];
    $date = date("Y-m-d", strtotime($date));
    array_push($array, ($date));
}

$array = array_values(array_unique($array));
$outputArray = $array;
if(sizeof($array) < 3){
    $outputArray = [];
    for($i=0; $i<sizeof($array); $i++){
        $date = $array[$i];
        for($j=0;$j<8;$j++){
            $newDate = strtotime($date) + $j*3*3600;
            $newDate = date("Y-m-d H:i:s", $newDate);
            array_push($outputArray, $newDate);
        }
    }
}


$object['array'] = $outputArray;
$object['labels'] = $array;

$output[$number] = $object;


echo(json_encode($output));


?>