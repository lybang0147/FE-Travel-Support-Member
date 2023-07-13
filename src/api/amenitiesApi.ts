import { SearchParams } from "./../types/index";
import axios from "axios";
import Amentity from "models/amenity";
import { ListResponse, GetAllResponse } from "types";
import axiosService from "./axiosClient";
import { AMENITIES } from "./baseURL";

const amenitiesService = {
    getAllAmenities: async (): Promise<GetAllResponse<Amentity>> => {
        return await axios({
          method: "GET",
          url: `${AMENITIES}`,
        })
          .then((res) => res.data)
          .catch((error) => {
            throw error;
          });
      },
};

export default amenitiesService;
