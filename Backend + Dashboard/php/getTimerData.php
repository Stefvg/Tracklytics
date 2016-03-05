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

$query = "SELECT name, AVG(durationTime) AS durationTime, device FROM Timer_View WHERE type='$type' AND appName='$app' GROUP BY name, device ORDER BY name ASC";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}


$array = array();

while ($row = mysql_fetch_assoc($result)) {
    $object['name'] = $row['name'];
    $object['durationTime'] = doubleval($row['durationTime']);
    $object['device'] = $row['device'];
    array_push($array, $object);
}

//$output['number'] = $number;
$output[$number] = $array;

echo(json_encode($output));


?>