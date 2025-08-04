import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { changePassword } from "../../../../services/operations/SettingsApi"
import IconBtn from "../../../common/IconBtn"

export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitPasswordForm = async (data) => {
     console.log("password Data - ", data)
    try {
      await changePassword(token, data)
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(submitPasswordForm)}>
  <div className="my-10 flex flex-col gap-y-6 rounded-md border border-richblack-700 bg-richblack-800 p-8 px-12">
    <h2 className="text-lg font-semibold text-richblack-5">Password</h2>

    {/* Password Fields */}
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-5">
      {/* Current Password */}
      <div className="relative flex flex-col gap-2 lg:w-1/3">
        <label htmlFor="oldPassword" className="lable-style">Current Password</label>
        <input
          type={showOldPassword ? "text" : "password"}
          name="oldPassword"
          id="oldPassword"
          placeholder="Enter Current Password"
          className="form-style pr-10"
          {...register("oldPassword", { required: true })}
        />
        <span
          onClick={() => setShowOldPassword(prev => !prev)}
          className="absolute right-3 top-10 cursor-pointer z-10"
        >
          {showOldPassword ? <AiOutlineEyeInvisible fontSize={22} fill="#AFB2BF" /> : <AiOutlineEye fontSize={22} fill="#AFB2BF" />}
        </span>
        {errors.oldPassword && (
          <span className="text-[12px] text-yellow-100 -mt-1">
            Please enter your Current Password.
          </span>
        )}
      </div>

      {/* New Password */}
      <div className="relative flex flex-col gap-2 lg:w-1/3">
        <label htmlFor="newPassword" className="lable-style">New Password</label>
        <input
          type={showNewPassword ? "text" : "password"}
          name="newPassword"
          id="newPassword"
          placeholder="Enter New Password"
          className="form-style pr-10"
          {...register("newPassword", { required: true })}
        />
        <span
          onClick={() => setShowNewPassword(prev => !prev)}
          className="absolute right-3 top-10 cursor-pointer z-10"
        >
          {showNewPassword ? <AiOutlineEyeInvisible fontSize={22} fill="#AFB2BF" /> : <AiOutlineEye fontSize={22} fill="#AFB2BF" />}
        </span>
        {errors.newPassword && (
          <span className="text-[12px] text-yellow-100 -mt-1">
            Please enter your New Password.
          </span>
        )}
      </div>

      {/* Confirm Password */}
      <div className="relative flex flex-col gap-2 lg:w-1/3">
        <label htmlFor="confirmPassword" className="lable-style">Confirm New Password</label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          id="confirmPassword"
          placeholder="Confirm New Password"
          className="form-style pr-10"
          {...register("confirmPassword", { required: true })}
        />
        <span
          onClick={() => setShowConfirmPassword(prev => !prev)}
          className="absolute right-3 top-10 cursor-pointer z-10"
        >
          {showConfirmPassword ? <AiOutlineEyeInvisible fontSize={22} fill="#AFB2BF" /> : <AiOutlineEye fontSize={22} fill="#AFB2BF" />}
        </span>
        {errors.confirmPassword && (
          <span className="text-[12px] text-yellow-100 -mt-1">
            Please confirm your new password.
          </span>
        )}
      </div>
    </div>
  </div>

  {/* Buttons */}
  <div className="flex justify-end gap-3">
    <button
      type="button"
      onClick={() => navigate("/dashboard/my-profile")}
      className="rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50 transition-all duration-200 hover:bg-richblack-600"
    >
      Cancel
    </button>
    <IconBtn type="submit" text="Update" />
  </div>
</form>

    </>
  )
}