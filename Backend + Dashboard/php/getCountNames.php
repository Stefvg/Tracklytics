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

$query = "SELECT DISTINCT name FROM Counter_View WHERE type='$type' AND appName='$app' GROUP BY name ORDER BY name ASC";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}


$array = array();

while ($row = mysql_fetch_assoc($result)) {
    array_push($array, $row['name']);
}
$output['number'] = $number;
$output['array'] = $array;

echo(json_encode($output));


?>