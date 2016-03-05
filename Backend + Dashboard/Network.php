<?php
include_once 'Database.php';

require __DIR__ . '/vendor/autoload.php';
use crodas\InfluxPHP\Client;
use crodas\InfluxPHP\DB;
use crodas\InfluxPHP\MultipleResultSeriesObject;
use crodas\InfluxPHP\ResultSeriesObject;

$client = new \crodas\ \Client(
    "localhost" /*default*/,
    8086 /* default */,
    "root" /* by default */,
    "root" /* by default */
);
$db = $client->getDatabase("thesis");
$conn = getDatabase();

$name = $_POST['name'];

$device = $_POST['device'];
$date = $_POST['date'];
$durationTime = $_POST['durationTime'];
$connectionType = $_POST['connectionType'];

$query = "INSERT INTO Networking(name, durationTime, date, device, connectionType) VALUES('$name', '$durationTime', '$date', '$device', '$connectionType')";
$result = mysql_query($query);

$date= date("Y-m-d h:i:s", strtotime($date));
$data = array(array('tags' => array('device' => $device, 'name' => $name),
    'fields' => array('value' => $durationTime),
    'time' => date("c", strtotime($date))));
$db->insert('networking', $data);

echo("SUCCESS");

?>