export const fetchedSpaceData = (
  data,
  address,
  sharableTabDetailData,
  sharableParentData
) => {
  const amenities = data?.amenity?.map((item) => ({
    description: item?.name,
    icon: item?.iconUrl,
  }));

  return {
    ...sharableParentData(data),
    by: 1,
    profilePic: data?.spaceImage,
    profileName: data?.spaceName,
    category: data?.spaceCategory || [],
    details: {
      by: data?.user?.name,
      saved: data?.likedCount,
    },
    rating: 5,
    ratingBased: "Based on 12345 reviews from 12345 Leases",
    tabs: [
      {
        label: "Details",
        props: {
          details: {
            ...sharableTabDetailData(data, address),
            feature: {
              title: "Ammenities & Features:",
              points: amenities,
            },
            space: data?.brand?.brandName,
            spaceCategory: data?.brand?.brandCategory?.map((item) => item.name),
            startingDate: "28.02.2025.",
            endingDate: "15.4.2025.",
            mapLocation: {
              lat: data?.brand?.location?.lat,
              long: data?.brand?.location?.long,
              additional: data?.brand?.location?.additional,
            },
          },
        },
      },
      {
        label: "Stats",
        props: null,
      },
      {
        label: "Tenancy",
        props:
          data?.tenantSpaceDetail?.length > 0
            ? { tenancy: data?.tenantSpaceDetail }
            : false,
      },
    ],
  };
};
