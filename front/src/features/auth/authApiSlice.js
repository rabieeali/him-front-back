import { apiSlice } from "../../app/api/apiSlice"
import { logOut, setCredentials } from "./authSlice"
import { endpoints } from "../../app/api/endpoints"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: endpoints.login_endpoint,
                method: 'POST',
                body: { ...credentials }
            })
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: endpoints.logout_endpoint,
                method: 'POST',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log(data)
                    dispatch(logOut())
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState())
                    }, 1000)
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: endpoints.refresh_endpoint,
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    const { AccessToken } = data
                    dispatch(setCredentials({ AccessToken }))
                } catch (err) {
                    console.log(err)
                }
            }
        }),
    })
})

export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation,
} = authApiSlice 