import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route, BrowserRouter, HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Home } from './features/chat/Home';
import { RequireAuth } from './components/ProtectedRoutes';
import { User } from './features/User/User';
import { theme } from './theme';
import { store } from './store/store';
import {
  gotMessage,
  setKeyRecieved,
  setUserList,
  userWhoSelected,
} from './features/chat/chatSlice';
import { Main } from './Main';

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <Main />
      </Provider>
    </ChakraProvider>
  );
}

window.electron.ipcRenderer.on('userlist', (userList) => {
  console.log('userlist', userList);
  store.dispatch({ type: setUserList.type, payload: userList });
});

window.electron.ipcRenderer.on('keyrecieved', (fromUsername) => {
  console.log('keyrecieved', fromUsername);
  store.dispatch({ type: userWhoSelected.type, payload: fromUsername });
  store.dispatch({ type: setKeyRecieved.type, payload: fromUsername });
});

window.electron.ipcRenderer.on('message', (message) => {
  console.log('message', message);
  store.dispatch({ type: gotMessage.type, payload: message });
});
