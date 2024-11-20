<?php
//Includes
require "server.php";
require "db.php";

if($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = $_POST['name'];
  $email = $_POST['email'];
  $password = $_POST['password'];
  $DB->createUser($name,$email,$password);
}

?>