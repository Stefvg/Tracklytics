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
$query = "SELECT name,AVG(value) as mean FROM Gauge_View WHERE appName='$app' AND type='$type' GROUP BY name";



$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}

$array = array();
while ($row = mysql_fetch_assoc($result)) {
    $object['name'] = $row['name'];
    $object['mean'] = doubleval($row['mean']);
    array_push($array, $object);
}

//$output['number'] = $number;


echo(json_encode($array));


?>