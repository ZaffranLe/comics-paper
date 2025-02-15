import { createRoot } from 'react-dom/client';

import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import './index.css';

import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import store from './redux/store';

const rootApplicationElement = document.getElementById('root');
if (rootApplicationElement === null) {
  throw new Error(`Unable to load root application element.`);
}

createRoot(rootApplicationElement).render(
  <Provider store={store}>
    <App />
    <ToastContainer />
  </Provider>,
);
