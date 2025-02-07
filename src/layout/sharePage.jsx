import { useEffect } from "react";
import SplashScreen from "./splash";
import { useGetSharableLinkQuery } from "../services/notifications";
import { useQuery } from "../utils";

const SharedPage = () => {
  const token = window.localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_FE_BASE_URL;
  const query = useQuery();
  const data2 = encodeURIComponent(query.get("data"));
  const { data, isSuccess } = useGetSharableLinkQuery({ data: data2 });
  useEffect(() => {
    if (isSuccess) {
      if (token) {
        const url = `${baseUrl}${data?.data?.type}/${data?.data?.id}`;
        window.location.href = url;
      } else {
        ////functionality remaining
      }
    }
  }, [isSuccess]);
  return <SplashScreen />;
};

export default SharedPage;
