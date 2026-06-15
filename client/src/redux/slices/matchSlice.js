import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getHomeData, getMatches, getMatchDetails } from '../../api/matchApi';

export const fetchHomeMatches = createAsyncThunk(
  'matches/fetchHomeMatches',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getHomeData();
      return data.data || data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch home matches');
    }
  }
);

export const fetchAllMatches = createAsyncThunk(
  'matches/fetchAllMatches',
  async (status, { rejectWithValue }) => {
    try {
      const data = await getMatches(status);
      return data.data || data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch matches');
    }
  }
);

export const fetchMatchInfo = createAsyncThunk(
  'matches/fetchMatchInfo',
  async (matchId, { rejectWithValue }) => {
    try {
      const data = await getMatchDetails(matchId);
      return data.data || data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch match details');
    }
  }
);

const initialState = {
  liveMatches: [],
  upcomingMatches: [],
  recentMatches: [],
  allMatches: [],
  activeMatch: null,
  isLoading: false,
  error: null,
};

const matchSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    updateLiveScore: (state, action) => {
      const { matchId, score } = action.payload;
      
      // Update activeMatch if it's the current one
      if (state.activeMatch && state.activeMatch._id === matchId) {
        state.activeMatch = {
          ...state.activeMatch,
          score: {
            ...state.activeMatch.score,
            ...score
          }
        };
      }
      
      // Update liveMatches list
      const liveIndex = state.liveMatches.findIndex(m => m._id === matchId);
      if (liveIndex !== -1) {
        state.liveMatches[liveIndex] = {
          ...state.liveMatches[liveIndex],
          score: {
            ...state.liveMatches[liveIndex].score,
            ...score
          }
        };
      }
    },
    updateMatchStatus: (state, action) => {
      const { matchId, status, result } = action.payload;
      if (state.activeMatch && state.activeMatch._id === matchId) {
        state.activeMatch.status = status;
        if (result) state.activeMatch.result = result;
      }
      
      // If a match changes state, we may need to reload home matches or update lists
      const updateMatchInList = (list) => {
        const idx = list.findIndex(m => m._id === matchId);
        if (idx !== -1) {
          list[idx].status = status;
          if (result) list[idx].result = result;
        }
      };
      
      updateMatchInList(state.liveMatches);
      updateMatchInList(state.upcomingMatches);
      updateMatchInList(state.recentMatches);
      updateMatchInList(state.allMatches);
    }
  },
  extraReducers: (builder) => {
    // Fetch home data
    builder
      .addCase(fetchHomeMatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHomeMatches.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload || {};
        state.liveMatches = payload.liveMatches || [];
        state.upcomingMatches = payload.upcomingMatches || [];
        state.recentMatches = payload.recentMatches || [];
      })
      .addCase(fetchHomeMatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch all matches
    builder
      .addCase(fetchAllMatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllMatches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allMatches = action.payload || [];
      })
      .addCase(fetchAllMatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch match info
    builder
      .addCase(fetchMatchInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMatchInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeMatch = action.payload;
      })
      .addCase(fetchMatchInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { updateLiveScore, updateMatchStatus } = matchSlice.actions;
export default matchSlice.reducer;
