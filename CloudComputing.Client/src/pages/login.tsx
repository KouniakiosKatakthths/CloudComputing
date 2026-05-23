import { useEffect, useState } from "react"
import { useAuth } from "../auth/AuthService"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import ErrorDisplay, { type ApiError } from "../components/ErrorDisplay"
import UserForm from "../forms/UserForm"

export default function Login() {
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    //If already logged in goto home page
    if (isLoggedIn) navigate('/')
  }, [isLoggedIn])

  const handleLogin = async (username: string, password: string) => {
    setApiError(null);

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { success, error } = await login(username, password)
    if (!success) setApiError(error);

    setLoading(false);
  }

  return (
    <>
      <Navbar></Navbar>

      <div className="content">
        {apiError && 
          <div style={{ "marginBottom": "15px" }}>
            <ErrorDisplay error={apiError}></ErrorDisplay>
          </div>
        } 
        <div className="container">
          <h2>Καλωσορίσατε</h2>
          <p style={{ "marginBottom": "20px" }}>Εισάγετε τα στοιχεία σας για να συνεχίσετε</p>
          <UserForm submit_button_text="Σύνδεση" loading={loading} onSubmit={handleLogin}></UserForm>
        </div>
      </div>
    </>
  )
}