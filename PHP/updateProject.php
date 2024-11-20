<?php
//Includes
require "server.php";
require "db.php";

if($_SERVER['REQUEST_METHOD'] === 'POST') {
  $project_id = $_POST['project_id'];
  $project_name = $_POST['project_name'];
  $tasks = array_filter($_POST, function($key) {
      return strpos($key, 'task_') === 0;
  }, ARRAY_FILTER_USE_KEY);
  $status = array_filter($_POST, function($key) {
    return strpos($key, 'status_') === 0;
  }, ARRAY_FILTER_USE_KEY);
    //Adding new tasks
    $DB->updateProject($project_id,$project_name,$tasks,$status);
    $new_tasks = array_filter($_POST, function($key) {
        return strpos($key, 'new_task_') === 0;
    }, ARRAY_FILTER_USE_KEY);
    $DB->addTasks($new_tasks,$project_id);
}
?>