import { api } from './rtk';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
        credentials: "include"
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
        credentials: "include"
      }),
    }),
    verifyToken: builder.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
        credentials: "include"
      }),
    }),
    forgotPassword: builder.mutation({
      query: (credentials) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ credentials, token, expiresAt }) => ({
        url: `/auth/reset-password/${token}/${expiresAt}`,
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    updateProfile: builder.mutation({
      query: (credentials) => ({
        url: "/user/profile",
        method: "PUT",
        body: credentials,
        credentials: "include",
      }),
    }),
    changePw: builder.mutation({
      query: (credentials) => ({
        url: "/user/change-password",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    changeProfileImage: builder.mutation({
      query: (credentials) => ({
        url: "/user/profileImage",
        method: "PUT",
        body: credentials,
        credentials: "include",
      }),
    }),
    getUserFavourities: builder.query({
      query: ({ page, pageSize, entity } = {}) => {
        const baseUrl = "/user/favourites";
        const queryParams = new URLSearchParams();

        if (pageSize) queryParams.append("pageSize", pageSize);
        if (page) queryParams.append("page", page);
        if (entity) queryParams.append("entity", entity);

        const queryString = queryParams.toString()
          ? `?${queryParams.toString()}`
          : "";

        return {
          url: `${baseUrl}${queryString}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyTokenQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useChangePwMutation,
  useChangeProfileImageMutation,
  useGetUserFavouritiesQuery
} = authApi;