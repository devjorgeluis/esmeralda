import { createRoot } from 'react-dom/client'
import AppContextProvider from './AppContext.jsx'

import "./css/vendor.min.css"
import "./css/animate.css"
import "./css/theme.min.css"
import "./css/theme-chalk.css"
import './css/zeuscasino.css'
import './css/country.css'
import './css/sport.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <AppContextProvider>
      <App className="normal-mode app-mode"/>
    </AppContextProvider>
  // </StrictMode>
)