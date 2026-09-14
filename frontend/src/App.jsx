import { Routes, Route } from 'react-router-dom'

import Home from './pages/index'
import Dashboard from './pages/dashboard/dashboard'
import Login from './pages/login/login'
import AddTender from './pages/add-tendor/addTender'

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/add-tender"
        element={<AddTender />}
      />

    </Routes>
  )
}

export default App