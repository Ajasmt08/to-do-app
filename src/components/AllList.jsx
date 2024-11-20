import React from 'react';
import { useState , useEffect  } from 'react'
import $ from "jquery";
import axios from "axios";
function AllList(props) {
  const { ListData } = props; 
  const [modalStaus, setModalStatus] = useState('');

  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState({ id: '', name: '' });
  const [formState, setFormState] = useState({});
  const [message, setMessage] = useState('');
  const [tasks, setTasks] = useState([{ name: 'new_task_1' }]);
  
  const openProject = (event) => {
    const project_id = event.target.dataset.id;
    const project_name = event.target.dataset.name;
    console.log(project_id);
    setModalStatus('open');
    getProjectTasks(project_id);
    setSelectedProject({id: project_id, name: project_name});
  };

  const getProjectTasks = async (project_id) => {
    try {
      const response = await axios.get(`http://localhost:3000/getprojecttasks.php`, {
        params: {
          project_id: project_id,
        },
      });
      console.log('Project Tasks:', response.data.project_data);
      setSelectedTasks(response.data.project_data || []);
    } catch (error) {
      console.error('Error fetching project tasks:', error);
    }
  };
  
  const handleChange = (ev, id) => {
    const { name, value, type, checked } = ev.target;
    
    setFormState(prev_state => ({
      ...prev_state,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (name.startsWith('task_') || name.startsWith('status_')) {
      setSelectedTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id 
            ? {
                ...task, 
                task: name.startsWith('task_') ? value : task.task,
                status: name.startsWith('status_') ? (checked ? '1' : '0') : task.status
              }
            : task
        )
      );
    }

    if (name === 'project_name') {
      setSelectedProject(prev => ({
        ...prev,
        name: value
      }));
    }
  }
  const closeProject = () => {
    setModalStatus('');
    setSelectedProject([])
  };

  const updateProject = (e) => {
    e.preventDefault();
    const form = $(e.target);
    $.ajax({
      type: "POST",
      url: form.attr("action"),
      data: form.serialize(),
      xhrFields: {
        withCredentials: true, 
      },
      success(data) {
        console.log(data);
        if(JSON.parse(data).status == '200' ||  JSON.parse(data).status == 200) {
          setMessage(JSON.parse(data).message);
          props.getAllProjects();
          closeProject();
          setTasks([]);
        } else {
          // 
        }
       },
    });
  }; 

  const deleteProject = async (event) => {
    const project_id = event.target.value;
  
    try {
      const response = await axios.get(`http://localhost:3000/deleteProject.php`, {
        params: {
          project_id: project_id,
        },
      });
      console.log(response);
      if (response.status == 200) {
        setMessage(response.data.message);
        props.getAllProjects(); 
        closeProject();
      } else {
        // 
      }
    } catch (error) {
      console.error("Error deleting the project:", error);
    }
  };
  
  const exportProject = async (event) => {
    const project_id = event.target.value;
    try {
      const response = await axios.get(`http://localhost:3000/exportProject.php`, {
        params: {
          project_id: project_id,
        },
      });
      console.log(response.data);
      if (response.status == 200) {
        setMessage(response.data.message);
        props.getAllProjects(); 
        closeProject();
      } else {
        // 
      }
    } catch (error) {
      console.error("Error deleting the project:", error);
    }
  };

  const addTasks = () => {
    setTasks([...tasks, { name: `new_task_${tasks.length + 1}` }]);
  };
  const removeTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index); 
    setTasks(newTasks);
  };

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage('');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [message]);
  return (
    <>
    { message != '' ? <h3 className='success-message'>{message}</h3> : ''}
      <h2>All Projects</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Created</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {ListData && ListData.length > 0 ? (
            ListData.map((item) => (
              <tr key={item.id}>
                <th scope="row">{item.name}</th>
                <td>{item.created_at}</td>
                <td>
                  <button className='secondary view-button' onClick={openProject} data-id={item.id} data-name={item.name}>View</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No Projects Yet</td>
            </tr>
          )}
        </tbody>
      </table>
      <form action="http://localhost:3000/updateProject.php" method='post' onSubmit={updateProject}>
        <input type="hidden" name='project_id' value={selectedProject.id}  />
        <dialog open={modalStaus}>
          <article>
              <h3><input type="text" name='project_name' value={selectedProject.name} onChange={(ev) => handleChange(ev, selectedProject.id)} /> </h3>
              <h4>Tasks:</h4>
              {selectedTasks.length > 0 ? (
              <div>
              <table>
                  <thead>
                      <tr>
                          <th>Task</th>
                          <th>Status</th>
                      </tr>
                  </thead>
                  <tbody>
                      {selectedTasks.map((task, index) => (
                      <tr key={index}>
                          <td className={task.status == 1 ? 'completed-row' : 'pending-row'}>
                              <input type="text" name={`task_${task.id}`} value={task.task} onChange={(ev) => handleChange(ev, task.id)} />
                            </td>
                          <td className={task.status == 1 ? 'completed-row' : 'pending-row'}>
                              <label>
                              <input type="hidden" name={`status_${task.id}`} value="0" />
                                  <input 
                                    type="checkbox" 
                                    name={`status_${task.id}`} 
                                    checked={task.status === '1'}
                                    onChange={(ev) => handleChange(ev, task.id)}/>
                                  {task.status == 1 ? 'Completed' : 'Pending'}
                              </label>
                          </td>
                      </tr>
                      ))}
                  </tbody>
              </table>
                <div className='new-tasks-wrapper'>
                  <h4>Add New Tasks</h4>
                  {tasks.map((task, index) => (
                    <div key={task.name} className="task-item">
                      <input type="text" name={task.name} placeholder="Task" required/>
                      <button type="button" className="remove-task-btn" onClick={() => removeTask(index)}> Remove </button>
                    </div>
                    ))}
                    <button className="outline add-task-btn" type='button' onClick={addTasks}>Add Tasks</button>
                </div>
              </div>
              ) : (
              <p>No tasks found for this project.</p>
              )}
              <footer>
                  <button type='button' className="outline secondary" value={selectedProject.id} onClick={exportProject} >Export</button>
                  <button type='button' className="error" value={selectedProject.id} onClick={deleteProject}>Delete</button>
                  <button className='secondary'>Update</button>
                  <button className="primary" type='button' onClick={closeProject}>
                      Close
                  </button>
              </footer>
          </article>
      </dialog>
    </form>
      
    </>
  );
}

export default AllList;
