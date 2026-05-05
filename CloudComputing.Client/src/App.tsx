import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Exercise1 from './pages/exercise1';
import About from './pages/about';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home></Home>}></Route>
      <Route path='/ex1' element={<Exercise1></Exercise1>}></Route>
      <Route path='/about' element={<About></About>}></Route>
    </Routes>
  )
}

export default App;