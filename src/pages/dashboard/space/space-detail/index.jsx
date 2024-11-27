import { useState } from "react";
import { useSelector } from "react-redux";
import { BESProfile } from "../../../../components";
import SpaceInquireModal from "./space-inquire-modal";

const SpaceDetails = () => {
  const { spaces } = useSelector((state) => state.space);
  const [open, setOpen] = useState(false);
  const spaceInquire = (id) => {
    setOpen(id);
  };
  const handleSave = (id) => {
    ///save functionality
    console.log(id, "save");
    setOpen(false);
  };
  return (
    <>
      <BESProfile spaceInquire={spaceInquire} type="space" data={spaces} />
      <SpaceInquireModal
        open={open}
        handleClose={() => setOpen(null)}
        handleSave={handleSave}
      />
    </>
  );
};

export default SpaceDetails;
