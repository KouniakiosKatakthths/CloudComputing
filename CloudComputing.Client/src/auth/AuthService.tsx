import { createContext, useContext, useEffect, useState } from "react"
import type { ApiError } from "../components/ErrorDisplay"

interface AuthContextStruct {
  isLoggedIn: boolean
  login: (username: string, password: string) => Promise<{ success: boolean, error: ApiError | null }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextStruct>(null!);

export function AuthService({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  //Check if already logged in on app start
  useEffect(() => {
    fetch('/api/v1/users/me')
      .then(res => setIsLoggedIn(res.ok))
      .finally(() => setLoading(false))
  }, [])

  //Handles loggin request
  const login = async (username: string, password: string) : Promise<{ success: boolean, error: ApiError | null }> => {
    try {

      const res = await fetch('/api/v1/users/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      //Server responed with error
      if (!res.ok) {
        const err = await res.json();
        return { success: false, error: err };
      }

      setIsLoggedIn(true);
      return { success: true, error: null };
    } catch (ex) {
      console.log(ex);
      return { success: false, error: null };
    }
  }

  //Handles logout request
  const logout = async () => {
    await fetch('/api/v1/users/logout', {
      credentials: 'include'
    })
    setIsLoggedIn(false)
  }

  //Wait to loggin
  if (loading) 
    return <div>Παρακαλώ περιμένετε...</div>

  //Show application with loggin context
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)