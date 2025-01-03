import {configureStore} from '@reduxjs/toolkit';
import speedReducer from './features/speed/speedSlice';
import leaderBoardReducer from './features/leaderBoard/leaderBoardSlice';

export const store = configureStore({
          reducer:{
                    speed: speedReducer,
                    leaderBoard: leaderBoardReducer,
          }
});