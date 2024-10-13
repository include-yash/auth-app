import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from '../components/OAuth'

function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loading, error } = useSelector((state) => state.user); // Use 'loading' instead of 'isLoading'
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const res = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", 
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "An error occurred during sign-in.");
      }

      const data = await res.json();

      if (data.success) {
        console.log("Login successful", data);
        dispatch(signInSuccess(data.user));
        navigate("/");
      } else {
        throw new Error(data.message || "An error occurred during sign-in.");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg mb-4"
          onChange={handleChange}
          required // Add required attribute for better form validation
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg mb-4"
          onChange={handleChange}
          required // Add required attribute for better form validation
        />

        <button
          disabled={loading} // Disable button based on loading state
          className="bg-slate-700 text-white p-3 rounded-lg mb-4 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "LOADING..." : "SIGN IN"}
        </button>
        <OAuth></OAuth>
      </form>

      <div className="flex gap-2 mt-5">
        <p className="text-center text-gray-500">Don't have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-500">Sign up</span>
        </Link>

        {error && (
          <p className="text-red-500 mt-4 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}

export default SignIn;
