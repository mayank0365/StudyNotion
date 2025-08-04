import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { updateProfile } from "../../../../services/operations/SettingsApi"
import IconBtn from "../../../common/IconBtn"

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitProfileForm = async (data) => {
    // console.log("Form Data - ", data)
    try {
      dispatch(updateProfile(token, data))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }
  return (
    <>
     <form onSubmit={handleSubmit(submitProfileForm)} className="flex w-full flex-col gap-y-4">
  {/* First + Last Name */}
  <div className="flex gap-x-4">
    <label className="w-full">
      <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
        First Name <sup className="text-pink-200">*</sup>
      </p>
      <input
        required
        type="text"
        name="firstName"
        placeholder="Enter first name"
        defaultValue={user?.firstName}
        {...register("firstName", { required: true })}
        className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
        style={{ boxShadow: "inset 0px -1px 0px rgba(255,255,255,0.18)" }}
      />
      {errors.firstName && (
        <span className="-mt-1 text-[12px] text-yellow-100">Please enter your first name.</span>
      )}
    </label>
    <label className="w-full">
      <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
        Last Name <sup className="text-pink-200">*</sup>
      </p>
      <input
        required
        type="text"
        name="lastName"
        placeholder="Enter last name"
        defaultValue={user?.lastName}
        {...register("lastName", { required: true })}
        className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
        style={{ boxShadow: "inset 0px -1px 0px rgba(255,255,255,0.18)" }}
      />
      {errors.lastName && (
        <span className="-mt-1 text-[12px] text-yellow-100">Please enter your last name.</span>
      )}
    </label>
  </div>

  {/* DOB + Gender */}
  <div className="flex gap-x-4">
    <label className="w-full">
      <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
        Date of Birth <sup className="text-pink-200">*</sup>
      </p>
      <input
        required
        type="date"
        name="dateOfBirth"
        defaultValue={user?.additionalDetails?.dateOfBirth}
        {...register("dateOfBirth", {
          required: "Please enter your Date of Birth.",
          max: {
            value: new Date().toISOString().split("T")[0],
            message: "Date of Birth cannot be in the future.",
          },
        })}
        className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
        style={{ boxShadow: "inset 0px -1px 0px rgba(255,255,255,0.18)" }}
      />
      {errors.dateOfBirth && (
        <span className="-mt-1 text-[12px] text-yellow-100">{errors.dateOfBirth.message}</span>
      )}
    </label>
    <label className="w-full">
      <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
        Gender <sup className="text-pink-200">*</sup>
      </p>
      <select
        name="gender"
        defaultValue={user?.additionalDetails?.gender}
        {...register("gender", { required: true })}
        className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
        style={{ boxShadow: "inset 0px -1px 0px rgba(255,255,255,0.18)" }}
      >
        {genders.map((ele, i) => (
          <option key={i} value={ele}>
            {ele}
          </option>
        ))}
      </select>
      {errors.gender && (
        <span className="-mt-1 text-[12px] text-yellow-100">Please select your gender.</span>
      )}
    </label>
  </div>

  {/* Contact + About */}
  <div className="flex gap-x-4">
    <label className="w-full">
      <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
        Contact Number <sup className="text-pink-200">*</sup>
      </p>
      <input
        required
        type="tel"
        name="contactNumber"
        placeholder="Enter Contact Number"
        defaultValue={user?.additionalDetails?.contactNumber}
        {...register("contactNumber", {
          required: "Please enter your Contact Number.",
          maxLength: { value: 12, message: "Invalid Contact Number" },
          minLength: { value: 10, message: "Invalid Contact Number" },
        })}
        className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
        style={{ boxShadow: "inset 0px -1px 0px rgba(255,255,255,0.18)" }}
      />
      {errors.contactNumber && (
        <span className="-mt-1 text-[12px] text-yellow-100">{errors.contactNumber.message}</span>
      )}
    </label>
    <label className="w-full">
      <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
        About <sup className="text-pink-200">*</sup>
      </p>
      <input
        required
        type="text"
        name="about"
        placeholder="Enter Bio Details"
        defaultValue={user?.additionalDetails?.about}
        {...register("about", { required: true })}
        className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
        style={{ boxShadow: "inset 0px -1px 0px rgba(255,255,255,0.18)" }}
      />
      {errors.about && (
        <span className="-mt-1 text-[12px] text-yellow-100">Please enter your About.</span>
      )}
    </label>
  </div>

  {/* Buttons */}
  <div className="flex justify-end gap-2 mt-6">
    <button
      onClick={() => navigate("/dashboard/my-profile")}
      type="button"
      className="rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
    >
      Cancel
    </button>
    <IconBtn type="submit" text="Save" />
  </div>
</form>

    </>
  )
}