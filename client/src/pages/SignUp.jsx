import { useState } from "react";
import { Link } from "react-router-dom";

function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(""); // error as a string for message
  const [isLoading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear error before submitting
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        setError(data.message || "Signup failed"); // Display server error message
      } else {
        setError(""); // Clear error on success
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Something went wrong!"); // Set generic error message
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="username"
          placeholder="username"
          id="username"
          className="bg-slate-100 p-3 rounded-lg mb-4"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg mb-4"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg mb-4"
          onChange={handleChange}
        />

        <button
          disabled={isLoading}
          className="bg-slate-700 text-white p-3 rounded-lg mb-4 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {isLoading ? "LOADING..." : "SIGN UP"}
        </button>
      </form>

      <div className="flex gap-2 mt-5">
        <p className="text-center text-gray-500">Already have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-500">Sign in</span>
        </Link>
      </div>

      {error && <p className="text-red-600 mt-4 text-center">{error}</p>} 
    </div>
  );
}

export default SignUp;
