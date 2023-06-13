export interface ITokensResponse {
  accessToken: string
  refreshToken: string
}

export interface IPayload {
  email: string
}

export interface JwtDecode {
  id: string
  email: string
  username: string
  iat: number
  exp: number
}