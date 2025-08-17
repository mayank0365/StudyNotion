import { studentEndpoints } from "../apis"
import {toast} from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice"
import { resetCart } from "../../slices/CartSlice"

const {COURSE_PAYMENT_API,COURSE_VERIFY_API,SEND_PAYMENT_SUCCESS_EMAIL_API}=studentEndpoints;

function loadScript(src){
    return new Promise((resolve)=>{
        const script=document.createElement("script");
        script.src=src;

        script.onload=()=>{
            resolve(true);
        }
        script.onerror=()=>{
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

export async function buyCourse(token,courses,userDetails,navigate,dispatch) {
    const toastId=toast.loading("Loading...");

    try{
        //load the script
        const res=await loadScript("https://checkout.razorpay.com/v1/checkout.js" );
        console.log("response after check out",res);

        if(!res){
            toast.error("Razorpay sdk failed to load");
            return ;
        }

        //iniatiate the order

        const orderResponse=await apiConnector("POST",COURSE_PAYMENT_API,
            {courses},
            {
                Authorization:`Bearer ${token}`,
            }

        )
        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message);

        }
         console.log("RAZORPPAY KEY FROM ENV",process.env.REACT_APP_RAZORPAY_KEY);
        const options={
           
           key: process.env.REACT_APP_RAZORPAY_KEY,

            currency:orderResponse.data.message.currency,
            amount:`${orderResponse.data.message.amount}`,

            order_id:orderResponse.data.message.id,
            name:"StudyNotion",
            desription:"Thanku for purchasing the course",
            image:rzpLogo,
            prefill:{
                name:`${userDetails.firstName}`,
                email:userDetails.email
            },
            handler: function(response){
                //send successful wala mail
                sendPaymentSuccessEmail(response,orderResponse.data.message.amount,token);
                 //verify payment
                verifyPayment({...response,courses},token,navigate,dispatch);
            }

        }
        console.log("printing options",options);

        //window open 
        const paymentObject=new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed",function(response){
            toast.error("oops,payment failed");
            console.log(response.error);
        })
          
    }
    catch(error){
        console.log("PAYMENT API ERROR....",error); 
        toast.error("could not make payment");
    }

    toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response,amount,token){
    try{
         await apiConnector("POST",SEND_PAYMENT_SUCCESS_EMAIL_API,{
            orderId:response.razorpay_order_id,
            paymentId:response.razorpay_payment_id,
            amount,

         },{
            Authorization: `Bearer ${token}`
         })
    }
    catch(error){
        console.log("PAYMENT SUCCESS EMAIL ERROR",error);

    }
}

//verify payment
async function verifyPayment(bodyData,token,navigate,dispatch) {
    console.log("BOdy data recieved:",bodyData);
   const toastId=toast.loading("Verifying Payment....");
   dispatch(setPaymentLoading(true));

   try{
      const response=await apiConnector("POST",COURSE_VERIFY_API,bodyData,{
        Authorization :`Bearer ${token}`,
      })

      if(!response.data.success){
        throw new Error(response.data.message);
      }
      toast.success("payment successful, you are added to the course ");
      navigate("/dashboard/enrolled-courses");
      dispatch(resetCart());
   }
   catch(error){
      
      console.log("PAYMENT VERIFY ERROR....",error);
      toast.error("could not verify paymnet");

   }
   toast.success(toastId);
   dispatch(setPaymentLoading(false));


}