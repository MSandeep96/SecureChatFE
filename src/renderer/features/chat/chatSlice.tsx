import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

type Message = {
  username: string;
  message: string;
};

export interface ChatState {
  userList: string[];
  currUser: string | null;
  chatHistory: string[];
  keyRecieved: { [key: string]: boolean };
}

const initialState: ChatState = {
  userList: [],
  currUser: null,
  chatHistory: [],
  keyRecieved: {},
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setUserList: (state, action: PayloadAction<string[]>) => {
      state.userList = action.payload;
    },
    userSelected: (state, action: PayloadAction<string | null>) => {
      window.electron.ipcRenderer.sendMessage('establishConnection', [
        action.payload,
      ]);
      state.currUser = action.payload;
    },
    userWhoSelected: (state, action: PayloadAction<string | null>) => {
      state.currUser = action.payload;
    },
    gotMessage: (state, action: PayloadAction<Message>) => {
      state.currUser = action.payload.username;
      const { username, message } = action.payload;
      if (state.currUser === username) {
        state.chatHistory.push(message);
      } else {
        state.chatHistory = [message];
      }
    },
    sendMessage: (state, action: PayloadAction<string>) => {
      window.electron.ipcRenderer.sendMessage('sendMessage', [
        {
          username: state.currUser,
          message: action.payload,
        },
      ]);
      state.chatHistory.push(action.payload);
    },
    setKeyRecieved: (state, action: PayloadAction<string>) => {
      state.keyRecieved[action.payload] = true;
    },
  },
});

export const {
  setUserList,
  userSelected,
  userWhoSelected,
  gotMessage,
  sendMessage,
  setKeyRecieved,
} = chatSlice.actions;
export const chatReducer = chatSlice.reducer;
