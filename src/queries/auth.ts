import { createApi } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify'
import axiosBaseQuery from '~/lib/redux/helpers'
import { AppDispatch } from '~/lib/redux/store'
import { boardApi } from '~/queries/boards'
import { invitationApi } from '~/queries/invitations'
import { userApi } from '~/queries/users'
import {
  AuthResType,
  ForgotPasswordBodyType,
  ForgotPasswordResType,
  LoginBodyType,
  LogoutResType,
  RegisterBodyType,
  RegisterResType,
  ResetPasswordBodyType,
  ResetPasswordResType,
  VerifyEmailResType,
  VerifyForgotPasswordResType
} from '~/schemas/auth.schema'
import { disconnectSocket } from '~/store/slices/app.slice'
import { reset, setAuthenticated, setProfile } from '~/store/slices/auth.slice'

export const AUTH_API_URL = '/auth' as const

const reducerPath = 'auth/api' as const
const tagTypes = ['Auth'] as const

export const apiSlicesToReset = [boardApi, userApi, invitationApi]

export const resetApiState = (dispatch: AppDispatch) => {
  apiSlicesToReset.forEach((api) => {
    dispatch(api.util.resetApiState())
  })
}

export const authApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    login: build.mutation<AuthResType, LoginBodyType>({
      query: (body) => ({ url: `${AUTH_API_URL}/login`, method: 'POST', data: body }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled

          // Option 1: Force a fresh API call by using `forceRefetch: true`
          // `dispatch(userApi.endpoints.getMe.initiate(undefined, { forceRefetch: true }))
          dispatch(userApi.endpoints.getMe.initiate(undefined)).then((res) => {
            if (!res.error) {
              const profile = res.data?.result

              dispatch(setAuthenticated(true))
              dispatch(setProfile(profile))
            }
          })
        } catch (error: any) {
          console.error(error)
        }
      }
    }),

    register: build.mutation<RegisterResType, RegisterBodyType>({
      query: (body) => ({ url: `${AUTH_API_URL}/register`, method: 'POST', data: body }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message)
        } catch (error: any) {
          console.error(error)
        }
      }
    }),

    verifyEmail: build.mutation<VerifyEmailResType, { email_verify_token: string }>({
      query: (body) => ({ url: `${AUTH_API_URL}/verify-email`, method: 'POST', data: body }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message)
        } catch (error: any) {
          console.error(error)
        }
      }
    }),

    resendVerifyEmail: build.mutation<VerifyEmailResType, void>({
      query: () => ({ url: `${AUTH_API_URL}/resend-verify-email`, method: 'POST' }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message)
        } catch (error: any) {
          console.error(error)
        }
      }
    }),

    forgotPassword: build.mutation<ForgotPasswordResType, ForgotPasswordBodyType>({
      query: (body) => ({ url: `${AUTH_API_URL}/forgot-password`, method: 'POST', data: body }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message)
        } catch (error: any) {
          console.error(error)
        }
      }
    }),

    verifyForgotPassword: build.mutation<VerifyForgotPasswordResType, { forgot_password_token: string }>({
      query: (body) => ({ url: `${AUTH_API_URL}/verify-forgot-password`, method: 'POST', data: body })
    }),

    resetPassword: build.mutation<ResetPasswordResType, ResetPasswordBodyType & { forgot_password_token: string }>({
      query: (body) => ({ url: `${AUTH_API_URL}/reset-password`, method: 'POST', data: body }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message)
        } catch (error: any) {
          console.error(error)
        }
      }
    }),

    logout: build.mutation<LogoutResType, void>({
      query: () => ({ url: `${AUTH_API_URL}/logout`, method: 'POST' }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled

          dispatch(reset())
          dispatch(disconnectSocket())

          // Option 2 (recommended): Reset API state on logout to clear any cached data
          dispatch(authApi.util.resetApiState())
          resetApiState(dispatch)
        } catch (error: any) {
          console.error(error)
        }
      }
    })
  })
})

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useVerifyForgotPasswordMutation,
  useResetPasswordMutation,
  useResendVerifyEmailMutation
} = authApi

const authApiReducer = authApi.reducer

export default authApiReducer
