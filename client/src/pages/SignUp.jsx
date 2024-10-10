import React from "react"

function SignUp() {
  return (
    <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>

        <form className="flex flex-col gap-4">
            <input
            type="text"
            placeholder="username"
            id="username"
            className="bg-slate-100 p-3
             rounded-lg mb-4"
            >
            </input>

            <input
            type="email"
            placeholder="email"
            id="email"
            className="bg-slate-100 p-3
             rounded-lg mb-4"
            >
            </input>

            <input
            type="password"
            placeholder="password"
            id="password"
            className="bg-slate-100 p-3
             rounded-lg mb-4"
            >
            </input>
            <button
        className="bg-slate-700 text-white p-3 rounded-lg mb-4 uppercase  hover:opacity-95 disabled:opacity-80"
        >Sign Up</button>
        </form>
        <div className="flex gap-2 mt-5">
            <p className="text-center text-gray-500">Already have an account?</p>
            <span className="text-blue-500">Sign in</span>
        </div>
        
    </div>
  )
}

export default SignUp