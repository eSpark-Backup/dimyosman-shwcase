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
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyTokenQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;