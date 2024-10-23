import { Navigate, Route, Routes } from 'react-router-dom'
import { Header, AuthBox } from './layout'
import './App.css'

function App() {

  return (
    <>
      <Header isLogin={true} />
      <Routes>
        <Route path='/' element={<Navigate to={"/auth?type=login"} />} />
        <Route path='/auth' element={<AuthBox />} />
        <Route path='*' element={<Navigate to={"/auth?type=login"} />} />
      </Routes>
    </>
  )
}

export default App
