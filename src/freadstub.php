<?php

/*
 * This php stub receives a file and stores it in session. Afterward the file can be read 
 * issuing a get request.
 * 
 * The form submitted must contain a 'element' field which contains the file element name
 * we have in the same form.
 * 
 * Please note that reading through a get request destroys the stored data. Not very restful
 * but this stub is designed to be used in single put & get lifecycles for small contents.
 */

$SID = session_id();
if(empty($SID)) session_start() or exit(basename(__FILE__).': Could not start session');

if( isset($_REQUEST) && isset($_REQUEST['element']) )
	$elem = $_REQUEST['element'];

	
// Implicit put
if( empty($_REQUEST['action']) || $_REQUEST['action'] == 'put')
{
	if( empty($elem) ){
		header("Status: 500 Error in the upload phase -- Missing 'element'");
		exit();
	}
	header('Content-length: 0');
	
	unset($_SESSION['vcardfile']);
	unset($_SESSION['vcardfileerror']);
	
	if(isset($_FILES[$elem]))
	{
		if ($_FILES[$elem]["error"] > 0 /*|| !is_uploaded_file($_FILES["vcardfile"]["error"])*/)
		{
			$_SESSION['vcardfileerror'] = $_FILES[$elem]["error"];
		}
		else
		{
			$_SESSION['vcardfile'] = '';
		
			$handle = fopen($_FILES[$elem]["tmp_name"],'rb');
			while (!feof($handle)) {
		  		$_SESSION['vcardfile'] .= fread($handle, 8192);
			}
		}
	}
	else $_SESSION['vcardfileerror'] = 'File not sent';
}

// The get must be explicit
if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'get')
{

	if( isset($_SESSION['vcardfileerror']) )
	{
		if($_SESSION['vcardfileerror'] == 4)
			header("Status: 599 Error in the upload phase -- Missing file");
		else 
			header("Status: 500 Error in the upload phase -- ".$_SESSION['vcardfileerror']);
			
		$_SESSION = array();
		session_destroy();
	}
	else if( isset($_SESSION['vcardfile']) )
	{
		header('Content-Type: plain/text');
		header('Content-Transfer-Encoding: 8bit');
		header('Content-Length: '.strlen($_SESSION['vcardfile']));
	
		echo $_SESSION['vcardfile'];
		$_SESSION = array();
		session_destroy();
	}
	else
	{
		header("Status: 500 Error in the download phase -- No valid session to read.");
	}
}


