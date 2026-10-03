import React from 'react'
import {Routes,Route, useNavigate} from 'react-router-dom'
import Signup from './Signup'
import Login from './Login'
import Home from './Home'
import Forget from './Forget'
import Reset from './Reset'

const App = () => {
  return (
  <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/signup' element={<Signup />} />
    <Route path='/login' element={<Login />} />
    <Route path='/forget' element={<Forget />} />
    <Route path='/reset' element={<Reset />} />
  </Routes>
  )
}

export default App
