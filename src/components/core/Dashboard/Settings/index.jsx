import React from 'react'
import ChangeProfilePicture from "../Settings/ChangeProfilePicture";
import EditProfile from "../Settings/EditProfile";
import DeleteAccount from "../Settings/DeleteAccount";
import UpdatePassword from "../Settings/UpdatePassword";

const Settings = () => {
  return (
  <>

  <h1 >Edit Profile</h1>

  {/* {change Profile Pictue} */}
  <ChangeProfilePicture/>
  {/* {Profile} */}
  <EditProfile/>
  {/* {password} */}
  <UpdatePassword/>
  {/* {Delete Account} */}
  <DeleteAccount/>
  </>
  )
}

export default Settings
