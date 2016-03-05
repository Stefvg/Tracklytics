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

$min = $_GET['min'];
$max = $_GET['max'];

if($min && $max){
    $query = "SELECT DISTINCT value FROM Histogram_View WHERE type='$type' AND value <='$max' AND value >= '$min' AND appName='$app' ORDER BY value ASC";
}else {
    $query = "SELECT DISTINCT value FROM Histogram_View WHERE type='$type' AND appName='$app' ORDER BY value ASC";
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


if($offset>0){
    $outputArray = array();
    $temp = $first;
    for($i=0; $i<20; $i++){
        array_push($outputArray, $temp);
        $temp += $offset;
    }
}else {
    $outputArray = $array;
}


$object['array'] = $outputArray;
$object['offset'] = $offset;

$output[$number] = $object;


echo(json_encode($output));


?>