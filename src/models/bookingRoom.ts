import Room from "./room";
import Voucher from "./voucher";

export interface BookingRoom{
    id:string;
    quantity:number;
    room: Room;
    voucher?: Voucher;
}

export default BookingRoom
