import React from 'react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from '../firebase.js';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice.js';

export default function OAuth() {
  const dispatch = useDispatch();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      if (!res.ok) {
        // If the response is not OK, throw an error with status code
        throw new Error(`Error: ${res.status}`);
      }

      // Check if the response has a body before trying to parse it
      const data = await res.text();
      if (data) {
        const jsonData = JSON.parse(data); // Parse only if there is a response
        dispatch(signInSuccess(jsonData));
      } else {
        throw new Error("Empty response from server");
      }
    } catch (error) {
      console.error("Could not log in with Google", error);
    }
  };

  return (
    <button
      type='button'
      onClick={handleGoogleClick}
      className='bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-90'
    >
      Continue with Google
    </button>
  );
}
