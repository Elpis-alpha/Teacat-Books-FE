import { getApiJson, postApiJson } from "@/source/api";
import { getToken } from "@/source/api/misc";
import routes from "@/source/api/routes";
import { openWithPost } from "@/source/helpers";
import { useAppDispatch, useAppSelector } from "@/source/store/hooks";
import {
  setUserDiscord,
  setUserMail,
  setUserTwitter,
} from "@/source/store/slice/userSlice";
import { midProfileProps } from "@/source/types/misc";
import { useRef } from "react";
import toast from "react-hot-toast";
import { FaLink, FaUnlink } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import SafeImage from "../reusable/SafeImage";

const EditSocials = ({ profileProcessing }: midProfileProps) => {
  const dispatch = useAppDispatch();
  const [processing, setProcessing] = profileProcessing;
  const { mail, discord, twitter } = useAppSelector((state) => state.user)
    .data!;
  const oauthRef = useRef({
    interval: null as NodeJS.Timeout | null,
    active: false,
  });

  const connectGoogle = async () => {
    try {
      if (processing !== "") {
        return toast.error("Please wait for the previous task to complete");
      } else if (oauthRef.current.active) {
        return toast.error("Please wait for the previous task to complete");
      } else if (oauthRef.current.interval) {
        clearInterval(oauthRef.current.interval);
      }

      const token = "___:" + getToken();
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
      if (!handle) return toast.error("Please enable browser popup!");

      setProcessing("connecting-google");

      oauthRef.current.interval = setInterval(async () => {
        console.log(handle.closed);
        if (handle.closed) {
          if (oauthRef.current.interval) {
            clearInterval(oauthRef.current.interval);
          }
          oauthRef.current.active = false;

          const response = await getApiJson(routes.user.me);
          const _mail = response?.user?.mail;
          if (
            response.error ||
            !response.user ||
            _mail?.authType !== "google"
          ) {
            toast.error(response.errorMessage ?? "Failed to link google");
          } else {
            dispatch(setUserMail(_mail));
            toast.success("Google link successful");
          }
          setProcessing("");
        }
      }, 500);
    } catch (error) {
      toast.error("Failed to link google");
      setProcessing("");
      console.error(error);
    }
  };

  const connectTwitter = async () => {
    try {
      if (processing !== "") {
        return toast.error("Please wait for the previous task to complete");
      } else if (oauthRef.current.active) {
        return toast.error("Please wait for the previous task to complete");
      } else if (oauthRef.current.interval) {
        clearInterval(oauthRef.current.interval);
      }

      const token = "___:" + getToken();
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
      if (!handle) return toast.error("Please enable browser popup!");

      setProcessing("connecting-twitter");

      oauthRef.current.interval = setInterval(async () => {
        console.log(handle.closed);
        if (handle.closed) {
          if (oauthRef.current.interval) {
            clearInterval(oauthRef.current.interval);
          }
          oauthRef.current.active = false;

          const response = await getApiJson(routes.user.me);
          const _twitter = response?.user?.twitter;
          if (response.error || !response.user || _twitter?.active === false) {
            toast.error(response.errorMessage ?? "Failed to link twitter");
          } else {
            dispatch(setUserTwitter(_twitter));
            toast.success("Twitter link successful");
          }
          setProcessing("");
        }
      }, 500);
    } catch (error) {
      toast.error("Failed to link twitter");
      setProcessing("");
      console.error(error);
    }
  };
  const disconnectTwitter = async () => {
    try {
      if (processing !== "") {
        return toast.error("Please wait for the previous task to complete");
      }

      setProcessing("disconnecting-twitter");
      const response = await postApiJson(routes.oauth.twitterDisconnect);
      if (response.error || !response.message) {
        toast.error(response.errorMessage || "Failed to unlink twitter");
      } else {
        dispatch(setUserTwitter({ active: false }));
        toast.success("Twitter unlinked successfully");
      }
      setProcessing("");
    } catch (error) {
      toast.error("Failed to unlink twitter");
      setProcessing("");
      console.error(error);
    }
  };

  const connectDiscord = async () => {
    try {
      if (processing !== "") {
        return toast.error("Please wait for the previous task to complete");
      } else if (oauthRef.current.active) {
        return toast.error("Please wait for the previous task to complete");
      } else if (oauthRef.current.interval) {
        clearInterval(oauthRef.current.interval);
      }

      const token = "___:" + getToken();
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
      if (!handle) return toast.error("Please enable browser popup!");

      setProcessing("connecting-discord");

      oauthRef.current.interval = setInterval(async () => {
        console.log(handle.closed);
        if (handle.closed) {
          if (oauthRef.current.interval) {
            clearInterval(oauthRef.current.interval);
          }
          oauthRef.current.active = false;

          const response = await getApiJson(routes.user.me);
          const _discord = response?.user?.discord;
          if (response.error || !response.user || _discord?.active === false) {
            toast.error(response.errorMessage ?? "Failed to link discord");
          } else {
            dispatch(setUserDiscord(_discord));
            toast.success("Discord link successful");
          }
          setProcessing("");
        }
      }, 500);
    } catch (error) {
      toast.error("Failed to link discord");
      setProcessing("");
      console.error(error);
    }
  };
  const disconnectDiscord = async () => {
    try {
      if (processing !== "") {
        return toast.error("Please wait for the previous task to complete");
      }

      setProcessing("disconnecting-discord");
      const response = await postApiJson(routes.oauth.discordDisconnect);
      if (response.error || !response.message) {
        toast.error(response.errorMessage || "Failed to unlink discord");
      } else {
        dispatch(setUserDiscord({ active: false }));
        toast.success("Discord unlinked successfully");
      }
      setProcessing("");
    } catch (error) {
      toast.error("Failed to unlink discord");
      setProcessing("");
      console.error(error);
    }
  };

  return (
    <div className="w-full">
      <p>Socials</p>
      <div className="mt-4 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <SafeImage
            src="/icons/google.svg"
            alt="Google"
            className="w-[22px] sm:w-[30px]"
          />
          <p>Google</p>
          {mail.authType === "google" ? (
            <a
              href={`mailto:${mail.email}`}
              className="flex-1 text-right line-clamp-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              {mail.email}
            </a>
          ) : (
            <p className="flex-1 text-right opacity-50 line-clamp-1">Not connected</p>
          )}
          {mail.authType !== "google" && (
            <button
              disabled={!!processing}
              onClick={connectGoogle}
              className="rounded-xl w-10 sm:w-12.5 h-8 sm:h-10 flex items-center justify-center bg-highlight hover:bg-highlight-dark"
            >
              {processing === "connecting-google" ? (
                <ClipLoader color="#fff" size={16} />
              ) : (
                <FaLink className="text-xs sm:text-base" />
              )}
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <SafeImage
            src="/icons/twitter.svg"
            alt="Twitter"
            className="w-[22px] sm:w-[30px]"
          />
          <p>Twitter</p>
          {twitter.active ? (
            <a
              href={`https://twitter.com/intent/user?user_id=${twitter.id}`}
              className="flex-1 text-right line-clamp-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              @{twitter.username}
            </a>
          ) : (
            <p className="flex-1 text-right opacity-50 line-clamp-1">Not connected</p>
          )}
          <button
            disabled={!!processing}
            onClick={twitter.active ? disconnectTwitter : connectTwitter}
            className={
              "rounded-xl w-10 sm:w-12.5 h-8 sm:h-10 flex items-center justify-center " +
              (twitter.active
                ? "bg-bad-red hover:bg-bad-red-dark"
                : "bg-highlight hover:bg-highlight-dark")
            }
          >
            {processing === "connecting-twitter" ||
            processing === "disconnecting-twitter" ? (
              <ClipLoader color="#fff" size={16} />
            ) : twitter.active ? (
              <FaUnlink className="text-xs sm:text-base" />
            ) : (
              <FaLink className="text-xs sm:text-base" />
            )}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <SafeImage
            src="/icons/discord.svg"
            alt="Discord"
            className="w-[22px] sm:w-[30px]"
          />
          <p>Discord</p>
          {discord.active ? (
            <a
              href={`https://discordapp.com/users/${discord.id}`}
              className="flex-1 text-right line-clamp-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              {discord.username}
            </a>
          ) : (
            <p className="flex-1 text-right opacity-50 line-clamp-1">Not connected</p>
          )}
          <button
            disabled={!!processing}
            onClick={discord.active ? disconnectDiscord : connectDiscord}
            className={
              "rounded-xl w-10 sm:w-12.5 h-8 sm:h-10 flex items-center justify-center " +
              (discord.active
                ? "bg-bad-red hover:bg-bad-red-dark"
                : "bg-highlight hover:bg-highlight-dark")
            }
          >
            {processing === "connecting-discord" ||
            processing === "disconnecting-discord" ? (
              <ClipLoader color="#fff" size={16} />
            ) : discord.active ? (
              <FaUnlink className="text-xs sm:text-base" />
            ) : (
              <FaLink className="text-xs sm:text-base" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditSocials;
