import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Box } from "@mui/material";
import {
  BrandCard,
  OutlinedTabs,
  ProfileAboutSection,
  ProfileCard,
  ProfileEvents,
  ProfileSpaces,
} from "../../components";
import { useGetAllBrandsQuery } from "../../services/brands";
import { useGetAllEventsQuery } from "../../services/events";
import { useGetAllSpaceQuery } from "../../services/space";

const SharedProfile = ({ user }) => {
  const [brands, setBrands] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [mySpaces, setMySpaces] = useState([]);

  const { data: brandData, isSuccess: isBrandSuccess } = useGetAllBrandsQuery(
    { publicProfile: true, id: user?.id, entity: "BRAND", pageSize: 100 },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  const { data: eventData, isSuccess: isEventSuccess } = useGetAllEventsQuery(
    { publicProfile: true, id: user?.id, entity: "EVENT", pageSize: 100 },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  const { data: spaceData, isSuccess: isSpaceSuccess } = useGetAllSpaceQuery(
    { publicProfile: true, id: user?.id, entity: "SPACE", pageSize: 100 },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  useEffect(() => {
    if (isBrandSuccess) {
      const brandsArr = brandData?.data?.brands;
      const brands = brandsArr?.map((item) => ({
        profileImage: item?.brandImage,
        brandName: item?.brandName,
        brandCategory:
          item?.brandCategory?.map((category) => category.name) || [],
        description: item?.details?.description,
        id: item?.id,
        brandImage: item?.coverImages[0]?.url,
        status: item?.status,
        shareableLink: item?.shareableLink,
        isFavourite: item?.isFavourite,
        isFollowed: item?.isFollowed,
      }));

      setBrands(brands);
    }
  }, [isBrandSuccess, brandData]);

  useEffect(() => {
    if (isSpaceSuccess) {
      const spaceArr = spaceData?.data?.spaces;
      const spaces = spaceArr?.map((item) => {
        const dayPricing = item?.pricing?.find(
          (priceItem) => priceItem.term === "Day"
        );

        return {
          spacePic: item?.coverImages?.[0]?.url,
          spaceName: item?.spaceName,
          spaceAddress: item?.brand?.brandName,
          spaceDescription: item?.details?.description,
          spacePrice: dayPricing ? `$${dayPricing.price}/day` : "N/A",
          spaceDeadline: dayPricing
            ? `miniumum lease: ${dayPricing?.minimum} days`
            : "N/A",
          id: item?.id,
          status: item?.status,
        };
      });

      setMySpaces(spaces);
    }
  }, [isSpaceSuccess, spaceData]);

  useEffect(() => {
    if (isEventSuccess) {
      const eventArr = eventData?.data?.events;
      const eventsData = eventArr?.map((item) => ({
        slides: [item?.coverImages?.[0]?.url],
        profileName: item?.eventName,
        category: item?.eventCategory?.map((category) => category.name) || [],
        id: item?.id,
        eventStatus: item?.eventStatus,
        status: item?.status,
        tabs: [
          {
            props: {
              details: {
                overview: item?.details?.description || null,
              },
            },
          },
        ],
        details: {
          by: item?.brand?.brandName,
          starting: dayjs
            .utc(item?.eventDate?.[0]?.startDate)
            .startOf("day")
            .local()
            .format("DD.MM.YYYY"),
          RSVP: item?.rsvpCount,
        },
        startDate: dayjs.utc(item?.eventDate[0]?.startDate),
        endDate: dayjs.utc(item?.eventDate[0]?.endDate),
        rsvpDates: item?.event_rsvp?.attendanceDates?.rsvpDates
          ? item?.event_rsvp?.attendanceDates?.rsvpDates?.map(
              (item) => item.dateTime
            )
          : [],
      }));

      setMyEvents(eventsData);
    }
  }, [isEventSuccess, eventData]);

  const profileTabs = [
    {
      label: "About",
      component: (
        <ProfileAboutSection
          myProfileData={user}
          content={user?.profileAbout}
        />
      ),
    },
    ...(brands?.length > 0
      ? [
          {
            label: "Brands",
            component: (
              <BrandCard
                myProfile={false}
                items={brands}
                filter1={"All"}
                filter2={"Published"}
                filter3={"Draft"}
                filter4={"Archive"}
                loading={false}
              />
            ),
          },
        ]
      : []),
    ...(myEvents?.length > 0
      ? [
          {
            label: "Events",
            component: (
              <ProfileEvents
                myProfile={false}
                filter1={"All"}
                filter2={"Published"}
                filter3={"Draft"}
                filter4={"Archive"}
                filter5={"Upcoming"}
                filter6={"Past"}
                filter7={"Ongoing"}
                cardsData={myEvents}
                loading={false}
              />
            ),
          },
        ]
      : []),
    ...(mySpaces?.length > 0
      ? [
          {
            label: "Spaces",
            component: (
              <ProfileSpaces
                myProfile={false}
                cardsData={mySpaces}
                filter1={"All"}
                filter2={"Published"}
                filter3={"Draft"}
                filter4={"Archive"}
                loading={false}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <Box
      sx={{
        marginTop: "90px",
        display: "flex",
        rowGap: "20px",
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: "5px",
        marginBottom: "40px",
      }}
    >
      <ProfileCard
        myProfile={false}
        userProfileImg={user?.profile}
        userName={user?.profileName}
        cover={user?.cover}
        profileStats={user?.profileStats}
        {...(user?.cover?.length > 0
          ? {
              editImage: user?.cover[0]?.url
                ? user?.cover[0]?.url
                : user?.cover[0]
                ? URL.createObjectURL(user?.cover[0])
                : null,
            }
          : {})}
      />
      <OutlinedTabs key={"abc"} tabs={profileTabs} />
    </Box>
  );
};

export default SharedProfile;
