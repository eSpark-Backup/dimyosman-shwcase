import { api } from "./rtk";

export const spaceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    newSpace: builder.mutation({
      query: (spaceData) => {
        const formData = new FormData();
        formData.append("brandId", spaceData?.selectedBrand);
        formData.append("spaceName", spaceData?.spaceName);

        const pricing = spaceData?.price?.map((item) => ({
          price: String(item?.price),
          term: item?.term,
          minimum: String(item?.minimum),
        }));

        formData.append("pricing", JSON.stringify(pricing));

        const selectedCategories = spaceData?.spaceCategories
          ?.filter((item) => item.selected)
          ?.map((item) => ({ name: item.name }));

        formData.append("spaceCategory", JSON.stringify(selectedCategories));

        const selectedAmenities = spaceData?.amenities
          ?.filter((item) => item.selected)
          ?.map((item) => ({ name: item.name, iconUrl: item?.icon }));

        formData.append("amenity", JSON.stringify(selectedAmenities));

        const details = {
          description: spaceData?.spaceOverview,
          htmlContent: spaceData?.spaceTitle,
        };
        formData.append("details", JSON.stringify(details));

        // const location = {
        //   lat: spaceData?.location?.lat,
        //   long: spaceData?.location?.long,
        //   additional: spaceData?.mapInstructions,
        // };
        // formData.append("location", JSON.stringify(location));

        if (spaceData?.cover) {
          const coverOrder = [];

          spaceData.cover.forEach((file) => {
            formData.append("cover", file);
            coverOrder.push(file.name);
          });

          // formData.append('coverOrder', JSON.stringify(coverOrder));
        }
        if (spaceData?.profileImage) {
          formData.append("image", spaceData.profileImage);
        }
        formData.append("status", spaceData?.status);

        return {
          url: "/space",
          method: "POST",
          body: formData,
        };
      },
    }),
    getAllSpace: builder.query({
      query: ({ id, page, pageSize, tab } = {}) => {
        const baseUrl = id ? `/space/${id}` : "/space";
        const queryParams = new URLSearchParams();

        if (pageSize) queryParams.append("pageSize", pageSize);
        if (page) queryParams.append("page", page);
        if (tab) queryParams.append("tab", tab);

        const queryString = queryParams.toString()
          ? `?${queryParams.toString()}`
          : "";
        return {
          url: `${baseUrl}${id ? "" : queryString}`,
          method: "GET",
        };
      },
    }),
    editSpace: builder.mutation({
      query: ({ spaceData, id }) => {
        const formData = new FormData();
        formData.append("brandId", spaceData?.selectedBrand);
        formData.append("spaceName", spaceData?.spaceName);

        const pricing = spaceData?.price?.map((item) => ({
          price: String(item?.price),
          term: item?.term,
          minimum: String(item?.minimum),
        }));

        formData.append("pricing", JSON.stringify(pricing));

        const selectedCategories = spaceData?.spaceCategories
          ?.filter((item) => item.selected)
          ?.map((item) => ({ name: item.name }));

        formData.append("spaceCategory", JSON.stringify(selectedCategories));

        const selectedAmenities = spaceData?.amenities
          ?.filter((item) => item.selected)
          ?.map((item) => ({ name: item.name, iconUrl: item?.icon }));

        formData.append("amenity", JSON.stringify(selectedAmenities));

        const details = {
          description: spaceData?.spaceOverview,
          htmlContent: spaceData?.spaceTitle,
        };
        formData.append("details", JSON.stringify(details));

        // const location = {
        //   lat: spaceData?.location?.lat,
        //   long: spaceData?.location?.long,
        //   additional: spaceData?.mapInstructions,
        // };
        // formData.append("location", JSON.stringify(location));

        if (spaceData?.cover) {
          const coverKeys = [];

          spaceData.cover.forEach((file, index) => {
            if (file?.public_id) {
              let indexes = index + 1;
              let newStr = file.public_id + "+" + indexes;
              coverKeys.push(newStr);
            } else {
              formData.append("cover", file);
            }
          });

          if (coverKeys?.length > 0) {
            formData.append("coverKeys", coverKeys);
          }
        }
        if (spaceData?.profileImage) {
          if (spaceData.profileImage instanceof File) {
            formData.append("image", spaceData.profileImage);
          }
        }
        formData.append("status", spaceData?.status);

        return {
          url: `/space/${id}`,
          method: "PUT",
          body: formData,
        };
      },
    }),
    spacePrice: builder.mutation({
      query: ({ priceData }) => {
        return {
          url: `/space/price`,
          method: "POST",
          body: priceData,
        };
      },
    }),
    spaceInquire: builder.mutation({
      query: ({ message }) => {
        return {
          url: `/space/inquire`,
          method: "POST",
          body: message,
        };
      },
    }),
    leaseSpaceInquire: builder.mutation({
      query: ({ data }) => {
        const formData = new FormData();

        formData.append("spaceId", data.spaceId);
        formData.append("chatId", data.chatId);
        formData.append("tenantId", data.tenantId);
        formData.append("brandId", data.brandId);
        if (data.contractDetails) {
          formData.append(
            "contractDetails",
            JSON.stringify(data.contractDetails)
          );
        }
        if (data.image) {
          formData.append("image", data.image);
        }

        return {
          url: "/space/leaseSpace",
          method: "POST",
          body: formData,
        };
      },
    }),
    tenantSign: builder.mutation({
      query: ({ data }) => {
        const formData = new FormData();

        formData.append("image", data.image);

        return {
          url: `/space/tenantSign/${data.id}`,
          method: "POST",
          body: formData,
        };
      },
    }),
    paymentVerification: builder.mutation({
      query: ({ id }) => {
        return {
          url: `/space/paymentVerification/${id}`,
          method: "POST",
        };
      },
    }),
    spacesForEvent: builder.query({
      query: ({ } = {}) => {
        return {
          url: `/space/SpaceForEvent`,
          method: "POST",
        };
      },
    }),
  }),
});

export const {
  useNewSpaceMutation,
  useGetAllSpaceQuery,
  useEditSpaceMutation,
  useSpacePriceMutation,
  useSpaceInquireMutation,
  useLeaseSpaceInquireMutation,
  useTenantSignMutation,
  usePaymentVerificationMutation,
  useSpacesForEventQuery
} = spaceApi;
