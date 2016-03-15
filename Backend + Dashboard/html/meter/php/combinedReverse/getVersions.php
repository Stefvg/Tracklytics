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

$device = $_GET['device'];
$number = $_GET['number'];

$query = "SELECT DISTINCT version FROM Meter_View WHERE type='$type' AND device='$device' AND appName='$app' ORDER BY version DESC";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}


$array = array();

while ($row = mysql_fetch_assoc($result)) {
    array_push($array, $row['version']);
}

$output[$number] = $array;
echo(json_encode($output));

?>