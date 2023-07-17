import { SearchParams } from "./../types/index";
import axios from "axios";
import { ListResponse, GetAllResponse } from "types";
import axiosService from "./axiosClient";
import Place from "models/place"
import { PLACE, PLACES } from "./baseURL";

const placesService = {
    getNearByPlaces: async (stayId: string): Promise<any> => {
        return await axios({
          method: "GET",
          url: `${PLACE}/buildTrip`,
          params: {
            stayId: stayId,
          },
        })
          .then((res) => res.data)
          .catch((error) => {
            throw error;
          });
      },
    findNearByPlaces: async (stayId: string): Promise<any> => {
      return await axios({
        method: "GET",
        url: `${PLACE}/nearByPlace`,
        params: {
          stayId: stayId,
        },
      })
        .then((res) => res.data)
        .catch((error) => {
          throw error;
        });
    },
    getPlaceByProvince: async (provinceId:string): Promise<Place[]> => {
      return await axios({
        method: "GET",
        url: `${PLACE}/province/${provinceId}`,
      })
        .then((res) => res.data)
        .catch((error) => {
          throw error;
        });
    },
    searchPlace: async (param: any): Promise<Place[]> => {
      return await axios({
        method: "GET",
        url: `${PLACE}/search`,
        params: param
      })
        .then((res) => res.data)
        .catch((error) => {
          throw error;
        });
    },
    buildNewRoute: async (stayId: string, placeId: string[]): Promise<any> => {
      const params = new URLSearchParams();
      params.append("stayId", stayId);
      placeId.forEach((id) => {
        params.append("placeList", id);
      });
      return await axios({
        method: "GET",
        url: `${PLACE}/buildNewRoute`,
        params: params,
      })
        .then((res) => res.data)
        .catch((error) => {
          throw error;
        });
    },
    getPlaceById: async (placeId: string): Promise<Place> => {
      return await axios({
        method: "GET",
        url: `${PLACE}/${placeId}`,
      })
        .then((res) => res.data)
        .catch((error) => {
          throw error;
        });
    }
};

export default placesService;
