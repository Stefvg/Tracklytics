<?php

include_once 'Database.php';
    $conn = getDatabase();
	
	
	
	$query = "SELECT name, COUNT(*) AS count FROM Button GROUP BY name ORDER BY name ASC";
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