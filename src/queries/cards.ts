import { createApi } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify'
import axiosBaseQuery from '~/lib/redux/helpers'
import { CardResType, CreateCardBodyType } from '~/schemas/card.schema'

const CARD_API_URL = '/cards' as const

const reducerPath = 'card/api' as const
const tagTypes = ['Card'] as const

export const cardApi = createApi({
  reducerPath,
  tagTypes,
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    addCard: build.mutation<CardResType, CreateCardBodyType>({
      query: (body) => ({ url: CARD_API_URL, method: 'POST', data: body }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message || 'Card added successfully')
        } catch (error) {
          toast.error('There was an error adding the card')
          console.error(error)
        }
      }
    })
  })
})

export const { useAddCardMutation } = cardApi

export const cardApiReducer = cardApi.reducer

export default cardApiReducer
