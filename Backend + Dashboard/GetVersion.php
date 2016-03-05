<?php
	include_once 'Database.php';
	$conn = getDatabase();

	$device = $_POST['device'];
	$query = "SELECT * FROM Version";
	$result = mysql_query($query);
		while ($row = mysql_fetch_assoc($result)) {
				if($row['device'] == $device) {
					$version = $row['version'];
				}elseif($row['device'] == "default") {
					$defaultVersion = $row['version'];
				}
		}
		
		
		if(!$version) {
			echo($defaultVersion);
		}else {
			echo($version);
		}
?>	