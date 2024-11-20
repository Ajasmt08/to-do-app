<?php
//Includes
require "server.php";
require "db.php";

if($_SERVER['REQUEST_METHOD'] === 'POST') {
  $email = $_POST['email'];
  $password = $_POST['password'];
  $DB->userLogin($email,$password);
}
?>