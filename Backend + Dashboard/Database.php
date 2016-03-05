<?php

function getDatabase() {
	$servername = "localhost";
	$username = "root";
	$password = "Rscanderlecht1993";
	$db_name = "thesis";
	// Create connection
	$conn = mysql_connect("$servername", "$username", "$password")or die("cannot connect");
	mysql_select_db("$db_name")or die("cannot select DB");

	
	return  $conn; 
}

?>