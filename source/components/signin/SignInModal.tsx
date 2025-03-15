"use client";
import { images } from "@/source/config";
import BigImage from "../reusable/BigImage";
import { FormEventHandler, useEffect, useState } from "react";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaLockOpen,
  FaRedoAlt,
  FaTimes,
} from "react-icons/fa";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { isEmail } from "validator";

const SignInModal = () => {
  const [_email, setEmail] = useState("");
  const [_password, setPassword] = useState("");
  const [_otp, setOtp] = useState("");

  const [atOTPStage, setAtOTPStage] = useState(false);
  const [timeLeftToOTP, setTimeLeftToOTP] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState<
    | ""
    | "sending-otp"
    | "resending-otp"
    | "signing-in-with-otp"
    | "signing-in-with-google"
    | "signing-in-with-twitter"
    | "signing-in-with-discord"
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

    const email = _email.trim();
    const password = _password.trim();
    const otp = parseInt(_otp.trim());

    if (processing !== "") {
      return toast.error("Please wait for the previous task to complete");
    } else if (!isEmail(email)) {
      return toast.error("Please provide a valid email");
    } else if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    if (!atOTPStage) return await handleRequestOtp("sending-otp");

    if (isNaN(otp) || otp < 100_000 || otp > 999_999) {
      return toast.error("Please provide a valid OTP");
    }
  };

  const handleRequestOtp = async (
    _processing: "resending-otp" | "sending-otp"
  ) => {
    try {
      const email = _email.trim();
      const password = _password.trim();

      if (processing !== "") {
        return toast.error("Please wait for the previous task to complete");
      } else if (!isEmail(email)) {
        return toast.error("Please provide a valid email");
      } else if (password.length < 6) {
        return toast.error("Password must be at least 6 characters long");
      } else if (timeLeftToOTP > 0) {
        return toast.error(
          `Wait for ${timeLeftToOTP} seconds before resending OTP`
        );
      }
      setProcessing(_processing);

      // Send OTP
      await new Promise((resolve) => setTimeout(resolve, 2000));

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

  const handleGoogleSignin = async () => {
    try {
      if (processing !== "") {
        return toast.error("Please wait for the previous task to complete");
      }
      setProcessing("signing-in-with-google");

      // Send OTP
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setProcessing("");
      toast.success("Google signed in");
    } catch (error) {
      toast.error("Failed to initiate google signin");
      setProcessing("");
      console.error(error);
    }
  };

  const handleTwitterSignin = async () => {
    try {
      if (processing !== "") {
        return toast.error("Please wait for the previous task to complete");
      }
      setProcessing("signing-in-with-twitter");

      // Send OTP
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setProcessing("");
      toast.success("Twitter signed in");
    } catch (error) {
      toast.error("Failed to initiate twitter signin");
      setProcessing("");
      console.error(error);
    }
  };

  const handleDiscordSignin = async () => {
    try {
      if (processing !== "") {
        return toast.error("Please wait for the previous task to complete");
      }
      setProcessing("signing-in-with-discord");

      // Send OTP
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setProcessing("");
      toast.success("Discord signed in");
    } catch (error) {
      toast.error("Failed to initiate discord signin");
      setProcessing("");
      console.error(error);
    }
  };

  return (
    <BigImage blackOpacity={50} src={images.signin}>
      <div className="z-30 px-6 md:px-10 xl:px-16 w-full text-center text-base sm:text-xl">
        <div className="max-w-[600px] backdrop-blur-lg bg-white/20 rounded-[36px] shadow-xl mx-auto px-6 sm:px-9 py-6 sm:py-12">
          <div className="">
            <h2 className="font-proxima font-bold text-2xl sm:text-4xl">
              Sign in to <span className="">Teacat</span>
            </h2>
            <p className="pt-2 mx-auto max-w-[450px]">
              Discover, borrow, or buy your next favorite book at Teacat Books
            </p>
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
              <div className="mt-2.5">
                <div className="absolute top-0 bottom-0 h-full left-0 flex items-center justify-center px-5 z-20">
                  <FaLock />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  readOnly={atOTPStage || !!processing}
                  value={_password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-[52px] py-2 sm:py-3.5 rounded-xl bg-white/20"
                  placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute top-0 bottom-0 h-full right-0 flex items-center justify-center px-5 z-20"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {!atOTPStage ? (
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-xs sm:text-base hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              ) : (
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
                        <span className="text-sm sm:text-lg">{timeLeftToOTP}</span>
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
                  ) : atOTPStage && processing === "signing-in-with-otp" ? (
                    <>
                      Signing in
                      <ClipLoader color="#ffffff" size={20} />
                    </>
                  ) : (
                    <>Sign in</>
                  )}
                </button>
              </div>
            </form>
            <div className="pt-4 sm:pt-5">
              <div className="flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-6">
                <span className="block h-px bg-white/50 flex-1"></span>
                <p>OR</p>
                <span className="block h-px bg-white/50 flex-1"></span>
              </div>
              <div className="pt-4 sm:pt-5 flex items-center justify-center gap-4">
                <button
                  className="sm:w-[70px] sm:h-[70px] w-14 h-14 flex items-center justify-center bg-white/10 rounded-full"
                  disabled={!!processing}
                  onClick={handleGoogleSignin}
                >
                  {processing === "signing-in-with-google" ? (
                    <ClipLoader color="#ffffff" size={24} />
                  ) : (
                    <img
                      src="/icons/google.svg"
                      alt="Google"
                      className="max-w-[22px] sm:max-w-[30px]"
                    />
                  )}
                </button>
                <button
                  className="sm:w-[70px] sm:h-[70px] w-14 h-14 flex items-center justify-center bg-white/10 rounded-full"
                  disabled={!!processing}
                  onClick={handleTwitterSignin}
                >
                  {processing === "signing-in-with-twitter" ? (
                    <ClipLoader color="#ffffff" size={24} />
                  ) : (
                    <img
                      src="/icons/twitter.svg"
                      alt="Twitter"
                      className="max-w-[22px] sm:max-w-[30px]"
                    />
                  )}
                </button>
                <button
                  className="sm:w-[70px] sm:h-[70px] w-14 h-14 flex items-center justify-center bg-white/10 rounded-full"
                  disabled={!!processing}
                  onClick={handleDiscordSignin}
                >
                  {processing === "signing-in-with-discord" ? (
                    <ClipLoader color="#ffffff" size={24} />
                  ) : (
                    <img
                      src="/icons/discord.svg"
                      alt="Discord"
                      className="max-w-[22px] sm:max-w-[30px]"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BigImage>
  );
};
export default SignInModal;
