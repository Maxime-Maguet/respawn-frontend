import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { username: '', token: '', _id: '' }
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action pour se connecter
    login: (state, action) => {
      console.log('redux login =>', state.value._id);

      state.value.username = action.payload.username;
      state.value.token = action.payload.token;
      state.value._id = action.payload._id
    },

    // Action pour se déconnecter
    logout: (state) => {
      state.value.username = '';
      state.value.token = '';
      state.value._id = '';
    }
  }
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;