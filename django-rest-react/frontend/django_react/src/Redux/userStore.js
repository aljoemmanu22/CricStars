import {configureStore} from '@reduxjs/toolkit'
import authenticationSliceReducer from './authentication/authenticationSlice'
import userBasicDetailsSliceReducer from './userBasicDetails/userBasicDetailsSlice'

import authReducer from './slice'; // Import the slice you created


export default configureStore({
    reducer:{
        authentication_user:authenticationSliceReducer,
        user_basic_details:userBasicDetailsSliceReducer,
        auth: authReducer,
    }
})