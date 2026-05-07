import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Exercise1 from './pages/exercise1';
import ProtectedRoute from './auth/ProtectedRoute';
import Login from './pages/login';

function App() {
  return (
    <Routes>
      <Route path='/' element={
        <ProtectedRoute>
          <Home></Home>
        </ProtectedRoute>
      }></Route>
      <Route path='/login' element={
        <Login></Login>
      }></Route>
      <Route path='/ex1' element={
        <ProtectedRoute>
          <Exercise1></Exercise1>
        </ProtectedRoute>
      }></Route>
    </Routes>
  )
}

export default App;