import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Login, Register } from './pages'
import { Header } from './components'

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='*' element={<Navigate to={"/login"} />} />
      </Routes>
    </>
  )
}

export default App
