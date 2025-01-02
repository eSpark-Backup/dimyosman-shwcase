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
    updateProfile: builder.mutation({
      query: (credentials) => ({
        url: "/user/profile",
        method: "PUT",
        body: credentials,
        credentials: "include"
      }),
    }),
    changePw: builder.mutation({
      query: (credentials) => ({
        url: "/user/change-password",
        method: "POST",
        body: credentials,
        credentials: "include"
      }),
    }),
    changeProfileImage: builder.mutation({
      query: (credentials) => ({
        url: "/user/profileImage",
        method: "PUT",
        body: credentials,
        credentials: "include"
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyTokenQuery,
  useUpdateProfileMutation,
  useChangePwMutation,
  useChangeProfileImageMutation,
} = authApi;