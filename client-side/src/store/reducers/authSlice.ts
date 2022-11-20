import {
    createSlice,
    PayloadAction,
    createAsyncThunk,
    AnyAction,
  } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../utils/api";
import Cookies from "universal-cookie";

const cookies = new Cookies();


type User = {
    name: string;
    email: string;
    password:string;
    accessToken:string;
    status:boolean
  };
  
  type UserState = {
    error: null | string;
    loading: boolean;
    accessToken:string
  };
  
  const initialState: UserState = {
    error: null,
    loading: false,
    accessToken:""
  };
  
  
  export const login = createAsyncThunk<User,Partial<User>,{ rejectValue: any }>(
   "auth/login", async function (user_info, { rejectWithValue }) {
    try{
        const response = await axios.post(API_URL+"api/v1/auth/login",user_info);
        if (!response.status) {
          return rejectWithValue("Server Error!");
        }
        const data = await response.data
        cookies.set("accessToken", response.data.accessToken, { path: "/" });
        return data;
    }catch(err){
        return rejectWithValue(err);
    }
    
  });
  
  export const register = createAsyncThunk<User,Partial<User>,{ rejectValue: any }>(
    "auth/register", async function (user_info, { rejectWithValue }) {
     try{
        const response = await axios.post(API_URL+"api/v1/auth/register",user_info);
        if (!response.status) {
         return rejectWithValue("Server Error!");
        }
        const data = await response.data
        cookies.set("accessToken", response.data.accessToken, { path: "/" });
        return data;
     }  catch(err){
        return rejectWithValue(err)
     } 
     
   });
  
  
  
  const authSlice = createSlice({
      name: "auth",
      initialState,
      reducers: {},
      extraReducers(builder) {
        builder
          .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
          })
          .addCase(register.pending, (state) => {
              state.error = null;
              state.loading = true;
          })
          .addCase(register.fulfilled, (state, action) => {
            state.error = null;
            state.loading = false;

          })
          .addMatcher(isError, (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
          });
      },
    });
    
    export default authSlice.reducer;
    
    function isError(action: AnyAction) {
      return action.type.endsWith("rejected");
    }
  