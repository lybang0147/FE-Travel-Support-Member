import Image from "models/image";

interface AddPlaceRequest{
    name: string;
    image: Image[];
    province: string;
    description: String;
    addressDescription: String;
    latitude: number;
    longitude: number;
    timeClose: string;
    timeOpen: string;
    type: string;
    minPrice: number;
    maxPrice: number;
    recommended_time: string;
}

export default AddPlaceRequest;