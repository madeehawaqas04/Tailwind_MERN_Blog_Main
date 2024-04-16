import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loadingStart,
  sendOTPSuccess,
  changePWDSuccess,
  loadingFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function ForgetPassword() {
  const [formData, setFormData] = useState({});
  const [action, setAction] = useState("sendOTP");
  const { loading, error: errorMessage } = useSelector((state) => state.user);
 //const { loading, error: errorMessage } = ({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (action === "sendOTP") {
      if (!formData.email) {
        return dispatch(loadingFailure("Email Required"));
      }
    } else {
      if (!formData.password || !formData.otp) {
        return dispatch(loadingFailure("All Fields Required"));
      }
    }
    try {
      dispatch(loadingStart());
      let url = "";
      if (action === "sendOTP") {
        url = "/api/auth/sendForgetPasswordOTP";
      } else {
        url = "/api/auth/changePassword";
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(loadingFailure(data.message));
      }

      if (data.success === true) {
        dispatch(sendOTPSuccess(data));
        // navigate('/');
        if(action!=="changePwd")
        {
        setAction("changePwd");
        }
        else
        {
         // navigate('/sign-in');
          setAction("changePwdSuccess");
        }
      }
    } catch (error) {
      dispatch(loadingFailure(error.message));
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Tech
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            {action === "changePwd" && `We have sent a verifiction code to email ${formData.email}. Enter the code here`}
            {action === "sendOTP" && "Enter your registered email."}
            {action === "changePwdSuccess" && " Password has been changed successfully.."}
          </p>
        </div>
        {/* right */}

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {action === "sendOTP" && (
              <>
                <div>
                  <Label value="Your email" />
                  <TextInput
                    type="email"
                    placeholder="name@company.com"
                    id="email"
                    onChange={handleChange}
                  />
                </div>

                <Button
                  gradientDuoTone="purpleToPink"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-3">Loading...</span>
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </>
            )}

            {action === "changePwd" && (
              <>
                <div>
                  <Label value="Verification Code" />
                  <TextInput
                    type="text"
                    placeholder="OTP"
                    id="otp"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label value="New password" />
                  <TextInput
                    type="password"
                    placeholder="**********"
                    id="password"
                    onChange={handleChange}
                  />
                </div>

                <Button
                  gradientDuoTone="purpleToPink"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-3">Loading...</span>
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </>
            )}
          </form>

          {
            action==="changePwdSuccess" && (
              <Alert className="mt-5" color="success">
                Password has been changed successfully..
              </Alert>
            )
          }
          <div className="flex gap-2 text-sm mt-5">
          <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}


        </div>
      </div>
    </div>
  );
}
