import { useState , useEffect  } from 'react'
import $ from "jquery";
import axios from "axios";
import AllList from './AllList'
import AddNewProject from './AddNewProject'
function Dashboard() {
  const [showAll, setshowAll] = useState(true);
  const [addNewProject, setaddNewProject] = useState(false);
  const [ViewProject, setViewProject] = useState(false);
  const [ListData, setListData] = useState('');

  const [message, setMessage] = useState('');

  const neeProjetc = () => {
    setaddNewProject(true);
    setshowAll(false);
    setViewProject(false);
  };

  const addProject = (e) => {
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
        if(JSON.parse(data).status == 200) {
          setaddNewProject(false);
          setshowAll(true);
          setViewProject(false);
          getAllProjects();
          setMessage(JSON.parse(data).message);
        } else {
          console.log(data);
        }
      },
    });
  };

  const getAllProjects = async () => {
      try {
          const response = await axios.get("http://localhost:3000/getallprojects.php", {
              withCredentials: true,
          });
          if(response.data.status == 200 ){
            setListData(response.data.project_data);
          } else {
            setListData([]);
          }
      } catch (error) {
          console.error("Error fetching projects:", error);
          setListData([]);
      }
  };
  const logOut = async () => {
    try {
        const response = await axios.get("http://localhost:3000/logout.php", {
            withCredentials: true,
        });
        window.location.reload();
    } catch (error) {
        console.error("Error fetching session:", error);
    }
  };

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage('');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  useEffect(() => {
    getAllProjects();
  }, []); 

  return (
    <>
      <nav>
        <ul>
          <li><a className='app-title' href="/">To-Do</a></li>
        </ul>
        <ul>
          <li> <button type='button' className="secondary"> <a href='/'>Go Back</a></button></li>
          <li><button className="primary" onClick={neeProjetc} >Add New Project</button></li>
          <li><button className="outline" onClick={logOut}>Logout</button></li>
        </ul>
      </nav>
      { message != '' ? <h3 className='success-message'>{message}</h3> : ''}
      <main className="container-fluid">
        { showAll ? <AllList getAllProjects={getAllProjects} ListData = {ListData} /> : ''}
        { addNewProject ? <AddNewProject addProject={addProject} /> : ''}
      </main>
    </>
  )
}

export default Dashboard
