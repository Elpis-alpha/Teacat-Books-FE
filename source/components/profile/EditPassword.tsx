import { postApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import { useAppSelector } from "@/source/store/hooks";
import { midProfileProps } from "@/source/types/misc";
import { FormEventHandler, useState } from "react";
import toast from "react-hot-toast";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const EditPassword = ({ profileProcessing }: midProfileProps) => {
  const [processing, setProcessing] = profileProcessing;
  const userData = useAppSelector((state) => state.user).data!;

  const [oldPassword, setOldPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const changePassword: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (processing) return toast("Please wait");
    if (newPassword.trim().length < 6)
      return toast.error("New password too short");
    if (oldPassword.trim() === newPassword.trim())
      return toast.error("New password is the same as the old password");
    setProcessing("changing-password");

    const response = await postApiJson(routes.user.changePassword, {
      oldPassword: oldPassword.trim(),
      newPassword: newPassword.trim(),
    });

    if (response.error) {
      toast.error(response.errorMessage || "Failed to update password");
    } else {
      setOldPassword("");
      setNewPassword("");
      toast.success("Password Updated");
    }

    setProcessing("");
  };

  return (
    <div>
      <form
        onSubmit={changePassword}
        className="flex gap-1.5 flex-col"
        autoComplete="off"
      >
        <p>Change Password</p>
        <div className="flex gap-2.5">
          <div className="absolute opacity-50 top-0 bottom-0 h-full left-0 flex items-center justify-center px-5 z-20">
            <FaEnvelope />
          </div>
          <input
            type="email"
            id="email"
            readOnly={true}
            value={userData.mail.email}
            className="bg-white/20 pl-[55px] pr-5 py-3.5 w-full rounded-xl"
          />
        </div>
        <div className="flex gap-1.5">
          <div className="w-full">
            <input
              type={showOldPassword ? "text" : "password"}
              placeholder="Old Password"
              autoComplete="new-password"
              readOnly={!!processing}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="bg-white/20 pl-5 pr-[55px] py-3.5 w-full rounded-xl bl-auto"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword((p) => !p)}
              className="absolute top-0 bottom-0 h-full right-0 flex items-center justify-center px-5 z-20"
            >
              {showOldPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <div className="w-full">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              autoComplete="new-password"
              readOnly={!!processing}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-white/20 pl-5 pr-[55px] py-3.5 w-full rounded-xl bl-auto"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((p) => !p)}
              className="absolute top-0 bottom-0 h-full right-0 flex items-center justify-center px-5 z-20"
            >
              {showNewPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>
        <button
          disabled={!!processing}
          className="bg-highlight hover:bg-highlight-dark text-white px-2 py-3 rounded-xl w-full flex items-center justify-center gap-2"
        >
          {processing === "changing-password" ? (
            <>
              Changing Password
              <ClipLoader color="#fff" size={20} />
            </>
          ) : (
            "Change Password"
          )}
        </button>
      </form>
    </div>
  );
};
export default EditPassword;
