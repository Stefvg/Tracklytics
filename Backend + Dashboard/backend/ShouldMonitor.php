<?php
/**
 * Created by PhpStorm.
 * User: stefvangils
 * Date: 30/03/16
 * Time: 14:47
 */

include_once '../php/Database.php';

$conn = getDatabase();

$appCode = $_POST['appCode'];
$query = "SELECT shouldMonitor FROM Apps WHERE code='$appCode'";
$result = mysql_query($query);

$row = mysql_fetch_assoc($result);
echo $row['shouldMonitor'];