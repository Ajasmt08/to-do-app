<?php
session_start();
class Database {
    private $servername = "servername";
    private $username = "username";
    private $password = "password";
    private $db = "to-do-app";
    public $conn;

    public function __construct() {
        $this->connect();
    }

    private function connect() {
        $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->db);
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }
    public function close() {
        if ($this->conn) {
            $this->conn->close();
            echo "Connection closed";
        }
    }
    
    public function createUser($name,$email,$password) {
      if($this->isUserExist($email)) { 
        echo json_encode(['status' => 401,'message' => 'This Email is Already in use']);
        return;
      }

      $sql = "INSERT INTO users (name, email, password) VALUES ('$name', '$email', SHA1('$password'))";

      if ($this->conn->query($sql) === TRUE) {
        echo json_encode(['status' => 200]);
        $last_id = $this->conn->insert_id;
        $_SESSION['email'] = $email;
        $_SESSION['user_id'] = $last_id;
      } else {
        echo json_encode(['status' => 404]);
      }
    }

    public function userLogin($email,$password){
      if(!$this->isUserExist($email)) { 
        echo json_encode(['status' => 404 , 'message' => 'Invalid Used Name or Password']);
      }
      $sql = "SELECT * FROM `users` WHERE `email` LIKE '$email' AND `password` LIKE SHA1('$password')";
      $result = $this->conn->query($sql);
      if ($result->num_rows > 0) {
          while ($row = $result->fetch_assoc()) {
              $_SESSION['email'] = $row["email"];
              $_SESSION['user_id'] = $row["id"];
          }
          echo json_encode(['status' => 200 , 'message' => 'successfully Logged In']);
      } else {
        echo json_encode(['status' => 404 , 'message' => 'Invalid Used Name or Password']);
      }
    }

    private function isUserExist($email){
      $sql = "SELECT * FROM users WHERE email LIKE '$email'";
      $result = mysqli_query($this->conn, $sql);
      if (mysqli_num_rows($result) > 0) {
        return true;
      } else {
        return false;
      }
    }

    public function isUserLoggedIn() {
      if(isset($_SESSION['email'])){
        return true;
      }
      return false;
    }

    public function createProject($project_name,$tasks) {
      $user_id = $_SESSION['user_id'];
      $sql = "INSERT INTO projects (name, user_id) VALUES ('$project_name', $user_id)";
      if ($this->conn->query($sql) === TRUE) {
        $project_id = $this->conn->insert_id;
        $this->addTasks($tasks,$project_id);
        echo json_encode(['status' => 200 , "message" => "New Project Added"]);
      } else {
        echo "Error: " . $sql . "<br>" . $this->conn->error;  
        echo json_encode(['status' => 404]);
      }
    }

    public function addTasks($tasks,$project_id) {
      foreach ($tasks as $key => $value) {
        $sql = "INSERT INTO tasks (task, project_id) VALUES ('$value', $project_id)";
        if ($this->conn->query($sql) === TRUE) {
          // 
        } else {
          echo "Error: " . $sql . "<br>" . $this->conn->error;  
          echo json_encode(['status' => 404]);
        }
      }
    }

    public function getAllProjects() {
      $user_id = $_SESSION['user_id'];
      $sql = "SELECT * FROM projects where user_id = $user_id";
      $result = $this->conn->query($sql);
      $resultArrray = array();
      if ($result->num_rows > 0) {
          while ($row = $result->fetch_assoc()) {
            $resultArrray[] = $row;
          }
          echo json_encode(['status' => 200 , 'message' => 'successfully Logged In' , 'project_data' => $resultArrray]);
      } else {
        echo json_encode(['status' => 404 , 'message' => 'Invalid Used Name or Password']);
      }
    }
    public function getAllTasks($project_id,$return = 0){
      $sql = "SELECT tasks.*, projects.name FROM tasks INNER JOIN projects ON tasks.project_id = projects.id WHERE tasks.project_id = $project_id ORDER BY tasks.status ASC;";
      $result = $this->conn->query($sql);
      $resultArrray = array();
      if ($result->num_rows > 0) {
          while ($row = $result->fetch_assoc()) {
            $resultArrray[] = $row;
          }
          if ($return == 1) {
              return $resultArrray;
          } else {
              echo json_encode(['status' => 200, 'message' => 'success', 'project_data' => $resultArrray]);
          }
      } else {
        echo json_encode(['status' => 404 , 'message' => 'Something went wrong']);
      }
    }

    public function updateProject($project_id,$project_name,$tasks,$status) {
      $sql ="UPDATE `projects` SET `name` = '$project_name' WHERE `projects`.`id` = $project_id";
      $result = $this->conn->query($sql);
      if ($this->conn->query($sql) === TRUE) {
        $this->updateTasks($tasks,$status);
        echo json_encode(['status' => 200 , 'message' => 'Project Updated']);
      } else {
        echo json_encode(['status' => 400 , 'message' => 'Project Updation Failed']);
      }
    }

    public function updateTasks($tasks,$status) {
      foreach ($tasks as $key => $value) {
        $exp_key = explode("_", $key);
        $task_id = $exp_key[1];
        $sql = "UPDATE tasks SET task = '$value' WHERE tasks.id = $task_id";
        if ($this->conn->query($sql) === TRUE) {
          $this->updateTaskStatus($status);
        } else {
          echo json_encode(['status' => 400 , 'message' => 'Project Updation Failed']);
        }
      }
    }

    public function updateTaskStatus($status) {
      foreach ($status as $key => $value) {
        $value = $value=='on' ? 1 : 0;
        $exp_key = explode("_", $key);
        $task_id = $exp_key[1];
        $sql = "UPDATE tasks SET status = '$value' WHERE tasks.id = $task_id";
        if ($this->conn->query($sql) === TRUE) {
          // 
        } else {
          echo json_encode(['status' => 400 , 'message' => 'Project Updation Failed']);
        }
      }
    }
    public function deleteProject($project_id) {
      $delete_project = "DELETE FROM projects WHERE projects.id = $project_id";
      $delete_tasks = "DELETE FROM tasks WHERE tasks.project_id = $project_id";
      if ($this->conn->query($delete_project) === TRUE && $this->conn->query($delete_tasks) === TRUE) {
        echo json_encode(['status' => 200 , 'message' => 'Project Deleted']);
      } else {
        echo json_encode(['status' => 400 , 'message' => 'Project Updation Failed']);
      }
    }
    public function projectReport($project_id) {
      $sql = "SELECT * FROM projects where id = $project_id";
      $result = $this->conn->query($sql);
      $resultArrray = array();
      if ($result->num_rows > 0) {
          while ($row = $result->fetch_assoc()) {
            $resultArrray[] = $row;
          }
          $this->convertToMd($resultArrray,$this->getAllTasks($project_id,1));
      } else {
        echo json_encode(['status' => 404 , 'message' => 'Invalid Used Name or Password']);
      }
    }
    //Count completed task
    public function countCompltedTasks($tasks) {
      $filtered = array_filter($tasks, function($item) {
        return isset($item['status']) && $item['status'] == 1;
      });
      return count($filtered);
    }
    public function completedTasks($tasks) {
      $completed = array_filter($tasks, function($item) {
        return isset($item['status']) && $item['status'] == 1;
      });
      return $completed;
    }
    public function pendingTasks($tasks) {
      $pending = array_filter($tasks, function($item) {
        return isset($item['status']) && $item['status'] == 0;
      });
      return $pending;
    }

    public function convertToMd($project , $tasks) {
      $project_name = $project[0]["name"];
      $heading = "# ".$project_name."\n";
      $total = count($tasks);
      $completed = $this->countCompltedTasks($tasks);
      $pending = $completed - $total;
      $summary = "### Summary : $completed/$total todos completed\n";
      $pendingHead = "## Pending\n";
      $completedHead = "## Completed\n";
      $pendingTasks = '';
      $completedTasks = '';
      foreach ($this->pendingTasks($tasks) as $key => $value) {
        $pendingTasks .= "  - [ ] ".$value['task']."\n";
      }
      foreach ($this->completedTasks($tasks) as $key => $value) {
        $completedTasks .= "  - [x] ".$value['task']."\n";
      }
      $md = $heading.$summary.$pendingHead.$pendingTasks.$completedHead.$completedTasks;
      $filePath = "project_report/".$project_name."_report.md";
      $this->createDirectoryIfNeeded($filePath);
      // Save file
      if (file_put_contents($filePath, $md)) {
          echo json_encode(['status' => 200 , 'message' => "Markdown file created successfully at: $filePath"]);
        } else {
          echo json_encode(['status' => 400 , 'message' => "Error generating report"]);
      }
    }
    public function createDirectoryIfNeeded($path) {
      $directory = dirname($path);
      if (!is_dir($directory)) {
          if (mkdir($directory, 0777, true)) {
              //Directory created successfully
          } else {
              // Failed to create directory
          }
      } else {
          // Directory already exists
      }
  }



}
$DB = new Database;
?>
