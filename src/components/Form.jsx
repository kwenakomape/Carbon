import "semantic-ui-css/semantic.min.css";
import { useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import axios from 'axios';
import {
  FormField,
  Icon,
  Input,
  Button as SemanticButton,
  Form,
} from "semantic-ui-react";
import { Button as AntButton } from 'antd';


export const LandingForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showOTPField, setShowOTPField] = useState(false);
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cell, setCell] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/check-username",
        { username }
      );
      const { exists, type, Cell, erroMessage } = response.data;

      if (type === "email" && exists) {
        setShowPasswordField(true);
        setShowOTPField(false);
        setErrorMessage("");
      } else if (type === "id" && exists) {
        setShowOTPField(true);
        setShowPasswordField(false);
        setErrorMessage("");
        setCell(Cell);
        await axios.post("http://localhost:3001/send-otp", { Cell });
      } else {
        setErrorMessage(erroMessage);
      }
    } catch (error) {
      setErrorMessage("An error occurred while checking the username");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (showPasswordField) {
      try {
        const response = await axios.post(
          "http://localhost:3001/verify-password",
          { username, password }
        );

        if (response.data.valid) {
          navigate(`/dashboard/admin/${response.data.AdminID}`);
        } else {
          setErrorMessage(response.data.errorMessage);
        }
      } catch (error) {
        console.error("Error verifying password:", error);
        setErrorMessage("An error occurred while verifying the password");
      }
    } else if (showOTPField) {
      try {
        const response = await axios.post("http://localhost:3001/verify-otp", {
          Cell: cell,
          otp,
        });
        if (response.data.valid) {
          navigate(`/dashboard/user/${username}`);
        } else {
          setErrorMessage("Invalid OTP");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setErrorMessage("Invalid OTP");
        } else {
          setErrorMessage("An error occurred while verifying the OTP");
        }
      }
    }
  };

  return (
    <div class="bg-gray-100">
        <div class="header bg-white h-16 px-10 py-8 border-b-2 border-gray-200 flex items-center justify-between">
              <div class="flex items-center space-x-2 text-gray-400">
                <span class="text-green-700 tracking-wider font-thin text-md"><a href="#">Home</a></span>
                <span>/</span>
                <span class="tracking-wide text-md">
                    <span class="text-base">Categories</span>
                </span>
                <span>/</span>
              </div>
        </div>
        <div class="header my-3 h-12 px-10 flex items-center justify-between">
            <h1 class="font-medium text-2xl">All Categories</h1>
        </div>
        <div class="flex flex-col mx-3 mt-6 lg:flex-row">
            <div class="w-full lg:w-1/3 m-1">
                <form class="w-full bg-white shadow-md p-6">
                    <div class="flex flex-wrap -mx-3 mb-6">
                        <div class="w-full md:w-full px-3 mb-6">
                            <label class="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2" htmlFor="category_name">Category Name</label>
                            <input class="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none focus:border-[#98c01d]" type="text" name="name" placeholder="Category Name" required />
                        </div>
                        <div class="w-full px-3 mb-6">
                            <textarea textarea rows="4" class="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none focus:border-[#98c01d]" type="text" name="description" required > </textarea>
                        </div>                        
                        
                        <div class="w-full md:w-full px-3 mb-6">
                            <button class="appearance-none block w-full bg-green-700 text-gray-100 font-bold border border-gray-200 rounded-lg py-3 px-3 leading-tight hover:bg-green-600 focus:outline-none focus:bg-white focus:border-gray-500"
                            >Add Category</button>
                        </div>
                        
                        <div class="w-full px-3 mb-8">
                            <label class="mx-auto cursor-pointer flex w-full max-w-lg flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-400 bg-white p-6 text-center" htmlFor="dropzone-file">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>

                            <h2 class="mt-4 text-xl font-medium text-gray-700 tracking-wide">Category image</h2>

                            <p class="mt-2 text-gray-500 tracking-wide">Upload or drag & drop your file SVG, PNG, JPG or GIF. </p>

                            <input id="dropzone-file" type="file" class="hidden" name="category_image" accept="image/png, image/jpeg, image/webp"/>
                            </label>
                        </div>
                        
                    </div>
                </form>
            </div>
            <div class="w-full lg:w-2/3 m-1 bg-white shadow-lg text-lg rounded-sm border border-gray-200">
                <div class="overflow-x-auto rounded-lg p-3">
                    <table class="table-auto w-full">
                        <thead class="text-sm font-semibold uppercase text-gray-800 bg-gray-50 mx-auto">
                            <tr>
                                <th></th>
                                <th><svg xmlns="http://www.w3.org/2000/svg" class="fill-current w-5 h-5 mx-auto"><path d="M6 22h12a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2zm7-18 5 5h-5V4zm-4.5 7a1.5 1.5 0 1 1-.001 3.001A1.5 1.5 0 0 1 8.5 11zm.5 5 1.597 1.363L13 13l4 6H7l2-3z"></path></svg></th>
                                <th class="p-2">
                                    <div class="font-semibold">Category</div>
                                </th>
                                <th class="p-2">
                                    <div class="font-semibold text-left">Description</div>
                                </th>
                                <th class="p-2">
                                    <div class="font-semibold text-center">Action</div>
                                </th>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td><img src="https://images.pexels.com/photos/25652584/pexels-photo-25652584/free-photo-of-elegant-man-wearing-navy-suit.jpeg?auto=compress&cs=tinysrgb&w=400" class="h-8 w-8 mx-auto" /></td>
                                <td>Sample Name</td>
                                <td>Sample Description</td>
                                <td class="p-2">
                                    <div class="flex justify-center">
                                    <a href="#" class="rounded-md hover:bg-green-100 text-green-600 p-2 flex justify-between items-center">
                                        <span>
                                        </span> Edit
                                    </a>
                                    <button class="rounded-md hover:bg-red-100 text-red-600 p-2 flex justify-between items-center">
                                        <span></span> Delete
                                    </button>
                                    </div>
                                </td>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
            
        </div>
        
    </div>
//     <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//   <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
//     <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>
    
//     <form class="space-y-4">
//       <div>
//         <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
//         <input 
//           type="email" 
//           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
//           placeholder="your@email.com"
//         />
//       </div>

//       <div>
//         <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
//         <input 
//           type="password" 
//           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
//           placeholder="••••••••"
//         />
//       </div>

//       <div class="flex items-center justify-between">
//         <label class="flex items-center">
//           <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
//           <span class="ml-2 text-sm text-gray-600">Remember me</span>
//         </label>
//         <a href="#" class="text-sm text-indigo-600 hover:text-indigo-500">Forgot password?</a>
//       </div>

//       <button class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
//         Sign In
//       </button>
//     </form>

//     <div class="mt-6 text-center text-sm text-gray-600">
//       Don't have an account? 
//       <a href="#" class="text-indigo-600 hover:text-indigo-500 font-medium">Sign up</a>
//     </div>
//   </div>
// </div>
//     <div
//     class="relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
//     <div class="w-full">
//         <div class="text-center">
//             <h1 class="text-3xl font-semibold text-gray-900">Sign in</h1>
//             <p class="mt-2 text-gray-500">Sign in below to access your account</p>
//         </div>
//         <div class="mt-5">
//             <form action="">
//                 <div class="relative mt-6">
//                     <input type="email" name="email" id="email" placeholder="Email Address" class="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none" autocomplete="NA" />
//                     <label for="email" class="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">Email Address</label>
//                 </div>
//                 <div class="relative mt-6">
//                     <input type="password" name="password" id="password" placeholder="Password" class="peer peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none" />
//                     <label for="password" class="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">Password</label>
//                 </div>
//                 <div class="my-6">
//                     <button type="submit" class="w-full rounded-md bg-black px-3 py-4 text-white focus:bg-gray-600 focus:outline-none">Sign in</button>
//                 </div>
//                 <p class="text-center text-sm text-gray-500">Don&#x27;t have an account yet?
//                     <a href="#!"
//                         class="font-semibold text-gray-600 hover:underline focus:text-gray-800 focus:outline-none">Sign
//                         up
//                     </a>.
//                 </p>
//             </form>
//         </div>
//     </div>
// </div>
    // <div className="border border-customBorder rounded-custom shadow-custom p-6 bg-gray-100 w-full max-w-lg mx-auto">
    //   <Form onSubmit={handleSubmit} className="ui form w-full">
    //     {showPasswordField || showOTPField ? (
    //       <h1 className="text-3xl font-bold text-center mb-4">Log In</h1>
    //     ) : (
    //       <h1 className="text-3xl font-bold text-center mb-4">Enter Username</h1>
    //     )}
    //     <FormField>
    //       <Input
    //         size="large"
    //         placeholder="Username"
    //         onChange={(e) => setUsername(e.target.value)}
    //         readOnly={showPasswordField || showOTPField}
    //       />
    //     </FormField>
    //     <FormField>
    //       {errorMessage && (
    //         <div className="username-error-alert">
    //           <span>
    //             <Icon
    //               name="exclamation triangle"
    //               size="Small"
    //               className="blinking-icon"
    //             />
    //             <span>
    //               <strong>Error:</strong>
    //               {errorMessage}
    //             </span>
    //           </span>
    //         </div>
    //       )}
    //     </FormField>

    //     {!showPasswordField && !showOTPField && (
    //       <>
    //         <AntButton block type="primary" htmlType="submit" size="large"
    //         disabled={!username}
    //         >
    //           Next
    //         </AntButton>
    //         <br />
    //         <br />
    //         or <a href="/create-account">Create New Account</a>
    //       </>
    //     )}
    //     {(showPasswordField || showOTPField) && (
    //       <>
    //         {showPasswordField && (
    //           <FormField>
    //             <label>Password</label>
    //             <Input
    //               size="large"
    //               type="password"
    //               placeholder="Password"
    //               onChange={(e) => setPassword(e.target.value)}
    //             />
    //           </FormField>
    //         )}
    //         {showOTPField && (
    //           <FormField>
    //             <label>OTP</label>
    //             <Input
    //               size="large"
    //               type="text"
    //               placeholder="OTP"
    //               onChange={(e) => setOtp(e.target.value)}
    //             />
    //           </FormField>
    //         )}
    //         <AntButton
    //           block
    //           type="primary"
    //           htmlType="submit"
    //           size="large"
    //           onClick={handleLoginSubmit}
    //         >
    //           LOGIN
    //         </AntButton>
    //       </>
    //     )}
    //   </Form>
    // </div>
  );
};
