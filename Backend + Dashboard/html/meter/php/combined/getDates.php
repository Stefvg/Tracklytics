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
$type = $_GET['type'];
$device = $_GET['device'];
$version = $_GET['version'];
$versionNumber = $_GET['versionNumber'];
$min = $_GET['min'];
$max = $_GET['max'];

if($min && $max) {
    $query = "SELECT DISTINCT date FROM Meter_View WHERE type='$type' AND device ='$device' AND version='$version' AND DATE(date) <='$max' AND DATE(date) >= '$min' AND appName='$app' ORDER BY date ASC";
}else {
    $query = "SELECT DISTINCT date FROM Meter_View WHERE type='$type' AND device ='$device' AND version='$version' AND appName='$app' ORDER BY date ASC";
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


$outArray = array();
    foreach($outputArray as $value){
        $tempObject['versionNumber'] = $versionNumber;
        $tempObject['date'] = $value;
        array_push($outArray, $tempObject);
    }



$object['array'] = $outArray;
$object['labels'] = $array;
$object['offset'] = $offset;

$output[$number] = $object;
echo(json_encode($output));


?>