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

$query = "SELECT name,AVG(durationTime) AS durationTime FROM Timer_View WHERE type='$type' AND device='$device'";
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

//$output['number'] = $number;
$output[$number] = $array;

echo(json_encode($output));


?>