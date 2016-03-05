<?php
include_once '../php/Database.php';

$conn = getDatabase();
/**
 * Created by PhpStorm.
 * User: stefvangils
 * Date: 5/12/15
 * Time: 17:13
 */

$name = $_POST['name'];
$data = $_POST['data'];


$data = serialize($data);

$query = "INSERT INTO Evaluation(name, data) VALUES('$name', '$data')";
$result = mysql_query($query);