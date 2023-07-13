import { SearchParams } from "./../types/index";
import axios from "axios";
import Stay from "models/stay";
import { ListResponse, GetAllResponse } from "types";
import axiosService from "./axiosClient";
import { BOOKING, SEARCH_STAY_BY_CRITERIA, STAY, ROOM, ROOM_SERVICE, ROOM_VOUCHER } from "./baseURL";
import { Booking } from "models/booking";
import StaySearch from "models/response/staySearch";
import Room from "models/room";
import StayAddRequest from "models/request/stayAddRequest";
import StayUpdateRequest from "models/request/stayUpdateRequest";
import RoomService from "models/roomService";
import Voucher from "models/voucher";
import { AnyIfEmpty } from "react-redux";
const stayService = {
  bookStay: async (book: any): Promise<any> => {
    return await axiosService()({
      method: "POST",
      url: `${BOOKING}`,
      data: book,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getBookingStatic: async (): Promise<any> => {
    return await axiosService()({
      method: "GET",
      url: `${BOOKING}/static`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  acceptBooking: async (id: any): Promise<any> => {
    return await axiosService()({
      method: "POST",
      url: `${BOOKING}/Owner/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  declineUserBooking: async (id: any, reason: string): Promise<any> => {
    return await axiosService()({
      method: "POST",
      url: `${BOOKING}/Owner/decline/${id}`,
      params: {reason}
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  declineBooking: async (id: any): Promise<any> => {
    return await axiosService()({
      method: "POST",
      url: `${BOOKING}/decline/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  bookStaySuccessfull: async (data: any): Promise<any> => {
    return await axiosService()({
      method: "GET",
      url: `${BOOKING}/pay/complete`,
      params: {
        vnp_TxnRef : data.vnp_TxnRef
      },
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },

  repayBooking: async (data: string): Promise<any> => {
    return await axiosService()({
      method: "POST",
      url: `${BOOKING}/repay`,
      params: {
        vnp_TxnRef : data
      },
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
    });
  },

  getBlockedDate: async (id: string): Promise<any> => {
    return await axios({
      method: "GET",
      url: `${BOOKING}/getBlockedDate/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getBookingList: async (): Promise<GetAllResponse<Booking>> => {
    return (await axiosService())({
      method: "GET",
      url: `${BOOKING}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },

  getOwnerBooking: async (data: string): Promise<GetAllResponse<Booking>> => {
    return (await axiosService())({
      method: "GET",
      url: `${BOOKING}/Owner`,
      params: {searchKey: data}
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },

  searchStayByCriteria: async (
    params: SearchParams
  ): Promise<ListResponse<Stay>> => {
    return await axios({
      method: "GET",
      url: `${STAY}/search`,
      params: params,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getAllStay: async (): Promise<ListResponse<Stay>> => {
    return await axios({
      method: "GET",
      url: `${STAY}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getStayByID: async (id: string): Promise<ListResponse<Stay>> => {
    return await axios({
      method: "GET",
      url: `${STAY}/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },

  getStayWithId: async (id:string): Promise<Stay> => {
    return await axios({
      method: "GET",
      url: `${STAY}/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },

  getStayByCriteria: async (
    params: SearchParams
  ): Promise<ListResponse<Stay>> => {
    return await axios({
      method: "GET",
      url: `${SEARCH_STAY_BY_CRITERIA}`,
      params: params,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  createStay: async (data: StayAddRequest) => {
    const formData = new FormData();
  formData.append("name", data.name);
  formData.append("addressDescription", data.addressDescription);
  formData.append("type", data.type);
  formData.append("stayDescription", data.stayDescription);
  formData.append("provinceId", data.provinceId);
  formData.append("checkinTime", data.checkinTime);
  formData.append("checkoutTime", data.checkoutTime);
  formData.append("longitude", data.longitude.toString())
  formData.append("latitude", data.latitude.toString())
  data.amenities.forEach((amenity) => {
    formData.append("amenities", amenity);
  });

  data.stayImage.forEach((image) => {
    formData.append("stayImage", image);
  });
    return (await axiosService())({
      method: "POST",
      url: `${STAY}`,
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      data: formData ,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },


  updateStay: async (data: StayUpdateRequest) => {
    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("name", data.name);
    formData.append("addressDescription", data.addressDescription);
    formData.append("stayDescription", data.stayDescription);
    formData.append("checkinTime", data.checkinTime);
    formData.append("checkoutTime", data.checkoutTime);
    formData.append("longitude", data.longitude.toString());
    formData.append("latitude", data.latitude.toString())
    data.amenities.forEach((amenity) => {
      formData.append("amenities",amenity);
    });

    data.stayImage.forEach((image) => {
      formData.append("newImage",image);
    });

    data.stayRemoveImage.forEach((imageLink) => {
      formData.append("removedImage", imageLink);
    })


    return (await axiosService())({
      method: "PATCH",
      url: `${STAY}`,
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
  deleteStay: async (id: string) => {
    return (await axiosService())({
      method: "DELETE",
      url: `${STAY}`,
      params: {
        ids: id,
      },
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  likeStay: async (id: string) => {
    return (await axiosService())({
      method: "POST",
      url: `${STAY}/likeList/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  unLikeStay: async (id: string) => {
    return (await axiosService())({
      method: "POST",
      url: `${STAY}/likeList/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getOwnerStay: async (): Promise<ListResponse<Stay>> => {
    return (await axiosService())({
      method: "GET",
      url: `${STAY}/OwnedStay`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },

  getRoomByStay: async (id: string): Promise<Room[]> =>{
    return await axios({
      method: "GET",
      url: `${ROOM}/list/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },

  getRoomByListId: async (roomIds: string): Promise<Room[]> =>{
    return await axios({
      method: "GET",
      url: `${ROOM}`,
      params:{roomIds}
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },

  createRoom: async (data: any): Promise<Room> => {
    return (await axiosService())({
      method: "POST",
      url: `${ROOM}`,
      params: data
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },

  updateRoom: async (id: string, data: any): Promise<Room> => {
    return (await axiosService())({
      method: "PATCH",
      url: `${ROOM}/${id}`,
      params: data
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },

  addRoomSerivce: async (id: string, data: string[] ): Promise<Room> => {
    const params = data.map((name) => `roomServiceId=${encodeURIComponent(name)}`).join('&');
    return (await axiosService())({
      method: "POST",
      url: `${ROOM}/roomService/${id}?${params}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },

  getAllRoomService: async () : Promise<RoomService[]> =>
  {
    return  (await axiosService())({
      method: "GET",
      url: `${ROOM_SERVICE}/all`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },

  getRoomService: async (id: string) : Promise<RoomService[]> =>
  {
    return await axios({
      method: "GET",
      url: `${ROOM_SERVICE}/room/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },

  getRoomVoucher: async (id: string) : Promise<Voucher[]> =>
  {
    return await axios({
      method: "GET",
      url: `${ROOM_VOUCHER}/room/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },

  getUserVoucher: async (id: string) : Promise<Voucher[]> =>
  {
    return (await axiosService())({
      method: "GET",
      url: `${ROOM_VOUCHER}/userVoucher/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },

  getStayVoucher: async (id: string) : Promise<Voucher[]> =>
  {
    return await axios({
      method: "GET",
      url: `${ROOM_VOUCHER}/stay/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  
  getVoucherByListId: async (ids: string): Promise<Voucher[]> =>{
    return await axios({
      method: "GET",
      url: `${ROOM_VOUCHER}/getByIds`,
      params:{ids}
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },

  activeRoomVoucher: async (id: string) : Promise<Voucher> => 
  {
    return  (await axiosService())({
      method: "PATCH",
      url: `${ROOM_VOUCHER}/active/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  addRoomVoucher: async (data: any) : Promise<Voucher> =>
  {
    return  (await axiosService())({
      method: "POST",
      url: `${ROOM_VOUCHER}`,
      data: data,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getAvailableRoom: async (data: any) : Promise<Room[]> =>
  {
    return  (await axiosService())({
      method: "GET",
      url: `${ROOM}/searchAll`,
      params: data
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getOwnerStayStatic: async (): Promise<any> => {
    return (await axiosService())({
      method: "GET",
      url: `${STAY}/owner/static`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  
  
};

export default stayService;
