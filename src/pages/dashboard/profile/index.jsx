import { Box, LinearProgress } from "@mui/material";
import { BrandCard, OutlinedTabs, ProfileAboutSection, ProfileCard, ProfileEvents, ProfileSpaces } from "../../../components";
import { profileContent } from "../../../constant";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetUserProfileQuery } from "../../../services/user";
import dayjs from "dayjs";
import { useGetAllBrandsQuery } from "../../../services/brands";
import { useGetAllEventsQuery } from "../../../services/events";
import { useGetAllSpaceQuery } from "../../../services/space";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  // const { name } = useParams()
  const navigate = useNavigate();
  const { state } = useLocation();
  const [profileData, setProfileData] = useState(profileContent)
  const { user } = useSelector((state) => state.auth);
  const myProfile = state?.id === user.id;
  const { data, isLoading, isSuccess, isError, error, isFetching } = useGetUserProfileQuery(myProfile ? null : state?.id, { refetchOnFocus: true, refetchOnMountOrArgChange: true })
  const [brands, setBrands] = useState([])
  const [myEvents, setMyEvents] = useState([])
  const [mySpaces, setMySpaces] = useState([])

  useEffect(() => {
   if(isError) {
      toast.error(error?.data?.message);
      navigate(-1)
   }
  }, [isError, error])

  const [forceRender, setForceRender] = useState(false);

  const { data: brandData, isError: isBrandError, isLoading: isBrandLoading, isSuccess: isBrandSuccess, error: brandError, isFetching: isBrandFetching } =
    useGetAllBrandsQuery(
      myProfile ? { pageSize: 100 } : { publicProfile: true, id:state?.id, entity: "BRAND", pageSize: 100 },
      {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
      }
    );

  const { data: eventData, isError: isEventError, isLoading: isEventLoading, isSuccess: isEventSuccess, error: eventError, isFetching: isEventFetchhing } =
    useGetAllEventsQuery(
      myProfile ? { pageSize: 100, tab: "Group" } : { publicProfile: true, id:state?.id, entity: "EVENT", pageSize: 100 },
      {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
      }
    );

  const { data: spaceData, isError: isSpaceError, isLoading: isSpaceLoading, isSuccess: isSpaceSuccess, error: spaceError, isFetching: isSpaceFetching, } =
    useGetAllSpaceQuery(
      myProfile ? { pageSize: 100, tab: "Group" } : { publicProfile: true, id:state?.id, entity: "SPACE", pageSize: 100 },
      {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
      }
    );

  useEffect(() => {
    if (isBrandSuccess) {
      const brandsArr = myProfile ? brandData?.data?.groupedBrands?.allBrands : brandData?.data?.brands
      const brands = brandsArr?.map((item) => ({
        profileImage: item?.brandImage,
        brandName: item?.brandName,
        brandCategory: item?.brandCategory?.map(category => category.name) || [],
        description: item?.details?.description,
        id: item?.id,
        brandImage: item?.coverImages[0]?.url,
        status: item?.status,
        shareableLink: item?.shareableLink,
        isFavourite: item?.isFavourite,
        isFollowed: item?.isFollowed,
      }));

      setBrands(brands)
    }
  }, [isBrandSuccess, brandData]);

  useEffect(() => {
    if (isSpaceSuccess) {
      const spaceArr = myProfile ? spaceData?.data?.groupedSpaces?.allSpaces : spaceData?.data?.spaces
      const spaces = spaceArr?.map((item) => {
        const dayPricing = item?.pricing?.find((priceItem) => priceItem.term === "Day");

        return {
          spacePic: item?.coverImages?.[0]?.url,
          spaceName: item?.spaceName,
          spaceAddress: item?.brand?.brandName,
          spaceDescription: item?.details?.description,
          spacePrice: dayPricing ? `$${dayPricing.price}/day` : "N/A",
          spaceDeadline: dayPricing ? `miniumum lease: ${dayPricing?.minimum} days` : "N/A",
          id: item?.id,
          status: item?.status
        };
      });

      setMySpaces(spaces)
    }
  }, [isSpaceSuccess, spaceData]);

  useEffect(() => {
    if (isEventSuccess) {
      const eventArr = myProfile ? eventData?.data?.groupedEvents?.allEvents : eventData?.data?.events
      const eventsData = eventArr?.map((item) => ({
        slides: [item?.coverImages?.[0]?.url],
        profileName: item?.eventName,
        category: item?.eventCategory?.map(category => category.name) || [],
        id: item?.id,
        eventStatus: item?.eventStatus,
        status: item?.status,
        tabs: [
          {
            props: {
              details: {
                overview: item?.details?.description || null
              }
            }
          }
        ],
        details: {
          by: item?.brand?.brandName,
          starting: !item?.eventDate ||
            !item?.eventDate[0]?.startDate ||
            !dayjs(item?.eventDate[0]?.startDate).isValid()
            ? "-"
            : dayjs.utc(item?.eventDate[0]?.startDate).startOf("day").local().format("DD.MM.YYYY"),

          RSVP: item?.rsvpCount
        },
        startDate: !item?.eventDate ||
          !item?.eventDate[0]?.startDate ||
          !dayjs(item?.eventDate[0]?.startDate).isValid()
          ? "DD.MM.YYYY"
          : dayjs.utc(item?.eventDate[0]?.startDate),
        endDate: !item?.eventDate ||
          !item?.eventDate[0]?.endDate ||
          !dayjs(item?.eventDate[0]?.endDate).isValid()
          ? "DD.MM.YYYY"
          : dayjs.utc(item?.eventDate[0]?.endDate),
        rsvpDates: item?.event_rsvp?.attendanceDates?.rsvpDates ? item?.event_rsvp?.attendanceDates?.rsvpDates?.map(item => item.dateTime) : [],

      }));

      setMyEvents(eventsData)
    }
  }, [isEventSuccess, eventData]);

  const [myProfileData, setMyProfileData] = useState({
    cover: [],
    profile: null,
    profileName: "",
    profileAbout: "",
    profileStats: [],
    shareableLink: ""
  })

  useEffect(() => {
    if (isSuccess && data) {
      setMyProfileData({
        cover: data?.data?.coverImages || [],
        profile: data?.data?.profileImage,
        profileName: data?.data?.name,
        profileAbout: data?.data?.about?.about,
        shareableLink: data?.data?.shareableLink,
        profileStats: [
          {
            name: "Brands:",
            value: data?.data?.brandsCount || 0
          },
          {
            name: "Events:",
            value: data?.data?.eventsCount || 0
          },
          {
            name: "Spaces:",
            value: data?.data?.spacesCount || 0
          },
          {
            name: "Member since:",
            value: dayjs(data?.data?.createdAt).format("MM.YYYY.")
          }
        ]
      });

      setForceRender((prev) => !prev);
    }
  }, [isSuccess, data]);

  const profileTabs = [
    {
      label: profileData[0].tabs[0],
      component: <ProfileAboutSection myProfileData={myProfileData} content={myProfileData?.profileAbout} />
    },
    ...(brands?.length > 0
      ? [
        {
          label: profileData[0].tabs[1],
          component: (
            <BrandCard
              myProfile={myProfile}
              items={brands}
              filter1={"All"}
              filter2={"Published"}
              filter3={"Draft"}
              filter4={"Archive"}
              loading={isBrandLoading || isBrandFetching}
            />
          )
        }
      ]
      : []),
    ...(myEvents?.length > 0
      ? [
        {
          label: profileData[0].tabs[2],
          component: (
            <ProfileEvents
              myProfile={myProfile}
              filter1={"All"}
              filter2={"Published"}
              filter3={"Draft"}
              filter4={"Archive"}
              filter5={"Upcoming"}
              filter6={"Past"}
              filter7={"Ongoing"}
              cardsData={myEvents}
              loading={isEventLoading || isEventFetchhing}
            />
          )
        }
      ]
      : []),
    ...(mySpaces?.length > 0
      ? [
        {
          label: profileData[0].tabs[3],
          component: (
            <ProfileSpaces
              myProfile={myProfile}
              cardsData={mySpaces}
              filter1={"All"}
              filter2={"Published"}
              filter3={"Draft"}
              filter4={"Archive"}
              loading={isSpaceLoading || isSpaceFetching}
            />
          )
        }
      ]
      : [])
  ];

  if (isLoading || isFetching) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    )
  }
  return (
    <Box
      sx={{
        marginTop: { xs: "0px", md: "90px" },
        display: "flex",
        rowGap: "20px",
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: "5px",
        marginBottom: "40px"
      }}
    >
      <ProfileCard
        myProfile={myProfile}
        userProfileImg={myProfileData?.profile}
        userName={myProfileData?.profileName}
        cover={myProfileData?.cover}
        profileStats={myProfileData?.profileStats}
        {...(myProfileData?.cover?.length > 0
          ? {
            editImage:
              myProfileData?.cover[0]?.url
                ? myProfileData?.cover[0]?.url
                : myProfileData?.cover[0]
                  ? URL.createObjectURL(myProfileData?.cover[0])
                  : null,
          }
          : {})}
      />
      <OutlinedTabs key={forceRender} tabs={profileTabs} />
    </Box>
  );
};

export default Profile;
