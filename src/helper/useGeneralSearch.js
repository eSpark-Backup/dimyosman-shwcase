import { useDispatch, useSelector } from "react-redux";
import { useGetGeneralSearchQuery } from "../services/general";
import {
  setAllGeneralData,
  setAllGeneralSearchLoading,
} from "../store/slices/search";

const useGeneralSearch = ({ page, searchQuery }) => {
  const { parameters, search_query } = useSelector((state) => state.search);
  const dispatch = useDispatch();

  const {
    data: generalData,
    isSuccess: isGeneralDataSuccess,
    isLoading: isGeneralDataLoading,
    isFetching: isGeneralDataFetching,
    error,
  } = useGetGeneralSearchQuery(
    { parameters, page, pageSize: 10 },
    {
      refetchOnMountOrArgChange: !(searchQuery || search_query) ? false : true,
    }
  );

  dispatch(setAllGeneralSearchLoading(isGeneralDataFetching));

  if (isGeneralDataSuccess) {
    if (generalData?.data) {
      dispatch(setAllGeneralData(generalData?.data));
    }
  }

  return {
    generalData,
    isGeneralDataSuccess,
    isGeneralDataLoading,
    isGeneralDataFetching,
    error,
  };
};

export default useGeneralSearch;
