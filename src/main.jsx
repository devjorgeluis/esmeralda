import { createRoot } from 'react-dom/client'
import AppContextProvider from './AppContext.jsx'

import "./css/bootstrap.min.css"
import "./css/mdb.min.css"
import "./css/datatables.min.css"
import "./css/lightbox-min.css"
import './css/side_menu-min.css'
import './css/notifications-min.css'
import './css/index-min.css'
import './css/casino-min.css'
import './css/index.css'
import './css/bloques.css'
import './css/esmeralda.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <AppContextProvider>
      <App className="normal-mode app-mode"/>
    </AppContextProvider>
  // </StrictMode>
)