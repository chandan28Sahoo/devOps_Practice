export interface PromiseResponse {
  error?: boolean;
  message?: string;
  status?: number;
  data?: any;
  list?: any;
}

export interface AuthTokenResponseType {
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}

export interface GetByNameKycType {
  name?: string;
  value?: string;
  email?: string;
}
export interface UserType {
  userId?: string;
  username?: string;
  fullname?: string;
  dateOfBirth?: string;
  email?: string;
  profilePicture?: string;
  password?: string;
  mobileNumber?: string;
  '2faEnabled'?: boolean;
  googleId?: string;
  facebookId?: string;
  isAdmin?: boolean;
  type?: string;
  fcmToken?: string;
  token?: string;
  isEmailVerified?: boolean;
  isMobileNumberVerified?: boolean;
  isKycVerified?: boolean;
  isBankVerified?: boolean;
}
export interface AccessTokenType {
  access_token: string;
  id_token?: string;
  deviceType?: string;
  social_id?: string;
  full_name?: string;
  email?: string;
  picture?: string;
}

export interface TokenResponse {
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}

export interface UserSignup {
  email: string;
  password: string;
  username: string;
  fullname: string;
}
export interface UserRole {
  email: string;
  isFeatured: boolean;
  bio: string;
  fullname: string;
  username: string;
  password: string;
  role_type: number;
  profileImage: string;
  coverImage: string;
  brandId?: string;
  subTitle?: string;
  showcaseImage?: string;
}
export interface Role {
  role_name: string;
}
export interface UserSignin {
  email: string;
  password: string;
  // deviceToken?:string;
}

export interface UserUpdate {
  notification_email: string;
  username: string;
  fullname: string;
  bio: string;
  profileImage: string;
  coverImage: string;
}

export interface BrandUpdate {
  bio: string;
  fullname: string;
  coverImage: string;
  profileImage: string;
  isFeatured: boolean;
  showcaseImage: string;
}

export interface ArtistUpdate {
  bio: string;
  fullname: string;
  coverImage: string;
  profileImage: string;
  brandId: string;
  isFeatured: boolean;
  showcaseImage: string;
}
