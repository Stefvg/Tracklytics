<?php
include_once '../php/Database.php';

$conn = getDatabase();
/**
 * Created by PhpStorm.
 * User: stefvangils
 * Date: 5/12/15
 * Time: 17:13
 */

$name = "test";
$data = [1,2,3];
$data = serialize($data);
$query = "INSERT INTO Evaluation(name, data) VALUES('$name', '$data')";
$result = mysql_query($query);


$query = "SELECT * FROM Evaluation WHERE name = 'test'";
$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}

$row = mysql_fetch_assoc($result);
$data = $row['data'];
$dataUns = unserialize($data);

foreach($dataUns as $value)
    echo $value ."\n";