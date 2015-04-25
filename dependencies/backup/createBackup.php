<?php
	$clientes = $_POST["clientes"];
	$tickets = $_POST["tickets"];
	$services = $_POST["services"];
	$users = $_POST["users"];
	$logs = $_POST["logs"];

	date_default_timezone_set('America/Puerto_Rico');
	$today = date("md");
	$dateNow = date("F j, Y");

	$actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
	$path = str_replace("createBackup.php", "system_backup/".$today, $actual_link);
	$folder_path = 'system_backup/'.$today;
	mkdir($folder_path, 0777, true);

	function createBackup($json, $fileName, $path) {
		$array = json_decode($json, true);
		$fileFullName = $path.'/'.$fileName;
		$f = fopen($fileFullName, 'w');

		$firstLineKeys = false;
		foreach ($array as $line) {	
			if (empty($firstLineKeys)) {
				$firstLineKeys = array_keys($line);
				fputcsv($f, $firstLineKeys);
				$firstLineKeys = array_flip($firstLineKeys);
			}
			fputcsv($f, array_merge($firstLineKeys, $line));
		}
	}

	createBackup($clientes, 'clientes.csv', $folder_path);
	createBackup($tickets, 'tickets.csv', $folder_path);
	createBackup($services, 'services.csv', $folder_path);
	createBackup($users, 'users.csv', $folder_path);
	createBackup($logs, 'logs.csv', $folder_path);

	$message = '<html><body>';
	$message .= '<table class="table table-bordered table-hover" cellpadding="10">';
	$message .= "<tr style='background: #eee;'><th colspan='2'><strong>Backup <i>$dateNow</i></strong></th></tr>";
	$message .= "<tr><td>Clientes:</td><td>" . "<a target='_blank' href='".$path.'/clientes.csv'."'>Descargar</a>" . "</td></tr>";
	$message .= "<tr><td>Servicios:</td><td>" . "<a target='_blank' href='".$path.'/services.csv'."'>Descargar</a>" . "</td></tr>";
	$message .= "<tr><td>Tickets:</td><td>" . "<a target='_blank' href='".$path.'/tickets.csv'."'>Descargar</a>" . "</td></tr>";
	$message .= "<tr><td>Usuarios:</td><td>" . "<a target='_blank' href='".$path.'/users.csv'."'>Descargar</a>" . "</td></tr>";
	$message .= "<tr><td>Log:</td><td>" . "<a target='_blank' href='".$path.'/logs.csv'."'>Descargar</a>" . "</td></tr>";
	$message .= "</table>";
	$message .= "</body></html>";

    echo $message;
?>