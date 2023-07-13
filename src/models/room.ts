import RoomService from "./roomService";
import Voucher from "./voucher";
interface Room {
    id: string;
    roomName?:string;
    guestNumber:number;
    numberOfRoom?:number;
    price?:number;
    hidden?:boolean;
    roomService?:RoomService[];
    voucher:Voucher[];
  }
  
  export default Room;
  