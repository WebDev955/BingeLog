import ReactDOM from "react-dom/client";
import {Provider} from "react-redux";
import {store} from  "./store/store.jsx"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

//<Provider store = {store}>
  //allows App and all components inside access to redux store and all reducers to upate stae 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store = {store}>
      <App />
    </Provider>
  </StrictMode>,
)
