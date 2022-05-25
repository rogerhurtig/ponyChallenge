import * as React from 'react';
import * as ReactDOM from 'react-dom';
// CSS
import './index.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
// Components
import App from './App';
import { StoreProvider } from './components/store';

ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById('root')
);