

interface StayUpdateRequest{
  id: string;
  name: string;
  addressDescription: string;
  stayDescription: string;
  checkinTime: string;
  checkoutTime: string;
  amenities: string[];
  stayImage: File[];
  stayRemoveImage: string[];
  longitude: number;
  latitude: number;
}

export default StayUpdateRequest;