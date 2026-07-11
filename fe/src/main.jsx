import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './app/store.js'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@emotion/react'
import theme from './utils/theme.js'
import "leaflet/dist/leaflet.css";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
      <App />
    </Provider>
    </ThemeProvider>
  </StrictMode>,
)
