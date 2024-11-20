function SignUp(props) {

  return (
    <>
      <div className="sign-up-block">
        <form action="http://localhost:3000/signup.php" method='post' onSubmit={props.handleSignUp}>
          <label htmlFor ='email'>Email</label>
          <input placeholder='Enter Your Email' type="email" name='email' id='email' required />
          <label htmlFor ='name'>Name</label>
            <input placeholder='Enter Your Name' type="name" name='name' id='name' required />
            
          <label htmlFor ='password'>Password</label>
          <input placeholder='Enter a Password' type="password" name='password' id='password' required />
          <button id='sign-up' type='submit'>Create</button>
        </form>
      </div>
    </>
  )
}

export default SignUp


