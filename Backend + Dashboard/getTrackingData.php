<?php
/**
 * Created by PhpStorm.
 * User: stefvangils
 * Date: 31/10/15
 * Time: 16:50
 */


include_once 'Database.php';
$conn = getDatabase();

$name = $_POST['name'];

$query = "SELECT device, AVG(durationTime) AS durationTime FROM Tracker WHERE name='$name' GROUP BY device ORDER BY device ASC";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}


$array = array();

while ($row = mysql_fetch_assoc($result)) {
    array_push($array, $row);
}





echo(json_encode($array));


?>