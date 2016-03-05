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
$value = $_GET['value'];
$device = $_GET['device'];
$version = $_GET['version'];
$offset = $_GET['offset'];
$maxValue = $value + $offset;


if($offset == 0){
    $query = "SELECT COUNT(*) AS count FROM Histogram_View WHERE type='$type' AND value='$value' AND device='$device' AND version='$version' AND appName='$app'";
}else {
    $query = "SELECT COUNT(*) AS count FROM Histogram_View WHERE type='$type' AND value>='$value' AND value<'$maxValue' AND device='$device' AND version='$version' AND appName='$app'";
}
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}


$row = mysql_fetch_assoc($result);
$object['count'] = intval($row['count']);
$object['number2'] = $number2;
$object['number3'] = $number3;
$output[$number] =  $object;

echo(json_encode($output));


?>