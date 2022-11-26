import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// define a service user a base URL

const appApi = createApi({
	reducerPath: "appApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "http://localhost:5001",
	}),

	endpoints: (builder) => ({
		// sign in new user
		signupUser: builder.mutation({
			query: (user) => ({
				url: "/users",
				method: "POST",
				body: user,
			}),
		}),

		// login user
		loginUser: builder.mutation({
			query: (user) => ({
				url: "/users/login",
				method: "POST",
				body: user,
			}),
		}),

		// logout user
		logoutUser: builder.mutation({
			query: (payload) => ({
				url: "/logout",
				method: "DELETE",
				body: payload,
			}),
		}),

		deleteUser: builder.mutation({
			query: (payload) => ({
				url: "/deleteUser",
				method: "DELETE",
				body: payload,
			}),
		}),
	}),
});

export const { useSignupUserMutation, useLoginUserMutation, useLogoutUserMutation, useDeleteUserMutation } = appApi;

export default appApi;
