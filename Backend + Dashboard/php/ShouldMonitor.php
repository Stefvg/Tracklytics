<?php
/**
 * Created by PhpStorm.
 * User: stefvangils
 * Date: 30/03/16
 * Time: 14:47
 */

include_once 'Database.php';

$conn = getDatabase();

$appCode = $_GET['app'];
$query = "SELECT shouldMonitor FROM Apps WHERE name='$appCode'";
$result = mysql_query($query);

$row = mysql_fetch_assoc($result);
echo $row['shouldMonitor'];