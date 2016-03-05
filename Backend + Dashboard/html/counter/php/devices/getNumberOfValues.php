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
$type = $_GET['type'];
$name = $_GET['name'];
$device = $_GET['device'];

$query = "SELECT SUM(value) AS count FROM Counter_View WHERE appName='$app' AND type='$type' AND name='$name' AND device='$device'";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}


$row = mysql_fetch_assoc($result);
$object['count'] = intval($row['count']);
$object['number2'] = $number2;
$output[$number] =  $object;

echo(json_encode($output));


?>