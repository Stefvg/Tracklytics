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

$query = "SELECT DISTINCT name FROM Counter_View WHERE appName='$app' AND type='$type' AND device ='$device' AND version='$version' ORDER BY name ASC";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}


$array = array();

while ($row = mysql_fetch_assoc($result)) {
    $object['name'] = $row['name'];
    $object['versionNumber'] = $versionNumber;

    array_push($array, $object);
}
$output[$number] = $array;

echo(json_encode($output));


?>