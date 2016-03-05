<?php
	
include_once 'Database.php';
require __DIR__ . '/vendor/autoload.php';
use crodas\InfluxPHP\Client;
use crodas\InfluxPHP\DB;
use crodas\InfluxPHP\MultipleResultSeriesObject;
use crodas\InfluxPHP\ResultSeriesObject;

$client = new \crodas\InfluxPHP\Client(
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
        
        $query = "INSERT INTO Button(name, date, device) VALUES('$name', '$date', '$device')";
	$result = mysql_query($query);
        
$date= date("Y-m-d h:i:s", strtotime($date));
$data = array(array('tags' => array('device' => $device, 'name' => $name),
            'fields' => array('value' => 1),
            'time' => date("c", strtotime($date))));
$db->insert('button', $data);

echo("SUCCESS");

?>