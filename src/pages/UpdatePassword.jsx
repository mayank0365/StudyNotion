import React from 'react'
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { resetPassword } from '../services/operations/authAPI';
import { Link } from 'react-router-dom';

const UpdatePassword = () => {

    const dispatch=useDispatch();
    const [formData,setFormData]=useState({
        password:"",
        confirmPassword:"",
    })
    const [showPassword,setShowPassword]=useState(false);
    const [showConfirmPassword,setShowConfirmPassword]=useState(false);
    const {loading}=useSelector( (state)=>state.auth);
    const {password,confirmPassword}=formData;
    const location=useLocation();

    const handleOnChange=(e)=>{
        setFormData( (prevData)=>(
            {
                ...prevData,
                [e.target.name] : e.target.value,

            }
        ))
    }

    const handleOnSubmit=(e)=>{
        e.preventDefault();
        const token=location.pathname.split('/').at(-1);
        dispatch(resetPassword(password,confirmPassword,token))
    }
  return (
    <div className='text-white'>
      {
        loading ? (
            <div>
                Loading.....
            </div>
        ) : (<div>

               <h1>Choose new Password</h1>
               <p>Almost done. Enter your new Password and yours all set</p>

               <form onSubmit={handleOnSubmit} text-black>

                  <label>
                    <p>New Password </p>
                    <input
                    
                    required
                    type={showPassword?"text":"password"}
                    name="password"
                    value={password}
                    onChange={handleOnChange}
                    placeholder="enter password"
                     className='w-full p-6 bg-richblack-300 text-black'/>
                
                <span
                onClick={() => setShowPassword( (prev)=>!prev)}>
                    {
                        showPassword?  <IoEyeOffOutline fontSize={24}/> : <IoEyeOutline fontSize={24}/>

                    }
                </span>
                  </label>
                


                 <label>
                    <p>Confirm New Password </p>
                    <input
                    
                    required
                    type={showConfirmPassword?"text":"password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleOnChange}
                    placeholder="confirm Password"
                    className='w-full p-6 bg-richblack-600 text-white'/>
                
                <span
                onClick={() => setShowConfirmPassword( (prev)=>!prev)}>
                    {
                        showConfirmPassword?  <IoEyeOffOutline fontSize={24}/> : <IoEyeOutline fontSize={24}/>

                    }
                </span>
                  </label>
                  <button type='submit'>

                    Reset Password


                  </button>



               </form>
                     <div>
                        <Link to="/login">
                            <p> Back to Login </p>
                        </Link>
                        </div>
               
            </div>)
      }
    </div>
  )
}

export default UpdatePassword
