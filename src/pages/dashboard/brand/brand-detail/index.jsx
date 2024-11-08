import { useSelector } from "react-redux";
import { BESProfile } from "../../../../components";

const BrandDetails = () => {
  const { brands } = useSelector((state) => state.brand);
  return <BESProfile type="brand" data={brands} />;
};

export default BrandDetails;
