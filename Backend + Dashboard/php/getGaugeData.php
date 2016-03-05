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
$type = $_GET['type'];

$query = "SELECT name, AVG(value) AS mean, device FROM Gauge_View WHERE type='$type' AND appName='$app' GROUP BY name, device ORDER BY name ASC";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}


$array = array();

while ($row = mysql_fetch_assoc($result)) {
    $object['name'] = $row['name'];
    $object['mean'] = doubleval($row['mean']);
    $object['device'] = $row['device'];
    array_push($array, $object);
}

//$output['number'] = $number;
$output[$number] = $array;

echo(json_encode($output));


?>