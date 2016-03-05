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
$device = $_GET['device'];
$version = $_GET['version'];
$connectionType = $_GET['connectionType'];



$query = "SELECT name,AVG(durationTime) AS durationTime FROM Timer_View WHERE type='$type' AND device='$device' AND version='$version' AND connectionType='$connectionType' AND appName='$app' ";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}


$array = array();

while ($row = mysql_fetch_assoc($result)) {
    $object['name'] = $row['name'];
    $object['durationTime'] = doubleval($row['durationTime']);
    array_push($array, $object);
}

$outputObject['array'] = $array;
$outputObject['number2'] = $number2;
$outputObject['number3'] = $number3;
//$output['number'] = $number;
$output[$number] = $outputObject;

echo(json_encode($output));


?>