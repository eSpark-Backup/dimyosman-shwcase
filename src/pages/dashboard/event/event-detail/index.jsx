import { useSelector } from "react-redux";
import { BESProfile } from "../../../../components";

const EventDetails = () => {
  const { events } = useSelector((state) => state?.event);
  return <BESProfile type="event" data={events} />;
};

export default EventDetails;
