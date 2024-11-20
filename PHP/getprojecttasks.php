<?php
//Includes
require "server.php";
require "db.php";

if($_SERVER['REQUEST_METHOD'] === 'GET') {
  $project_id = $_GET['project_id'];
  $DB->getAllTasks($project_id);
}

?>