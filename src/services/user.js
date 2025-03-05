import { api } from './rtk';

export const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        userProfileUpdate: builder.mutation({
            query: (profileData) => {
                const formData = new FormData();
                formData.append("about", JSON.stringify({ about: profileData?.profileAbout }));
                if (profileData?.profileImage) {
                    formData.append('image', profileData?.profileImage);
                }

                formData.append('isProfile', false);

                if (profileData?.cover) {
                    const coverKeys = [];

                    profileData.cover.forEach((file, index) => {
                        if (file?.public_id) {
                            let indexes = index + 1;
                            let newStr = file.public_id + "+" + indexes;
                            coverKeys.push(newStr);
                        } else {
                            formData.append('cover', file);
                        }
                    });

                    if (coverKeys?.length > 0) {
                        formData.append('coverKeys', coverKeys);
                    }
                }

                return {
                    url: '/user/profileImage',
                    method: 'PUT',
                    body: formData,
                };
            },
        }),
        getUserProfile: builder.query({
            query: (id) => ({
                url: id ? `/general/public/profile/${id}` : `/user/profile`,
            }),
        }),
    })
})

export const {
    useUserProfileUpdateMutation,
    useGetUserProfileQuery
} = userApi;