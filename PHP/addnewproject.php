<?php
//Includes
require "server.php";
require "db.php";


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $project_name = $_POST['project_name'];
    $tasks = array_filter($_POST, function($key) {
      return strpos($key, 'task_') === 0; // Check if the key starts with "task_"
  }, ARRAY_FILTER_USE_KEY);
    // $taskCount = count($tasks);
    $DB->createProject($project_name,$tasks);

}
?>