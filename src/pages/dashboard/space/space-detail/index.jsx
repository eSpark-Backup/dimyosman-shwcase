import { useSelector } from "react-redux";
import { BESProfile } from "../../../../components";

const SpaceDetails = () => {
  const { spaces } = useSelector((state) => state.space);
  return <BESProfile type="space" data={spaces} />;
};

export default SpaceDetails;
