import { Routes, Route } from 'react-router-dom'




import Home from './pages/index'


import Dashboard from './pages/dashboard/dashboard'


import Login from './pages/login/login'


import Case from './pages/case/case'


import Network from './pages/network/network'


import Tenders from './pages/tenders/tenders'


import Investigations from './pages/investigations/investigations'


import Evidence from './pages/evidence/evidence'


import Vendors from './pages/vendors/vendors'





function App() {


  return (


    <Routes>


      <Route path="/" element={<Home />} />


      <Route path="/login" element={<Login />} />


      <Route path="/dashboard" element={<Dashboard />} />`r`n      <Route path="/tenders" element={<Tenders />} />`r`n      <Route path="/tenders" element={<Tenders />} />`r`n      <Route path="/vendors" element={<Vendors />} />


      <Route path="/investigations" element={<Investigations />} />


      <Route path="/case/:caseId" element={<Case />} />


      <Route path="/network" element={<Network />} />


      <Route path="/evidence" element={<Evidence />} />


    </Routes>


  )


}





export default App
















