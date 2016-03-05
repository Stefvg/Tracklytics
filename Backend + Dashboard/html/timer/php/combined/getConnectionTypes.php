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

$type = $_GET['type'];
$version = $_GET['version'];
$number = $_GET['number'];
$number2 = $_GET['number2'];
$device = $_GET['device'];

$query = "SELECT DISTINCT connectionType FROM Timer_View WHERE type='$type' AND version='$version' AND device='$device' AND appName='$app' ";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}


$array = array();

while ($row = mysql_fetch_assoc($result)) {
    array_push($array, $row['connectionType']);
}

$outputObject['array'] = $array;
$outputObject['number2'] = $number2;

//$output['number'] = $number;
$output[$number] = $outputObject;

echo(json_encode($output));


?>