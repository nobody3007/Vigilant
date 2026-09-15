import { Routes, Route } from 'react-router-dom'

import Home from './pages/index'
import Dashboard from './pages/dashboard/dashboard'
import Login from './pages/login/login'
import AddTender from './pages/add-tendor/addTender'
import Case from './pages/case/case'
import Network from './pages/network/network'
import Investigations from './pages/investigations/investigations'
import Evidence from './pages/evidence/evidence'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/investigations" element={<Investigations />} />
      <Route path="/add-tender" element={<AddTender />} />
      <Route path="/case/:caseId" element={<Case />} />
      <Route path="/network" element={<Network />} />
      <Route path="/evidence" element={<Evidence />} />
    </Routes>
  )
}

export default App