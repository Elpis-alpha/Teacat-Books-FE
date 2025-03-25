import { postApiFormData, postApiJson } from "@/source/api";
import routes from "@/source/api/routes";
import { useAppDispatch, useAppSelector } from "@/source/store/hooks";
import {
  setUserAvatar,
  setUserBio,
  setUserKeepBorrowHistoryPrivate,
  setUserName,
} from "@/source/store/slice/userSlice";
import { midProfileProps } from "@/source/types/misc";
import { FormEventHandler, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaSave, FaTimes } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import SafeImage from "../reusable/SafeImage";

const EditNameImageBio = ({ profileProcessing }: midProfileProps) => {
  const userData = useAppSelector((state) => state.user).data!;
  const dispatch = useAppDispatch();
  const [processing, setProcessing] = profileProcessing;

  const [_name, setName] = useState(userData.name);
  const [_bio, setBio] = useState(userData.bio);
  const [_keepBorrowHistoryPrivate, setKeepBorrowHistoryPrivate] = useState(
    !!userData.keepBorrowHistoryPrivate
  );

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageViewURL, setImageViewURL] = useState(userData.avatar);
  const imageURL = useMemo(() => {
    if (imageViewURL.startsWith("https://res.cloudinary.com/")) {
      return imageViewURL.replace("/upload/", `/upload/c_scale,w_300/`);
    }
    return imageViewURL;
  }, [imageViewURL]);

  const saveImage = async (imageFile: any) => {
    if (processing) return toast("Please wait");
    setProcessing("image");

    const serverData = await postApiFormData(routes.user.uploadAvatar, {
      image: imageFile,
    });

    if (!serverData.error && serverData.image) {
      dispatch(setUserAvatar(serverData.image));
      toast.success("Avatar Uploaded");
    } else {
      toast.error(serverData.errorMessage || "Failed tp upload avatar");
      await removeImage(true);
    }
    setProcessing("");
  };

  const removeImage = async (fromBE = false) => {
    if (imageInputRef.current) imageInputRef.current.value = "";

    if (!fromBE) {
      setImageViewURL(userData.avatar);
    }

    if (fromBE) {
      setProcessing("remove-image");
      const response = await postApiJson(routes.user.resetAvatar);
      if (response.error) {
        toast.error(response.errorMessage || "Failed to reset avatar");
      } else {
        dispatch(setUserAvatar(response.image));
        setImageViewURL(response.image);
        toast.success("Avatar removed successfully");
      }
      setProcessing("");
    }
  };

  const handleImageInput: FormEventHandler<HTMLInputElement> = (e) => {
    if (processing) {
      e.preventDefault();
      return toast("Please wait");
    }
    const input = e.target;
    const img = (input as any)?.files?.[0];

    if (img?.["type"]?.includes?.("image")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setImageViewURL(e?.target?.result as string);
        if (setImageViewURL) setImageViewURL(e?.target?.result as string);
        saveImage(img);
      };
      reader.onerror = () => {
        toast.error("Invalid File");
        removeImage();
      };
      reader.readAsDataURL(img);
    } else {
      toast.error("Invalid File");
      removeImage();
    }
  };

  const saveName: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (processing) return toast("Please wait");
    if (_name.trim() === userData.name.trim()) return toast("No changes made");

    setProcessing("name");

    const response = await postApiJson(routes.user.edit, {
      name: _name.trim(),
    });

    if (response.error) {
      toast.error(response.errorMessage || "Failed to update name");
    } else {
      dispatch(setUserName(_name.trim()));
      toast.success("Name Updated");
    }
    setProcessing("");
  };

  const saveBio: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (processing) return toast("Please wait");
    if (_bio.trim() === userData.bio.trim()) return toast("No changes made");

    setProcessing("bio");

    const response = await postApiJson(routes.user.edit, {
      bio: _bio.trim(),
    });

    if (response.error) {
      toast.error(response.errorMessage || "Failed to update bio");
    } else {
      dispatch(setUserBio(_bio.trim()));
      toast.success("Bio Updated");
    }
    setProcessing("");
  };

  const saveKeepBorrowHistoryPrivate = async (value: boolean) => {
    if (processing) return toast("Please wait");
    if (value === userData.keepBorrowHistoryPrivate)
      return toast("No changes made");

    setProcessing("keepBorrowHistoryPrivate");

    const response = await postApiJson(routes.user.edit, {
      keepBorrowHistoryPrivate: value,
    });

    if (response.error) {
      toast.error(response.errorMessage || "Failed to borrow history privacy");
    } else {
      dispatch(setUserKeepBorrowHistoryPrivate(value));
      setKeepBorrowHistoryPrivate(value);
      toast.success("Borrow history privacy updated");
    }
    setProcessing("");
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="w-[200px] h-[200px] mx-auto">
        <SafeImage
          src={imageURL}
          alt={userData.name + " Profile"}
          className="w-full h-full rounded-full z-10 absolute inset-0 object-cover border-white border-1"
        />
        <div className="opacity-0 hover:opacity-100 bg-black/50 w-full h-full rounded-full absolute z-20 flex items-center justify-center">
          <input
            onInput={handleImageInput}
            className="opacity-0 cursor-pointer w-full h-full block inset-0 rounded-full absolute z-20"
            type="file"
            disabled={!!processing}
            readOnly={!!processing}
            accept="image/*"
            ref={imageInputRef}
          />
          <div className="text-white font-proxima font-bold text-xl">
            UPDATE
          </div>
        </div>
        {(processing === "image" || processing === "remove-image") && (
          <div className="bg-black/50 w-full h-full rounded-full absolute z-40 flex items-center justify-center">
            <ClipLoader color="#fff" size={30} />
          </div>
        )}
        <div className="bg-black/50 w-full h-full rounded-full absolute z-0 flex items-center justify-center">
          <ClipLoader color="#fff" size={30} />
        </div>

        <div className="absolute top-4.5 -right-3 z-30 flex">
          <button
            onClick={() => {
              if (!processing) removeImage(true);
            }}
            disabled={!!processing}
            className="w-[30px] h-[30px] bg-bad-red rounded-full text-white flex items-center justify-center hover:bg-bad-red-dark"
          >
            <FaTimes />
          </button>
        </div>
      </div>
      <form onSubmit={saveName} className="">
        <label className="block" htmlFor="name">
          Name
        </label>
        <div className="pt-1.5 flex gap-2.5">
          <input
            type="text"
            id="name"
            readOnly={!!processing}
            value={_name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/20 px-4 sm:px-5 py-2.5 sm:py-3.5 w-full rounded-xl"
          />
          <button
            disabled={!!processing}
            className="bg-highlight hover:bg-highlight-dark text-white p-2 rounded-xl w-16 flex items-center justify-center"
          >
            {processing === "name" ? (
              <ClipLoader color="#fff" size={20} />
            ) : (
              <FaSave />
            )}
          </button>
        </div>
      </form>
      <form onSubmit={saveBio} className="">
        <label className="block" htmlFor="bio">
          Biography
        </label>
        <div className="pt-1.5 flex gap-2.5 items-start">
          <textarea
            id="bio"
            readOnly={!!processing}
            value={_bio}
            onChange={(e) => setBio(e.target.value)}
            rows={6}
            className="bg-white/20 px-4 sm:px-5 py-2.5 sm:py-3.5 w-full rounded-xl overflow-auto"
          />
          <button
            disabled={!!processing}
            className="bg-highlight hover:bg-highlight-dark text-white px-2 py-4.5 rounded-xl w-16 flex items-center justify-center"
          >
            {processing === "bio" ? (
              <ClipLoader color="#fff" size={20} />
            ) : (
              <FaSave />
            )}
          </button>
        </div>
      </form>
      <div
        className={
          "w-full flex items-center gap-4 " +
          (!!processing ? "readonly-input" : "")
        }
      >
        <button
          type="button"
          onClick={() => {
            if (!processing)
              saveKeepBorrowHistoryPrivate(!_keepBorrowHistoryPrivate);
          }}
          className="w-10 h-10 rounded-xl p-1 flex items-center justify-center bg-white/20 hover:bg-white/40"
        >
          {processing === "keepBorrowHistoryPrivate" ? (
            <ClipLoader color="#fff" size={20} />
          ) : (
            _keepBorrowHistoryPrivate && <FaCheck />
          )}
        </button>
        <label
          className="block flex-1 cursor-pointer"
          onClick={() => {
            if (!processing)
              saveKeepBorrowHistoryPrivate(!_keepBorrowHistoryPrivate);
          }}
        >
          Keep Borrow History Private
        </label>
      </div>
    </div>
  );
};
export default EditNameImageBio;
