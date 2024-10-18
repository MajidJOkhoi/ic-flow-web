import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import logo from "../assets/IC-logo-2.png";
import api from "../api";

const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email) return toast.warning("Please enter email");
    if (!password) return toast.warning("Please enter password");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return toast.warning("Please enter a valid email.");

    try {
      setLoading(true);
      const response = await api.post(`/api/user/login`, { email, password });

      if (response.status === 200) {
        const data = response.data;
        login(data.token, data.user_.role, data.user_.fullName);

        if (data.user_.role === "1") {
          navigate("/dashboard/admin");
        } else if (data.user_.role === "2") {
          navigate("/dashboard/teamlead");
        }

        toast.success("Login successful");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex h-screen   items-center justify-center bg-gray-200
       bg-cover bg-no-repeat"
    >
      <div
        className=" bg-white  rounded-xl bg-opacity-50 px-16 py-10 shadow-2xl backdrop-blur-md max-sm:px-8"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1499123785106-343e69e68db1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1748&q=80')",
        }}
      >
        <div className="text-black ">
          <div className="mb-8 flex flex-col items-center">
            <img src={logo} width="150" className="rounded-md  m-2 mb-10" />

            <span className="text-white ">Enter Login Details</span>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4 text-lg">
              <input
                ref={emailRef}
                className="rounded-3xl border-none  bg-gray-200 px-6 py-2 text-center text-inherit placeholder-slate-400 shadow-lg outline-none backdrop-blur-md"
                type="email"
                name="email"
                placeholder="id@email.com"
                required
              />
            </div>

            <div className="mb-4 text-lg">
              <input
                ref={passwordRef}
                className="rounded-3xl border-none bg-gray-200  px-6 py-2 text-center text-inherit placeholder-slate-400 shadow-lg outline-none backdrop-blur-md"
                type="password"
                name="password"
                placeholder="*********"
                required
              />
            </div>

            {errorMessage && (
              <p className="text-white text-center">{errorMessage}</p>
            )}

            <div className="mt-8 flex justify-center text-lg text-black">
              <button
                type="submit"
                className={`rounded-3xl bg-[#e41f1c]   px-10 py-2 text-white shadow-xl backdrop-blur-md transition-colors duration-300 ${
                  loading
                    ? "cursor-not-allowed bg-gray-400"
                    : "hover:bg-[#e41f1c] "
                }`}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
