import { axiosInstance } from '../lib/axios'
import { API_VARIABLES } from './config'

type FetchGoogleRedirectUriAPIResponse = { authorizationUrl: string }

const fetchGoogleRedirectUri =
  async (): Promise<FetchGoogleRedirectUriAPIResponse> => {
    const response = await axiosInstance.get<FetchGoogleRedirectUriAPIResponse>(
      API_VARIABLES.AUTH_ENDPOINTS.FETCH_GOOGLE_REDIRECT_URI,
    )
    return { authorizationUrl: response.data.authorizationUrl }
    // return { authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&include_granted_scopes=true&response_type=code&client_id=654220604288-m2ipu0pgpikeasqha7b17cq6s4v7g5u6.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fgoogle%2Fcallback" }
  }

type ExchangeCodeForTokenInput = string
type ExchangeCodeForTokenAPIResponse = { accessToken: string }

const exchangeCodeForToken = async (
  code: ExchangeCodeForTokenInput,
): Promise<ExchangeCodeForTokenAPIResponse> => {
  const response = await axiosInstance.post<ExchangeCodeForTokenAPIResponse>(
    API_VARIABLES.AUTH_ENDPOINTS.EXCHANGE_CODE_FOR_TOKEN,
    {
      code,
    },
  )
  return { accessToken: response.data.accessToken }
}

type LoginWithGoogleAccessTokenInput = string
type LoginWithGoogleAccessTokenAPIResponse = { accessToken: string }

const loginWithGoogleAccessToken = async (
  googleAccessToken: LoginWithGoogleAccessTokenInput,
): Promise<ExchangeCodeForTokenAPIResponse> => {
  const response =
    await axiosInstance.post<LoginWithGoogleAccessTokenAPIResponse>(
      API_VARIABLES.AUTH_ENDPOINTS.LOGIN_WITH_GOOGLE_ACCESS_TOKEN,
      {},
      {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      },
    )
  return { accessToken: response.data.accessToken }
}

export {
  fetchGoogleRedirectUri,
  exchangeCodeForToken,
  loginWithGoogleAccessToken,
}
