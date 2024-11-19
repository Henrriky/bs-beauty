import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import Layout from './layouts/Layout'
import LoginPage from './pages/LoginPage'

function App() {

  return (
    <>
      <Provider store={store}>
        <Router>s
          <Routes>
            <Route path="/" element={<Layout/>}>
              <Route index element={<LoginPage/>}/>
              <Route path="/callback" element={<Callback/>}/>
            </Route>
          </Routes>
        </Router>
      </Provider>
    </>
  )
}

export default App
