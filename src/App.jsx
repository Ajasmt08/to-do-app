import { useState , useEffect  } from 'react'
import './App.css'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Dashbaord from './components/Dashboard'
import $, { data } from "jquery";
import axios from "axios";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showDashBoard, setshowDashBoard] = useState(false);

  const ToggleMenu = (event) => {
    var btn_id = event.target.id;
    if(btn_id =='sign-up-btn') { 
      setShowLogin(false);
      setShowSignUp(true);
    } else { 
      setShowLogin(true);
      setShowSignUp(false);
    }
  };
  const handleSignUp = (e) => {
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
        if(JSON.parse(data).status == '200' ||  JSON.parse(data).status == 200) {
          console.log("Yes")
          setShowLogin(false);
          setShowSignUp(false);
          setshowDashBoard(true);
        } else {
          console.log(data);
        }
      },
    });
  };
  const handleLogin = (e) => {
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
          setshowDashBoard(true);
        } else {
          setshowDashBoard(false);
        }
       },
    });
  }; 
  const getSession = async () => {
      try {
          const response = await axios.get("http://localhost:3000/userdashboard.php", {
              withCredentials: true,
          });
          if(response.data.status == 200 ){
            setshowDashBoard(true);
            console.log('200');
          } else {
            setshowDashBoard(false);
            console.log('401');
          }
      } catch (error) {
          console.error("Error fetching session:", error);
      }
  };
  
  useEffect(() => {
    getSession();
  }, []); 

  return (
    <>
    <div className="main-block">
      { !showDashBoard ? <div className="login-block">
        <h1 className='welcome-text'>Welcome to To-Do</h1>
        <h2>Simplify Your Day with To-Da</h2>
        <h3>Stay Organized. Boost Productivity. Conquer Your Goals.</h3>
        <p>Managing your tasks has never been easier. To-Do is your ultimate companion to streamline your day, prioritize your to-dos, and achieve success effortlessly.</p>
        <h3>Start Your Journey</h3>
          <div>
            <button className="user-login-action secondary" id="sign-up-btn" onClick={ToggleMenu}>Sign Up</button>
            <button className="user-login-action secondary" id="login-btn" onClick={ToggleMenu} >Login</button>
          </div>
            { showLogin ? <Login handleLogin={handleLogin} /> : ''  }
            { showSignUp ? <SignUp handleSignUp={handleSignUp} /> : ''  }
      </div> : 
      <div className="dashboard-wrapper">
        <Dashbaord />
      </div>
      
      }

    </div>

    </>
  )
}

export default App
