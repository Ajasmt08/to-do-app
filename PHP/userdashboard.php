<?php
//Includes
require "server.php";
require "db.php";

if(!$DB->isUserLoggedIn()) {
  echo json_encode(['status' => 401, 'message' => 'User is not logged in']);
  return;
}
echo json_encode(['status' => 200, 'message' => 'User is logged in']);
?>

