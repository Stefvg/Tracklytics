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
    $query = "SELECT DISTINCT value FROM Histogram_View WHERE type='$type' AND device ='$device' AND version='$version' AND value>='$min' AND value <= '$max' AND appName='$app' ORDER BY value ASC";
}else {
    $query = "SELECT DISTINCT value FROM Histogram_View WHERE type='$type' AND device ='$device' AND version='$version' AND appName='$app' ORDER BY value ASC";
}
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}


$array = array();

while ($row = mysql_fetch_assoc($result)) {
    array_push($array, doubleval($row['value']));
}
$first = $array[0];
$last = $array[sizeof($array) - 1];

$offset = ($last - $first)/19; //20 buckets


$outputArray = array();
if($offset>0){

    $temp = $first;
    for($i=0; $i<20; $i++){
        $tempObject['versionNumber'] = $versionNumber;
        $tempObject['value'] = $temp;
        array_push($outputArray, $tempObject);
        $temp += $offset;
    }
}else {
    foreach($array as $value){
        $tempObject['versionNumber'] = $versionNumber;
        $tempObject['value'] = $value;
        array_push($outputArray, $tempObject);
    }
}


$object['array'] = $outputArray;
$object['offset'] = $offset;

$output[$number] = $object;
echo(json_encode($output));



?>