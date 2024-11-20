<?php
//Includes
require "server.php";
require "db.php";
// Unset all session variables
session_unset();
echo "Logout";
// Destroy the session , AKS Logout
session_destroy();

?>