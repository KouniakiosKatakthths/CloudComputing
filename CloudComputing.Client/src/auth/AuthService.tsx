import { createContext, useContext, useEffect, useState } from "react"
import type { ApiError } from "../components/ErrorDisplay"

interface User {
  id: string;
  username: string;
  role: number;
}

interface AuthContextStruct {
  isLoggedIn: boolean
  user: User | null
  login: (username: string, password: string) => Promise<{ success: boolean, error: ApiError | null }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextStruct>(null!);

export function AuthService({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  //Check if already logged in on app start
  useEffect(() => {
    me().then(() => setLoading(false));
  }, [])

  const me = async () => {
    try {
      const res = await fetch('/api/v1/users/me');
      const data = await res.json();

      if (res.ok) {  
        setIsLoggedIn(true);
        setUser(data);

        return { success: true, error: null };
      } else {
        setIsLoggedIn(false);
        setUser(null);

        return { success: false, error: data };
      }
    } catch (ex) {
      console.log(ex);
      setIsLoggedIn(false);
      setUser(null);
     
      return { success: false, error: null };
    }
  }

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
      return await me(); //Get user info
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
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)