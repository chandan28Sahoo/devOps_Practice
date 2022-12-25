export const MESSAGES = {
  NFT: {
    GETDATA: 'Data get successfully',
    SUCCESS: 'NFT created successfully.',
    ERROR: 'Unable to create NFT, Please try again.',
    NOT_FOUND: 'NFT not found',
    GET: 'List of NFT Received',
    GET_ERROR: 'No NFT Found',
    UPDATED: 'NFT updated successfully.',
    CREATED: 'NFT created successfully.',
    CREATION_FAILED: 'NFT creation failed !',
    LIST: 'NFT found.',
    INVALID_NFT: 'Invalid NFT Requested',
    SOLD: 'NFT Already Sold',
    ALREADY_PURCHASED: 'You have Already Collected Free NFT',
    PURCHASE: {
      SUCCESS: 'NFT Purchased Succesfully',
      FAILURE: 'Unable to Process Request, Please Try Again Later',
    },
  },
  PURCHASES: {
    SUCCESS: 'Data get successfully',
  },
  CATAGORY: {
    SUCCESS: 'Catagory crated successfully',
    ALREADY_EXISTS: 'Catagory already exists',
    DELETED: 'Catagory deleted successfully.',
    NOT_FOUND: 'User not found',
    UPDATE: 'Catagory Updated successfully',
    GET: 'Catagory List get successfully',
  },
  COLLECTIONS: {
    SUCCESS: 'Collection created successfully.',
    ERROR: 'Unable to create collection, Please try again.',
    ALREADY_EXISTS: 'Collection title already exists',
    DELETED: 'Collection deleted successfully.',
    NOT_FOUND: 'Collection not found',
    FOUND: 'Collection found',
    UPDATE_SUCCESS: 'Collection Succesfully Updated',
    UNAUTH_ERROR: 'You are not able to see Collections'
  },
  AUTH: {
    TOKEN: {
      VERIFY: {
        empty_token: 'Auth Token required',
        wrong_token: 'Access denied',
        expired_token: 'Token has been expired',
        valid_token: 'Token is Valid',
        INVALID_LINK: 'Link has expired',
      },
      GENERATE: {
        error: 'Failed to generate token',
        success: 'Token successfully created',
      },
    },
    GOOGLE: {
      AUTH_TOKEN: {
        success: 'Google authentication success',
      },
    },
    FACEBOOK: {
      AUTH_TOKEN: {
        success: 'Facebook authentication success',
      },
    },
    REFRESH_TOKEN: {
      VERIFY: {
        empty_token: 'Refresh token required',
        success: 'Refresh token successfully verified',
      },
      GENERATE: {
        error: 'Failed to generate token',
        success: 'Refresh token successfully created',
      },
    },
  },
  INVALID_TOKEN: 'Invalid token',
  USER: {
    PASSWORD: `Password Does't Match`,
    OLDPASSWORD: `Old Password Does't Match`,
    SAMEPASSWORD: `your old password and new password cannot be same`,

    NOTFOUND: 'User Not Found ',
    PHOTOGRAPHER: {
      failed: 'Failed to update Photographer',
      success: 'Creator successfully updated',
      DETAILS: 'Details fetch successfully',
    },
    REGISTER: {
      NAME_AVILABLE: 'user name available',
      NOT_FOUND: '',
      DUPLICATE_Creator: 'Admin will Accept become cretor Request soon',
      DUPLICATE_EMAIL:
        'Thank you for signup, We will send you a verification email if your email does not exists in our records.',
      DUPLICATE_USERNAME: 'Username already taken, Please choose another one',
      // DUPLICATE_USER: 'An account using this email address already exists',
      DUPLICATE_USER: 'This email address is already being used',
      duplicate_user:
        'Thanks, You will receive a confirmation link, If your email does not exists in our database.',
      required: 'Required Fields are missing',
      password_error:
        'Password must be at least 8 characters and a mix of uppercase, lowercase letter, a number, and 1 special characters($, @, /, …)',
      success:
        'Confirmation Email has been sent to you. If not received in Inbox, please check the Spam Folder',
      WHITE_SPACE: 'White Space is not allowed',
      SPECIAL_CHAR: 'Password Must Contain One Special character ($, @, /, …)',
      NUMERIC: 'Password Must Contain One Numeric Value 0-9',
      UPPER_CASE: 'Password Must Contain One UpperCase Value A-Z',
      LOWER_CASE: 'Password Must Contain One LowerCase Value a-z',
      failure: 'Something went wrong! Please try again later',
      verify_email_error: 'Invalid confirmation link. Please try again.',
      verify_email_success: 'Email Verified.',
      verify_email_already: 'Email Already Verified.',
      VERIFY_EMAIL: 'Please verify your Email'
    },
    CREATE: {
      failed: 'Failed to add user',
      success: 'User successfully added',
      update: "user's token updated successfully",
    },
    CONTACT_US: {
      SUCCESS: 'We will Contact you shortly',
      FAILURE: 'We are currently not available. Please Try Again!',
    },
    PROFILE: {
      SUCCESS: 'User Profile fetched',
      FAILURE: 'Invalid User Requested',
    },
    ROLE: {
      SUCCESS: 'All Roles fetched',
      FAILURE: 'Invalid Role Id',
    },
    LOGIN: {
      wrong_email: "This email doesn't exist",
      unverified_email: 'Email must be verified',
      wrong_details: 'Incorrect email or password',
      success: 'You have successfully logged in',
    },
    GET_BY_ID: {
      no_user: 'No user found with the given id',
      success: 'User successfully found',
    },
    GET_BY_NAME: {
      no_user: 'No account found',
      success: 'User found success',
      failure: 'Email already registered. Please use another details',
    },
    UPDATE: {
      failed: 'Failed to update user',
      success: 'User successfully updated',
      password_update_success: 'Password Successfully Changed',
      password_update_failure:
        'Unable to Change Password. Please Try again Later!',
    },
    SUBSCRIBE: {
      success: 'Subscribed Successfully',
      failure: 'Unable to Subscibe. Please Try Again!',
      conflict: 'Email Already Subscribed',
    },
    CREATOR: {
      failed: 'Failed to update creator',
      conflict: 'User Already added in fevorite',
      unfav: 'Creator unfevorite successfully',
      fav: 'Creator fevorate successfully',
      success: 'Creator successfully created',
      fetch_creators: 'Creators fetch successfully',
    },
    PASSWORD_VERIFICATION: {
      reset_link_success:
        'Link to reset your password has been sent to your email',
      verify_email: 'Link to verify your email has been sent to your email',
    },
    NOT_FOUND: 'User Not Found!!.',
    DELETE: 'User Is In-Active!!.',
    PHOTOGRAPHER_MAIL: 'User for Creator Mail Send',
    ERROR_PHOTOGRAPHER_MAIL: 'Error in User for Creator Mail Sending',
  },
  KYC: {
    SUCCESS: 'Success',
    FAILURE: 'failed',
    DELETE: 'deleted',
  },
  ENV_ERROR: 'Env not loaded',
  FOLLOWER: {
    FOLLOW: 'You Follow Successfully',
    UNFOLLOW: 'You Unfollow Successfully',
    FOLLOWERS: ' Get Followers Successfully',
    FOLLOWING: ' Get Following Successfully',
  },
  BLOCKCHAIN: {
    LIST: 'Blockchain list fetch successfully.',
  },
};
