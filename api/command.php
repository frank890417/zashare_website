<?php
	// ini_set('display_errors', 1);
	// ini_set('display_startup_errors', 1);
	// error_reporting(E_ALL);
	
	header("Content-Type:text/html; charset=utf-8");
  	header('Access-Control-Allow-Origin: *');  
  	// mb_internal_encoding('UTF-8');

  	
    if (isset($_GET["type"])){

      $type = $_GET["type"];
      $name = $_GET["name"];
      $data = $_GET["data"];

      $get_name_list = Array();
      $get_name_list["attendlist"]="attendlist_json.txt";
      $get_name_list["mapsvg"]="map.svg";

      if($type=="get"){
        foreach ($get_name_list as $key => $value) 
          if ($name==$key) 
            echo file_get_contents($value);
      }else if ($type=="save"){
        foreach ($get_name_list as $key => $value) 
          if ($name==$key) 
            echo file_put_contents($value,$data);
        echo $name." saveok!";
      }
    
    }






?>