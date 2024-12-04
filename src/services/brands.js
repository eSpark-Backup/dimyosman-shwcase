import { api } from './rtk';

export const brandApi = api.injectEndpoints({
    endpoints: (builder) => ({
        newBrand: builder.mutation({
            query: (brandData) => {
                const formData = new FormData();
                formData.append('brandName', brandData?.brandName);

                const selectedCategories = brandData?.brandCategories
                    ?.filter(item => item.selected)
                    ?.map(item => ({ name: item.name }));

                formData.append('brandCategory', JSON.stringify(selectedCategories));



                const details = {
                    description: brandData?.brandOverview,
                    htmlContent: brandData?.brandTitle,
                };
                formData.append('details', JSON.stringify(details));


                const location = {
                    lat: brandData?.location?.lat,
                    long: brandData?.location?.long,
                };
                formData.append('location', JSON.stringify(location));


                if (brandData?.cover) {
                    brandData.cover.forEach((file) => {
                        formData.append('cover', file);
                    });
                }
                if (brandData?.profileImage) {
                    formData.append('image', brandData.profileImage);
                }
                formData.append("status", brandData?.status)


                return {
                    url: '/brand',
                    method: 'POST',
                    body: formData,
                };
            },
        }),
        getAllBrands: builder.query({
            query: ({ id, page = 1, pageSize = 7 }) => {
                
                const baseUrl = id ? `/brand/${id}` : `/brand`;
                const queryParams = `?pageSize=${pageSize}&page=${page}`;
                return {
                    url: `${baseUrl}${id ? "" : queryParams}`,
                    method: "GET",
                };
            },
        }),

    }),
});

export const {
    useNewBrandMutation,
    useGetAllBrandsQuery
} = brandApi;
