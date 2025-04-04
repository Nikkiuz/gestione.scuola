import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './redux/store'
import AppRouter from './router/AppRouter'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/custom-theme.scss'



ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AppRouter />
  </Provider>
)
