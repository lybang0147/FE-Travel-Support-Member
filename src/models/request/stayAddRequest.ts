
interface StayAddRequest{
  name: string;
  addressDescription: string;
  stayDescription: string;
  checkinTime: string;
  checkoutTime: string;
  type: string;
  provinceId: string;
  amenities: string[];
  stayImage: File[];
  longitude: number;
  latitude: number;
}

export default StayAddRequest;