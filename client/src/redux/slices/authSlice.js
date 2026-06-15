import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, getMe, logoutUser } from '../../api/authApi';

const token = localStorage.getItem('cricbuzz_token') || null;

const initialState = {
  user: null,
  token,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginUser(credentials);
      // Data format is typically { token, user } or { data: { token, user } }
      // The Axios interceptor returns response.data, which is already the response body.
      const result = data.data || data;
      localStorage.setItem('cricbuzz_token', result.token);
      return result;
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerUser(userData);
      const result = data.data || data;
      localStorage.setItem('cricbuzz_token', result.token);
      return result;
    } catch (err) {
      return rejectWithValue(err.message || 'Registration failed');
    }
  }
);

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getMe();
      return data.data || data;
    } catch (err) {
      localStorage.removeItem('cricbuzz_token');
      return rejectWithValue(err.message || 'Failed to fetch user');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
    } catch (err) {
      // Even if API logout fails, clear local session
      console.warn('Backend logout failed, clearing local session anyway', err);
    } finally {
      localStorage.removeItem('cricbuzz_token');
    }
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    localLogout: (state) => {
      localStorage.removeItem('cricbuzz_token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = action.payload;
      });

    // Fetch Me
    builder
      .addCase(fetchMe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { clearError, localLogout } = authSlice.actions;
export default authSlice.reducer;
