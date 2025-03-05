import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import GestioneStudenti from './pages/GestioneStudenti'
import Navbar from './components/Navbar'

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/studenti" element={<GestioneStudenti />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
