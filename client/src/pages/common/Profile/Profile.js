import { message } from "antd";
import React, { useEffect, useState } from "react";
import { getUserInfo, updateUserInfo } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { useDispatch } from "react-redux";


function App(){

    const [userInfo, setUserInfo] = useState([]); // Fetch Hook
    const [password, setPassword] = useState("") // Password Hook
    const [confirmedPassword, setConfirmedPassword] = useState("") // Confirmed password hook
    const [isChangePassword, setIsChangePassword] = useState(false);
    
    const dispatch = useDispatch();

    const nameChange = (evt) => {
        setUserInfo({...userInfo, name: evt.target.value});
    }

    const passwordChange = (evt) => {
        setPassword(evt.target.value)
        setUserInfo({...userInfo, password: evt.target.value}) // useState change before submit
    }

    const confirmedPasswordChange = (evt) => {
      setConfirmedPassword(evt.target.value)
    }

    const togglePasswordChange = () => { 
      // updatedAt setUserInfo : brute force attempt to change password
      if (isChangePassword){
        setUserInfo({...userInfo, createdAt: false}) // Will not updated password (ref: Webquiz\server\routes\usersRoute.js)
      }
      else{
        setUserInfo({...userInfo, createdAt: true}) // Update password
       } 
      setIsChangePassword((currentBool)  => !currentBool);
    }
    const updateUser = async () => {
      try {
        dispatch(ShowLoading());
        if (isChangePassword){
          if (password === "" || confirmedPassword === ""){ // Check if password and confirmed password is not empty
            message.error("Please fill in passwords.");
            dispatch(HideLoading());
            return;
          }
          if (password !== confirmedPassword){ // Check if password and confirmed password is equivalent to each other
            message.error("Passwords do not match!");
            dispatch(HideLoading());
            return;
          }
        }
        const response = await updateUserInfo(userInfo); 
        dispatch(HideLoading());
        if (response.success) {
          message.success(response.message);
        } else {
          message.error(response.message);
        }
      }
      catch (error) {
        dispatch(HideLoading());
        message.error(error.message);
      }
    }
    

    const getUserData = async () => {
        try {
          dispatch(ShowLoading());
          const response = await getUserInfo();
          dispatch(HideLoading());
          if (response.success) {
            setUserInfo(response.data) // setState to fetch hook
          } else {
            message.error(response.message);
          }
        } catch (error) {
          message.error(error.message);
        }
      };

      useEffect(() => {
          getUserData();
      }, []);

    return (
        <div>
            <h1>Profile</h1>
            <div className="divider"></div>
            <div className="flex flex-col">
                <div className="flex flex-col my-2">
                    <label>Username</label>
                    <input className="w-10 border-solid border-black border-4 my-2 w-40" value={userInfo.name} onChange={nameChange}></input>
                </div>
                <div className="flex flex-col my-2">
                  { !isChangePassword ?
                    <button type="button" onClick={togglePasswordChange} style={{ width: '645px' }}>Password change</button>
                  :
                    <>
                      <label>Password</label>
                      <input type="password" className="w-10 border-solid border-black border-4 my-2 w-40" value={password} onChange={passwordChange} required></input>
                      <label className="mt-2">Confirm password</label>
                      <input type="password" className="w-10 border-solid border-black border-4 my-2 w-40" value={confirmedPassword} onChange={confirmedPasswordChange} required></input>
                      <button type="button" onClick={togglePasswordChange} className="my-2 w-40">Cancel password change</button>
                    </>
                  }
                </div>
                <button className="border-solid border-black border-4 my-2 w-40" type="button" onClick={updateUser}>Confirm changes</button>
            </div>
        </div>
    )
}

export default App;