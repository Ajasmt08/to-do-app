function Login(props) {
  return (
    <>
      <div className="login-up-block">
      <div className="login-in-block">
        <form action="http://localhost:3000/login.php" method='post' onSubmit={props.handleLogin}>
          <label htmlFor ='email'>Email</label>
          <input placeholder='Enter Your Email' type="email" name='email' id='email' required />
          <label htmlFor ='password'>Password</label>
          <input placeholder='Enter a Password' type="password" name='password' id='password' required />
          <button id='login-in' type='submit'>Login</button>
        </form>
      </div>
      </div>
    </>
  )
}

export default Login
