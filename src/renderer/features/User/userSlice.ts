import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { axios } from '../../util/axios';

export interface UserState {
  username: string | null;
  error: string | null;
}

const initialState: UserState = {
  username: null,
  error: null,
};

export const postUsername = createAsyncThunk<string, string>(
  'user/postUsername',
  async (username, { rejectWithValue }) => {
    const resp = await axios.post('/user', { username });
    if (resp.status === 200) {
      return username;
    }
    return rejectWithValue('Username already exists');
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postUsername.fulfilled, (state, action) => {
        state.username = action.payload;
        state.error = null;
        window.electron.ipcRenderer.sendMessage('initSocket', [state.username]);
      })
      .addCase(postUsername.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const userReducer = userSlice.reducer;
