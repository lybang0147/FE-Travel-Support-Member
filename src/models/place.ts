
import Image from "./image";
import Province from "./province";
import User from "./user";
interface Place{
    id: string;
    name: string;
    hidden: boolean;
    placeImage: Image[];
    province: Province;
    description: string;
    addressDescription: string;
    latitude: number;
    longitude: number;
    timeClose: string;
    timeOpen: string;
    type: string;
    minPrice: number;
    maxPrice: number;
    recommendTime: string;
    author: User;
}

export default Place;