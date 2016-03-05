<?php
/**
 * Created by PhpStorm.
 * User: stefvangils
 * Date: 31/10/15
 * Time: 20:46
 */


include_once 'Database.php';
    $conn = getDatabase();



	$query = "SELECT name, COUNT(*) AS count FROM Screen GROUP BY name ORDER BY COUNT(*) DESC";
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