"use client";
import { images } from "@/source/config";
import BigImage from "../reusable/BigImage";
import { FormEventHandler, useEffect, useRef, useState } from "react";
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
import { getOauthToken, openWithPost } from "@/source/helpers";
import routes from "@/source/api/routes";
import { useAppDispatch } from "@/source/store/hooks";
import { setUserData, setUserLoading } from "@/source/store/slice/userSlice";
import { postApiJson } from "@/source/api";
import { saveToken } from "@/source/api/misc";
import { useRouter } from "next/navigation";
import SafeImage from "../reusable/SafeImage";

const SignInModal = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

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
    | "redirecting-to-profile"
  >("");

  const oauthRef = useRef({
    interval: null as NodeJS.Timeout | null,
    active: false,
  });

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
      const password = _password.trim();
      const otp = parseInt(_otp.trim());

      if (processing !== "") {
        return toast.error("Please wait for the previous task to complete.");
      } else if (!isEmail(email)) {
        return toast.error("Please provide a valid email.");
      } else if (password.length < 6) {
        return toast.error("Password must be at least 6 characters long.");
      }

      if (!atOTPStage) return await handleRequestOtp("sending-otp");

      if (isNaN(otp) || otp < 100_000 || otp > 999_999) {
        return toast.error("Please provide a valid OTP.");
      }

      setProcessing("signing-in-with-otp");
      dispatch(setUserLoading(true));

      const response = await postApiJson(routes.user.signin, {
        email,
        password,
        otp,
      });

      if (response.error || !response.user || !response.token) {
        toast.error(response.errorMessage ?? "Failed to sign in.");
        setProcessing("");
        return;
      }

      dispatch(setUserData(response.user));
      saveToken(response.token);
      toast.success("Sign in successful.");
      router.push("/profile");
      setProcessing("redirecting-to-profile");
    } catch (error) {
      toast.error("Failed to sign in.");
      console.error(error);
      setProcessing("");
      dispatch(setUserLoading(false));
    }
  };

  const handleRequestOtp = async (
    _processing: "resending-otp" | "sending-otp"
  ) => {
    try {
      const email = _email.trim();
      const password = _password.trim();

      if (processing !== "") {
        return toast.error("Please wait for the previous task to complete.");
      } else if (!isEmail(email)) {
        return toast.error("Please provide a valid email.");
      } else if (password.length < 6) {
        return toast.error("Password must be at least 6 characters long.");
      } else if (timeLeftToOTP > 0) {
        return toast.error(
          `Wait for ${timeLeftToOTP} seconds before resending OTP.`
        );
      }
      setProcessing(_processing);

      // Send OTP
      const response = await postApiJson(routes.user.getSigninOtp, {
        email,
        password,
      });

      if (response.error || !response.message) {
        toast.error(response.errorMessage ?? "Failed to send OTP.");
        setProcessing("");
        return;
      }

      setProcessing("");
      toast.success("OTP sent successfully.");
      setAtOTPStage(true);
      setTimeLeftToOTP(30);
    } catch (error) {
      toast.error("Failed to send OTP.");
      setProcessing("");
      console.error(error);
    }
  };

  const handleGoogleSignin = async () => {
    try {
      if (processing !== "") {
        return toast.error("Please wait for the previous task to complete.");
      } else if (oauthRef.current.active) {
        return toast.error("Please wait for the previous task to complete.");
      } else if (oauthRef.current.interval) {
        clearInterval(oauthRef.current.interval);
      }

      const token = getOauthToken();
      const handle = openWithPost(
        routes.oauth.google,
        { token },
        {
          width: 800,
          height: 600,
          top: 50,
          left: 100,
          additionalFeatures: "resizable=yes,scrollbars=yes",
        }
      );
      if (!handle) return toast.error("Please enable browser popup!.");

      dispatch(setUserLoading(true));
      setProcessing("signing-in-with-google");

      oauthRef.current.interval = setInterval(async () => {
        console.log(handle.closed);
        if (handle.closed) {
          if (oauthRef.current.interval) {
            clearInterval(oauthRef.current.interval);
          }
          oauthRef.current.active = false;

          const response = await postApiJson(routes.oauth.googleLogin, {
            token,
          });
          if (response.error || !response.data || !response.token) {
            toast.error(response.errorMessage ?? "Failed to login.");
            setProcessing("");
          } else {
            dispatch(setUserData(response.data));
            saveToken(response.token);
            toast.success("Google login successful.");
            router.push("/profile");
            setProcessing("redirecting-to-profile");
          }

          dispatch(setUserLoading(false));
        }
      }, 500);
    } catch (error) {
      toast.error("Failed to complete google signin.");
      setProcessing("");
      console.error(error);
    }
  };

  const handleTwitterSignin = async () => {
    try {
      if (processing !== "") {
        return toast.error("Please wait for the previous task to complete.");
      } else if (oauthRef.current.active) {
        return toast.error("Please wait for the previous task to complete.");
      } else if (oauthRef.current.interval) {
        clearInterval(oauthRef.current.interval);
      }

      const token = getOauthToken();
      const handle = openWithPost(
        routes.oauth.twitter,
        { token },
        {
          width: 800,
          height: 600,
          top: 50,
          left: 100,
          additionalFeatures: "resizable=yes,scrollbars=yes",
        }
      );
      if (!handle) return toast.error("Please enable browser popup!.");

      dispatch(setUserLoading(true));
      setProcessing("signing-in-with-twitter");

      oauthRef.current.interval = setInterval(async () => {
        console.log(handle.closed);
        if (handle.closed) {
          if (oauthRef.current.interval) {
            clearInterval(oauthRef.current.interval);
          }
          oauthRef.current.active = false;

          const response = await postApiJson(routes.oauth.twitterLogin, {
            token,
          });
          if (response.error || !response.data || !response.token) {
            toast.error(response.errorMessage ?? "Failed to login.");
            setProcessing("");
          } else {
            dispatch(setUserData(response.data));
            saveToken(response.token);
            toast.success("Twitter login successful.");
            router.push("/profile");
            setProcessing("redirecting-to-profile");
          }

          dispatch(setUserLoading(false));
        }
      }, 500);
    } catch (error) {
      toast.error("Failed to initiate twitter signin.");
      setProcessing("");
      console.error(error);
    }
  };

  const handleDiscordSignin = async () => {
    try {
      if (processing !== "") {
        return toast.error("Please wait for the previous task to complete.");
      } else if (oauthRef.current.active) {
        return toast.error("Please wait for the previous task to complete.");
      } else if (oauthRef.current.interval) {
        clearInterval(oauthRef.current.interval);
      }

      const token = getOauthToken();
      const handle = openWithPost(
        routes.oauth.discord,
        { token },
        {
          width: 800,
          height: 600,
          top: 50,
          left: 100,
          additionalFeatures: "resizable=yes,scrollbars=yes",
        }
      );
      if (!handle) return toast.error("Please enable browser popup!.");

      dispatch(setUserLoading(true));
      setProcessing("signing-in-with-discord");

      oauthRef.current.interval = setInterval(async () => {
        console.log(handle.closed);
        if (handle.closed) {
          if (oauthRef.current.interval) {
            clearInterval(oauthRef.current.interval);
          }
          oauthRef.current.active = false;

          const response = await postApiJson(routes.oauth.discordLogin, {
            token,
          });
          if (response.error || !response.data || !response.token) {
            toast.error(response.errorMessage ?? "Failed to login.");
            setProcessing("");
          } else {
            dispatch(setUserData(response.data));
            saveToken(response.token);
            toast.success("Discord login successful.");
            router.push("/profile");
            setProcessing("redirecting-to-profile");
          }

          dispatch(setUserLoading(false));
        }
      }, 500);
    } catch (error) {
      toast.error("Failed to initiate discord signin.");
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
                      className="p-2 bg-bad-red/50 hover:bg-bad-red-dark rounded-r-xl flex items-center justify-center min-w-[60px]"
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
                  {processing === "redirecting-to-profile" ? (
                    <>Redirecting...</>
                  ) : processing === "signing-in-with-discord" ? (
                    <>Discord Signin...</>
                  ) : processing === "signing-in-with-google" ? (
                    <>Google Signin...</>
                  ) : processing === "signing-in-with-twitter" ? (
                    <>Twitter Signin...</>
                  ) : !atOTPStage && processing !== "sending-otp" ? (
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
            <div className="pt-4 sm:pt-5 max-sm:pb-2">
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
                    <SafeImage
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
                    <SafeImage
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
                    <SafeImage
                      src="/icons/discord.svg"
                      alt="Discord"
                      className="max-w-[22px] sm:max-w-[30px]"
                    />
                  )}
                </button>
              </div>
            </div>
            <p className="pt-3 sm:pt-4 text-xs sm:text-sm text-white/70">
              {"Don't"} have an account? Use <strong>email</strong> or{" "}
              <strong>google</strong> to sign up
            </p>
          </div>
        </div>
      </div>
    </BigImage>
  );
};
export default SignInModal;
