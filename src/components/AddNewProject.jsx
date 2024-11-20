import { useState } from 'react';
function AddNewProject(props) {
  const [tasks, setTasks] = useState([{ name: 'task_1' }]);

  const addTasks = () => {
    setTasks([...tasks, { name: `task_${tasks.length + 1}` }]);
  };

  const removeTask = (index) => {
    if (tasks.length > 1) {
      const newTasks = tasks.filter((_, i) => i !== index); 
      setTasks(newTasks);
    } else {
      alert('There Should be Atleast One Task neede to create a project')
    }
  };
  return (
    <>
    <div className="task-wrapper">
      <h1>Add New Project</h1>
      <form action="http://localhost:3000/addnewproject.php" method='post' onSubmit={props.addProject}>
        <label htmlFor="project_name">Project Name</label>
        <input type="text" name="project_name" placeholder="Project Name" required/>
        <div className='new-tasks-wrapper'>
          {tasks.map((task, index) => (
              <div key={task.name} className="task-item">
                <input type="text" name={task.name} placeholder="Task" required/>
                <button type="button" className="remove-task-btn" onClick={() => removeTask(index)}> Remove </button>
              </div>
            ))}
        </div>
        <button className="outline add-task-btn" type='button' onClick={addTasks}>Add Tasks</button>
        <button className="create-project" type='submit'>Create Project</button>
      </form>
    </div>
    </>
  )
}

export default AddNewProject
