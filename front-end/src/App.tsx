//import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import LoginPage from './pages/LoginPage'

function App() {
  //const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" Component={LoginPage} />
        </Routes>
      </Router>
    </>
  )
}

export default App
