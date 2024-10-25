import { activityMain, eventActivityImage, eventUserImage } from "../../../assets";
import { ActivityCard } from "../../../components";

const Activity = () => {
  return (
    <>
      <ActivityCard
        activity={"event"}
        mainImage={activityMain}
        userName={"EcoLux Designs"}
        activityName={"Ecolux Chic Pop-Up"}
        activityMaker={"Sustainable Fashion"}
        content={[
          "A limited-time clothing pop-up store featuring EcoLux Designs' latest collection of eco-friendly luxury fashion.",
          "Shoppers can explore exclusive, high-end pieces crafted from organic and recycled materials, combining sustainability with modern style.",
          "The event will also include workshops on sustainable fashion and personal styling sessions."
        ]}
        activityLocation={"Urban Pop-Up Studio 3B"}
        activityLocation2={"Urban Pop-Up Pavilion"}
        activityAddress={"123 Williamsburg Ave, Brooklyn, NY 11211"}
        value={"28.02.2025."}
        deadline={"until 15.4.2025."}
        userImage={eventUserImage}
        activityImage={eventActivityImage}
      />
    </>
  );
};

export default Activity;
