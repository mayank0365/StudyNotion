import React , {useEffect,useState} from 'react'
import {useForm} from "react-hook-form"
import { contactusEndpoint } from '../../../services/apis';
import CountryCode from "../../../data/countrycode.json"

const ContactUsForm = () => {


    const [loading,setLoading]=useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors,isSubmitSuccessful}

    }=useForm();

    const submitContactForm=async(data)=>{
        console.log("logging data",data);

        try{
             setLoading(true);
            //  const response=await apiConnector("POST",contactusEndpoint.CONTACT_US_API,data)
            const response={status:"OK"};
             console.log("logging response",response);
             setLoading(false);
        }
        catch(error){
            console.log("error",error.message);
            setLoading(false); 

        }
    }

    useEffect( ()=>{
        if(isSubmitSuccessful){
            reset ({
                email:"",
                firstName:"",
                lastName:"",
                message:"",
                phoneNo:"",
            })
        }
    },[reset,isSubmitSuccessful]);
  return (
   <form onSubmit={handleSubmit(submitContactForm)}>
       
     <div className='flex flex-col gap-14'>
        
       <div className='flex gap-5'>
        {/* {firstName} */}
        <div className='flex flex-col'>
            <label htmlFor='firstName'>first Name</label>
            <input
               type='text'
               name='firstname'
               id='firstname'
               placeholder='enter first name'
               className='text-black'
             {...register("firstname",{required:true})}
            />
             {
                errors.firstName && (
                    <span>
                        Please enter your name
                    </span>
                )
             }

        </div>

        {/* {lastName} */}
         <div className='flex flex-col'>
            <label htmlFor='lastName'>Last Name</label>
            <input
               type='text'
               name='name'
               id='lastname'
               placeholder='enter last name'
                className='text-black'
             {...register("lastname")}
            />
           

        </div>
     </div>
              {/* {email} */}
        <div className='flex flex-col'>
            <label htmlFor='email'>Email Address</label>
            <input
               type='email'
               name='email'
               id='email'
               placeholder='enter email address'
                className='text-black'
               {...register("email",{required:true})}
            />
        </div>

        {/* {phoneNo} */}
        <div className='flex flex-col gap-x-10'>
           <label htmlFor='phonenumber'>Phone Number</label>
           <div className='flex flex-row gap-5'>
              {/* dropdown */}
              
                 <select
                    name='dropdown'
                    id="dropdown"
                    {...register("countrycode",{required:true})}
                    className='bg-richblack-800 w-[80px]'

                 >
                    {
                        CountryCode.map( (element,index)=>{
                            return (
                                <option key={index} value={element.code}>
                                    {element.code} -{element.country}
                                </option>
                            )
                        })
                    }
                 </select>
           


                <input
                  type='number'
                  name='phonenumber'
                  id='phonenumber'
                  placeholder='12345 67890'
                  className='text-black w-[calc(100%-90px)]'
                  {...register("phoneNo",
                    {
                        required:{value:true,message:"please enter phone number"},

                        maxLength: {value:10, message:"invalid phone number"},
                        minLength:{value:8, message:"invalid phone number"}
                    }
                  )}


                   />
          

           </div>
           {
            errors.phoneNo && (
                <span>
                    {errors.phoneNo.message}
                </span>
            )
           }
        </div>

        {/* {message} */}
        <div className=' flex flex-col'>
            <label htmlFor='message'>Message</label>
            <textarea
               name='message'
               id='message'
               cols="30"
               rows="7"
               placeholder='enter your message here'
                className='text-black'
               {...register("message",{required:true})}
            />
            {
                errors.message && (
                    <span>
                        Please enter your message

                    </span>
                )
            }
        </div>

       <button type='submit'
       className='rounded-md bg-yellow-50 text-center px-6 text-[16px] font-bold text-black'>
          Send Message
       </button>
     </div>
   </form>
  )
}

export default ContactUsForm
