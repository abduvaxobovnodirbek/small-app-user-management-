import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  AnyAction,
} from "@reduxjs/toolkit";
import api from "../../utils/api";

export  type User = {
  _id: string;
  name: string;
  email: string;
  status:boolean;
  createdAt:Date;
  lastLoginAt:Date
};

type UserState = {
  list: User[];
  error: null | string;
  loading: boolean;
};

const initialState: UserState = {
  list: [],
  error: null,
  loading: false,
};


export const getUsers = createAsyncThunk<any,undefined,{ rejectValue: any }>(
 "user/getUsers", async function (_, { rejectWithValue }) {
 try {
  const response = await api.get("api/v1/users");
  if (!response.status) {
    return rejectWithValue("Server Error!");
  }
  const data = await response.data
  
  return data;
 } catch (error) {
  return rejectWithValue(error);
  
 }
});

export const createUser = createAsyncThunk<User,Partial<User>,{ rejectValue: any }>(
    "user/createUser", async function (new_user, { rejectWithValue }) {
    try {
      const response = await api.post("api/v1/users",new_user);
      if (!response.status) {
        return rejectWithValue("Server Error!");
      }
      const data = await response.data
      return data;
    } catch (error) {
      return rejectWithValue(error);
      
    }
});

interface UIds {
  ids:string[]
}

export const deleteUser = createAsyncThunk<string[],UIds,{ rejectValue: any }>(
 "user/deleteUser", async function (users, { rejectWithValue }) {
  
  try {
    const response = await api.delete(`api/v1/users/${users.ids}`);
  if (!response.status) {
    return rejectWithValue("Server Error!");
  }
  
  return users.ids;
  } catch (error) {
    return rejectWithValue(error);
  }
});


export const editUser = createAsyncThunk<User,Partial<User>,{ rejectValue: any; state: { users: UserState } }>(
 "user/editUser", async function (user_details, { rejectWithValue, getState }) {
  const user = getState().users.list.find((user) => user._id === user_details._id);
  if (user) {
    try {
      const response = await api.put(`api/v1/users/${user._id}`,user_details);

    if (!response.status) {
      return rejectWithValue("Cannot update user info . Server Error");
    }
    return (await response.data.data) as User;
    } catch (error) {
      return rejectWithValue(error);
    }
  }

  return rejectWithValue("No such User in the list");
});


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers(builder) {
      builder
        .addCase(getUsers.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getUsers.fulfilled, (state, action) => {
          state.list = action.payload.data;
          state.loading = false;
          state.error = null;
        })
        .addCase(createUser.pending, (state) => {
            state.error = null;
        })
        .addCase(createUser.fulfilled, (state, action) => {
          state.list.push(action.payload);
          state.error = null;
        })
        .addCase(editUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(editUser.fulfilled, (state, action) => {
          state.list = state.list.map(
            (user)=>{
              if(user._id === action.payload._id){
                user = action.payload
              }
              return user
            }
          );
         
          state.loading = false;
          state.error = null;
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
          state.loading = false;
          state.error = null;
        })
        .addMatcher(isError, (state, action: PayloadAction<string>) => {
          state.error = action.payload;
          state.loading = false;
        });
    },
  });
  
  export default userSlice.reducer;
  
  function isError(action: AnyAction) {
    return action.type.endsWith("rejected");
  }
