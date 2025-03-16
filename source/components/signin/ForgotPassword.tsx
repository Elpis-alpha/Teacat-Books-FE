"use client";
import { images } from "@/source/config";
import BigImage from "../reusable/BigImage";
import { FormEventHandler, useEffect, useState } from "react";
import { FaEnvelope, FaLockOpen, FaRedoAlt, FaTimes } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { isEmail } from "validator";
import routes from "@/source/api/routes";
import { postApiJson } from "@/source/api";

const ForgotPassword = () => {
  const [_email, setEmail] = useState("");
  const [_otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [atOTPStage, setAtOTPStage] = useState(false);
  const [timeLeftToOTP, setTimeLeftToOTP] = useState(0);
  const [processing, setProcessing] = useState<
    "" | "sending-otp" | "resending-otp" | "resetting-with-otp"
  >("");

  // Timer for OTP
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (timeLeftToOTP > 0) {
      timeout = setTimeout(() => {
        setTimeLeftToOTP((p) => p - 1);
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [timeLeftToOTP]);

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const email = _email.trim();
      const otp = parseInt(_otp.trim());

      if (processing !== "") {
        return toast.error("Please wait for the previous task to complete");
      } else if (!isEmail(email)) {
        return toast.error("Please provide a valid email");
      }

      if (!atOTPStage) return await handleRequestOtp("sending-otp");

      if (isNaN(otp) || otp < 100_000 || otp > 999_999) {
        return toast.error("Please provide a valid OTP");
      }

      setProcessing("resetting-with-otp");

      const response = await postApiJson(routes.user.reset, {
        email,
        otp,
      });

      if (response.error || !response.password) {
        toast.error(response.errorMessage ?? "Failed to reset password");
        setProcessing("");
        return;
      }

      setNewPassword(response.password);
      toast.success("Password reset successfully");
      setProcessing("");
    } catch (error) {
      toast.error("Failed to reset password");
      console.error(error);
      setProcessing("");
    }
  };

  const handleRequestOtp = async (
    _processing: "resending-otp" | "sending-otp"
  ) => {
    try {
      const email = _email.trim();

      if (processing !== "") {
        return toast.error("Please wait for the previous task to complete");
      } else if (!isEmail(email)) {
        return toast.error("Please provide a valid email");
      } else if (timeLeftToOTP > 0) {
        return toast.error(
          `Wait for ${timeLeftToOTP} seconds before resending OTP`
        );
      }
      setProcessing(_processing);

      // Send OTP
      const response = await postApiJson(routes.user.getResetOtp, {
        email,
      });

      if (response.error || !response.message) {
        toast.error(response.errorMessage ?? "Failed to send OTP");
        setProcessing("");
        return;
      }

      setProcessing("");
      toast.success("OTP sent successfully");
      setAtOTPStage(true);
      setTimeLeftToOTP(30);
    } catch (error) {
      toast.error("Failed to send OTP");
      setProcessing("");
      console.error(error);
    }
  };

  return (
    <BigImage blackOpacity={50} src={images.signin}>
      <div className="z-30 px-6 md:px-10 xl:px-16 w-full text-center text-base sm:text-xl">
        <div className="max-w-[600px] backdrop-blur-lg bg-white/20 rounded-[36px] shadow-xl mx-auto px-6 sm:px-9 py-6 sm:py-12">
          <div className="">
            {!(processing === "" && newPassword.length > 3) && (
              <>
                <h2 className="font-proxima font-bold text-2xl sm:text-4xl">
                  Forgot Password
                </h2>
                <p className="pt-2 mx-auto max-w-[450px]">
                  Enter your email to receive an OTP to reset your password.
                  Note that you can only reset your password once every 12
                  hours.
                </p>
              </>
            )}
            {processing === "" && newPassword.length > 3 ? (
              <div className="">
                <h3>Your new password is</h3>
                <p className="text-2xl sm:text-3xl font-bold font-proxima pt-2">
                  {newPassword}
                </p>
                <p className="pt-2">
                  Please save this password securely. You can change it later
                  from your profile.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="mt-5">
                <div>
                  <div className="absolute top-0 bottom-0 h-full left-0 flex items-center justify-center px-5 z-20">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    readOnly={atOTPStage || !!processing}
                    value={_email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-[52px] pr-4 py-2 sm:py-3.5 rounded-xl bg-white/20"
                    placeholder="Email"
                  />
                </div>
                {atOTPStage && (
                  <div className="mt-2.5 flex gap-2">
                    <div className="absolute top-0 bottom-0 h-full left-0 flex items-center justify-center px-5 z-20">
                      <FaLockOpen />
                    </div>
                    <input
                      type="number"
                      id="otp"
                      name="otp"
                      readOnly={!!processing}
                      value={_otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full pl-[52px] pr-4 py-2 sm:py-3.5 rounded-xl bg-white/20"
                      placeholder="Enter OTP"
                    />
                    <div className="flex">
                      <button
                        className="p-2 bg-yellow-400/50 rounded-l-xl flex items-center justify-center min-w-[60px]"
                        title="Resend OTP"
                        type="button"
                        disabled={!!processing || timeLeftToOTP > 0}
                        onClick={() => handleRequestOtp("resending-otp")}
                      >
                        {timeLeftToOTP > 0 ? (
                          <span className="text-sm sm:text-lg">
                            {timeLeftToOTP}
                          </span>
                        ) : processing === "resending-otp" ? (
                          <ClipLoader color="#ffffff" size={20} />
                        ) : (
                          <FaRedoAlt />
                        )}
                      </button>
                      <button
                        className="p-2 bg-bad-red/50 rounded-r-xl flex items-center justify-center min-w-[60px]"
                        title="Close OTP"
                        type="button"
                        disabled={!!processing}
                        onClick={() => setAtOTPStage(false)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                )}
                <div className="pt-4 sm:pt-5">
                  <button
                    type="submit"
                    disabled={!!processing}
                    className="w-full px-4 py-2 sm:py-3.5 bg-highlight rounded-xl hover:bg-highlight-dark flex items-center justify-center gap-2"
                  >
                    {!atOTPStage && processing !== "sending-otp" ? (
                      <>Send OTP</>
                    ) : !atOTPStage && processing === "sending-otp" ? (
                      <>
                        Sending OTP
                        <ClipLoader color="#ffffff" size={20} />
                      </>
                    ) : atOTPStage && processing === "resetting-with-otp" ? (
                      <>
                        Resetting password
                        <ClipLoader color="#ffffff" size={20} />
                      </>
                    ) : (
                      <>Reset password</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </BigImage>
  );
};
export default ForgotPassword;
