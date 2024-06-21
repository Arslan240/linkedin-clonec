import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './Context/AuthContext.jsx'
import SearchContextProvider from './Context/SearchContext.js'
import NotificationsContextProvider from './Context/NotificationsContext.js'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AuthProvider>
    <NotificationsContextProvider>
      <SearchContextProvider>
        <Router>
          <App />
        </Router>
      </SearchContextProvider>
    </NotificationsContextProvider>
  </AuthProvider>
)
