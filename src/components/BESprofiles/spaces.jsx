import { useSelector } from "react-redux";

const Spaces = ({ myProfile }) => {
  const { spaces } = useSelector((state) => state?.space);
  const mySpaces = spaces.filter(
    (space) => space.owned && space.by === myProfile.id
  );
  console.log(mySpaces)
  return <>Spaces</>;
};

export default Spaces;
