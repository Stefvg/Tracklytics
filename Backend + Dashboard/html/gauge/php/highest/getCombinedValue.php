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
$type = $_GET['type'];
$query = "SELECT name,value FROM Gauge_View WHERE appName='$app' AND type='$type' ORDER BY value DESC";



$result = mysql_query($query);
if (!$result) {
    die('Invalid query: ' . mysql_error());
}

$array = array();

$arrayToGetMedianFrom = array();
while ($row = mysql_fetch_assoc($result)) {

    if(!$arrayToGetMedianFrom[$row['name']]){
        $arrayToGetMedianFrom[$row['name']] = array($row['value']);
    }else {
        $tempArray = $arrayToGetMedianFrom[$row['name']];
        array_push($tempArray, $row['value']);
        $arrayToGetMedianFrom[$row['name']] = $tempArray;
    }
}

foreach ($arrayToGetMedianFrom as $key => $value) {
    $tempArray = $value;
    $object['name'] = $key;
    $object['highest'] = $tempArray[0];
    array_push($array, $object);
    $object =[];
}

echo(json_encode($array));
//echo(json_encode($arrayToGetMedianFrom));

?>