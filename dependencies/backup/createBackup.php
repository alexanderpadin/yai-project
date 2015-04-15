<?php
	$clientes = $_POST["clientes"];
	$tickets = $_POST["tickets"];
	$services = $_POST["services"];
	$users = $_POST["users"];
	$logs = $_POST["logs"];
	$email = $_POST["email"];


	date_default_timezone_set('America/Puerto_Rico');
	$today = date("md");

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

	$to = $email;
	$subject = 'Backup de Sistema';

	$headers = "From: " . strip_tags("backup@system.com") . "\r\n";
	$headers .= "Reply-To: ". strip_tags("do-not@reply.com") . "\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

	$message = '<html><body>';
	$message .= '<p>Backup automatico del sistema:</p>';
	$message .= '<table rules="all" style="border-color: #666;" cellpadding="10">';
	$message .= "<tr style='background: #eee;'><td><strong>Clientes:</strong> </td><td>" . "<a href='".$path.'/clientes.csv'."'>Descargar</a>" . "</td></tr>";
	$message .= "<tr style='background: #eee;'><td><strong>Servicios:</strong> </td><td>" . "<a href='".$path.'/services.csv'."'>Descargar</a>" . "</td></tr>";
	$message .= "<tr style='background: #eee;'><td><strong>Tickets:</strong> </td><td>" . "<a href='".$path.'/tickets.csv'."'>Descargar</a>" . "</td></tr>";
	$message .= "<tr style='background: #eee;'><td><strong>Usuarios:</strong> </td><td>" . "<a href='".$path.'/users.csv'."'>Descargar</a>" . "</td></tr>";
	$message .= "<tr style='background: #eee;'><td><strong>Log:</strong> </td><td>" . "<a href='".$path.'/logs.csv'."'>Descargar</a>" . "</td></tr>";
	$message .= "</table>";
	$message .= "</body></html>";

	if (mail($to, $subject, $message, $headers)) {
    	echo 'Your message has been sent.';
    } else {
    	echo 'There was a problem sending the email.';
    }

?>