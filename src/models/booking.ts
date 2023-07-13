
import { DateTime } from "luxon";
import BookingRoom from "./bookingRoom";
import Stay from "./stay";
import User from "./user";

export interface Booking {
  id: string;
  stay: Stay;
  checkinDate?: Date;
  checkoutDate?: Date;
  totalPrice?: number;
  totalPeople?: number;
  status?: number;
  bookingRoom?:BookingRoom[];
  paymentId?: string;
  expiredPaymentTime?: DateTime,
  expiredConfirmTime?: DateTime,
  user:User;
  [key: string]: any;
}
