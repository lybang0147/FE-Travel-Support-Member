import axios from "axios";
import Stay from "models/stay";
import User from "models/user";
import { ListResponse } from "types";
import axiosService from "./axiosClient";
import {
  BASE_URL,
  REFRESH_TOKEN,
  REGISTER_FOR_CUSTOMER,
  SIGN_IN,
  STAY,
  USER,
  SEND_EMAIL_FOR_OWNER,
  SEND_RESET_PASSWORD_EMAIL,
  RESET_PASSWORD
} from "./baseURL";

interface RefreshToken {
  refreshToken: string | null;
}
export interface RefreshTokenResponse {
  accessToken: string;
}
export interface SignIn {
  email: string;
  password: string;
}
export interface SignInResponse {
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface Register {
  email: string;
  password: string;
}
export interface RegisterResponse {
  message: string;
}

export interface ChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}



const authenticationService = {
  refreshToken: async (params: RefreshToken): Promise<RefreshTokenResponse> => {
    return axios({
      method: "POST",
      url: REFRESH_TOKEN,
      headers: {
        "Content-Type": "text/plain",
      },
      data: params?.refreshToken,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  signIn: async (params: SignIn): Promise<SignInResponse> => {
    return axios({
      method: "POST",
      url: SIGN_IN,
      data: params,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  registerForCustomer: async (params: Register): Promise<any> => {
    return axios({
      method: "POST",
      url: REGISTER_FOR_CUSTOMER,
      data: params,
    })
      .then((res) => res.status)
      .catch((error) => {
        throw error;
      });
  },
  getUserInfo: async (): Promise<any> => {
    return (await axiosService())({
      method: "GET",
      url: `${USER}/userInfo`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  updateUserInfo: async (formData: FormData): Promise<any> => {
    return (await axiosService())({
      method: "POST",
      url: `${USER}/userInfo`,
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getLikeListByUserID: async (): Promise<ListResponse<Stay>> => {
    return (await axiosService())({
      method: "GET",
      url: `${STAY}/likeList`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  activeAccountForCustomer: async (params: any): Promise<any> => {
    return axios({
      method: "GET",
      url: `${BASE_URL}authenticate/verify/${params}`,
    })
      .then((res) => res.status)
      .catch((error) => {
        throw error;
      });
  },

  registerOwnerEmail: async (email: string): Promise<any> => {
    return axios({
      method: "POST",
      url: SEND_EMAIL_FOR_OWNER,
      params: {email}
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  resetPasswordEmail: async (email: string): Promise<any> => {
    return axios({
      method: "POST",
      url: SEND_RESET_PASSWORD_EMAIL,
      params: {email}
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  resetPassword: async (email: string, newPassword: string, verifyCode: string): Promise<any> => {
    return axios({
      method: "POST",
      url: RESET_PASSWORD,
      params: {email,newPassword,verifyCode}
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  changePassword: async (data: ChangePassword): Promise<any> => {
    return (await axiosService())({
      method: "POST",
      url: `${BASE_URL}authenticate/changePassword`,
      data: data,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },

  // register: async (dataBody: Register): Promise<RegisterResponse> => {
  //   return axios({
  //     method: "POST",
  //     url: REGISTER_URL,
  //     data: dataBody,
  //   })
  //     .then((res) => res.data)
  //     .catch((error) => {
  //       throw error;
  //     });
  // },
};

export default authenticationService;
