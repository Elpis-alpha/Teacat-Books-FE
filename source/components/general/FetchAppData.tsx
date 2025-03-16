import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/source/store/hooks";
import {
  removeUserData,
  setUserData,
  setUserLoading,
} from "@/source/store/slice/userSlice";
import { getToken } from "@/source/api/misc";
import { getApiJson } from "@/source/api";
import routes from "@/source/api/routes";

const FetchAppData = () => {
  const dispatch = useAppDispatch();
  const { available, loading, tested } = useAppSelector((state) => state.user);

  useEffect(() => {
    // start login
    const login = async () => {
      dispatch(setUserLoading(true));
      try {
        if (!getToken()) return dispatch(removeUserData());

        const response = await getApiJson(routes.user.me);
        if (response.error) throw new Error(response.error);
        if (!response.user) throw new Error("User not found");

        dispatch(setUserData(response.user));
      } catch (error) {
        console.error(error);
        dispatch(removeUserData());
      }
    };

    if (!available && !loading && !tested) login();
  }, [dispatch, available, loading, tested]);

  return null;
};
export default FetchAppData;
