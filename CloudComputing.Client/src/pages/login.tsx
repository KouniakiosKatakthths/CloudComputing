import { useEffect, useState } from "react"
import { useAuth } from "../auth/AuthService"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import ErrorDisplay, { type ApiError } from "../components/ErrorDisplay"

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    //If already logged in goto home page
    if (isLoggedIn) navigate('/')
  }, [isLoggedIn])

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setApiError(null);

    const { success, error } = await login(username, password)
    if (!success) setApiError(error);
  }

  return (
    <>
      <Navbar></Navbar>

      <div className="content-small">
        {apiError && 
          <div style={{ "marginBottom": "15px" }}>
            <ErrorDisplay error={apiError}></ErrorDisplay>
          </div>
        } 
        <div className="container">
          <h2>Καλωσορίσατε</h2>
          <p>Εισάγετε τα στοιχεία σας για να συνεχίσετε</p>
          <form className="user-form" style={{ "marginTop": "20px" }} onSubmit={e => handleLogin(e)}>
            <input className="user-form-field" placeholder="Όνομα χρήστη" onChange={e => setUsername(e.target.value)}></input>
            <input className="user-form-field" placeholder="Κωδικός πρόσβασης" type="password" onChange={e => setPassword(e.target.value)}></input>
            <button className="user-form-button" type="submit">Σύνδεση</button>
          </form>
        </div>
      </div>
    </>
  )
}