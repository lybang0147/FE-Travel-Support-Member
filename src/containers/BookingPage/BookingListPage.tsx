import React, { FC, useState, useEffect } from "react";
import StayCardH from "components/StayCardH/StayCardH";
import { AppDispatch } from "redux/store";
import Heading2 from "components/Heading/Heading2";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "redux/store";
import Stay from "models/stay";
import User from "models/user";
import { getAllStay } from "redux/slices/staySlice";
import BookingCardH from "components/BookingCard/BookingCardH";
import { Booking } from "models/booking";
import stayService from "api/stayApi";
import toast from "react-hot-toast";
import { Box, CircularProgress, Dialog, DialogContent, Typography } from "@mui/material";
import Input from "shared/Input/Input";
import moment from "moment";
import { Add } from "@mui/icons-material";
import Rating from "models/rating";
import ratingService from "api/ratingApi";
import FiveStartIconForRate from "components/FiveStartIconForRate/FiveStartIconForRate";

export interface BookingListPageProps {}

const BookingListPage: FC<BookingListPageProps> = () => {
  const [currentHoverID, setCurrentHoverID] = useState<string | number>(-1);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [needFetch, setNeedFetch] = useState(false);
  const [rating, setRating] = useState({ rate: 0, message: '' });
  const [selectedBooking, setSelectedBooking] = useState("");
  const [showRatingDialog, setShowRatingDialog] = useState(false);

  const limit = 3;

  useEffect(() => {
    fetchBookingList();
  }, [needFetch]);

  const fetchBookingList = async () => {
    try {
      const bookingList = await stayService.getBookingList();
      setBookings(bookingList.content);
    } catch (error) {
      console.log("Error fetching booking list:", error);
    }
  };

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  interface Filters {
    status?: string | null;
  }

  const applyFilters = (bookings: Booking[], filters: Filters): Booking[] => {
    return bookings.filter((booking) => {
      if (filters.status !== null && booking.status?.toString() !== filters.status) {
        return false;
      }
      return true;
    });
  };

  const filteredBookings = applyFilters(bookings, { status: selectedStatus });

  useEffect(() => {
    if (pageIndex >= Math.ceil(filteredBookings.length / limit)) {
      setPageIndex(0);
    }
  }, [filteredBookings]);

  const handleStatusChange = (status: string | null) => {
    setSelectedStatus(status);
  };

  const applyPagination = (bookings: Booking[], pageIndex: number, limit: number): Booking[] => {
    const startIndex = pageIndex * limit;
    const endIndex = startIndex + limit;
    return bookings.slice(startIndex, endIndex);
  };

  const paginatedBookings = applyPagination(filteredBookings, pageIndex, limit);
  const totalPages = Math.ceil(filteredBookings.length / limit);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handleRepay = async (paymentId: string) => 
  {
    try
    {
      setIsProcessing(true);
      const link = await stayService.repayBooking(paymentId);
      window.open(link);
    }
    catch(error)
    {
      toast.error("Lỗi khi thanh toán lại, vui lòng kiểm tra thời hạn")
    }
    finally
    {
      setIsProcessing(false);
    }
  }

  const handleCancelBooking = async (id: string) =>
  {
    try
    {
      setIsProcessing(true);
      await stayService.declineBooking(id);
      setNeedFetch(!needFetch);
    }
    catch (error)
    {
      toast("Lỗi khi hủy đặt phòng");
    }
    finally
    {
      setIsProcessing(false);
    }

  }
  const handleRatingSubmit  = async () => {
    if (selectedBooking!= "")
    {
      try
      {
        setIsProcessing(true);
        await ratingService.createRating(
          {
            rate: rating.rate,
            message: rating.message,
            bookingId: selectedBooking
          }
        )
        toast.success("Thêm đánh giá thành công")
        handleRatingDialogClose();
      }
      catch(error)
      {
        toast.error("Thêm/ Chỉnh sửa đánh giá thất bại")
      }
      finally
      {
        setIsProcessing(false);
      }
    }
  }

  const handleAddReview = (booking: string) => {
    setSelectedBooking(booking);
    setShowRatingDialog(true);
  };

  const handleRatingDialogClose = () => {
    setShowRatingDialog(false);
    setRating({ rate: 0, message: "" });
  };

  return (
    <div>
      <div className="flex justify-center items-center h-full">
        <div className="min-h-screen w-full xl:w-[780px] 2xl:w-[880px] flex-shrink-0 xl:px-8 ">
          <Heading2
            heading={"Lịch sử đặt phòng"}
            subHeading={`Bạn đã đặt ${bookings.length} phòng`}
          />
          <div className="flex justify-end mb-4">
            <select
              value={selectedStatus || ""}
              onChange={(e) => handleStatusChange(e.target.value ? e.target.value : null)}
              className="px-2 py-1 border rounded-md w-40"
            >
              <option value="">Tất cả</option>
              <option value="0">Chờ thanh toán</option>
              <option value="1">Đã thanh toán</option>
              <option value="2">Đã chấp nhận</option>
              <option value="3">Đã bị hủy bởi khách sạn</option>
              <option value="4">Bạn đã hủy</option>
              <option value="5">Đã hoàn tất</option>
            </select>
          </div>
          <div className="grid grid-cols-1 gap-8">
            {paginatedBookings.map((booking: Booking) => {
               const currentDate = moment();
               const isReviewable = (booking.status === 5 || booking.status === 4) && currentDate.isAfter(booking.checkoutDate);
              return(
              <div
                key={booking.id}
                onMouseEnter={() => setCurrentHoverID((_) => booking.id)}
                onMouseLeave={() => setCurrentHoverID((_) => -1)}
              >
                <BookingCardH data={booking} />
                {booking.paymentId !== null && (
                  <button
                    className="bg-blue-500 text-white py-2 px-4 mt-3 rounded-lg w-40 mt-5 mr-5"
                    onClick={() => handleRepay(booking.paymentId ?? "")}
                    >
                    Thanh toán lại
                  </button>
                )}
                {(booking.status ?? 6)<=2 && (
                  <button
                    className="bg-red-500 text-white py-2 px-4 mt-3 rounded-lg w-40 mt-5"
                    onClick={() => handleCancelBooking(booking.id)}
                    >
                    Hủy đặt phòng
                  </button>
                )}
                 {isReviewable && (
                <button
                  className="bg-green-500 text-white py-2 px-4 mt-3 rounded-lg w-40 mt-5"
                  onClick={() => handleAddReview(booking.id)}
                >
                  <Add className="mr-2" />
                  Thêm đánh giá
                </button>
              )}
              </div>
            )})}
          </div>
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {pageIndex > 0 && (
                <button
                  className="px-3 py-2 font-medium border rounded-md"
                  onClick={() => handlePageChange(pageIndex - 1)}
                >
                  Previous
                </button>
              )}
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  className={`px-3 py-2 font-medium border rounded-md ${
                    pageNumber === pageIndex + 1 ? "bg-blue-500 text-white" : ""
                  }`}
                  onClick={() => handlePageChange(pageNumber - 1)}
                >
                  {pageNumber}
                </button>
              ))}
              {pageIndex < totalPages - 1 && (
                <button
                  className="px-3 py-2 font-medium border rounded-md"
                  onClick={() => handlePageChange(pageIndex + 1)}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Dialog open={showRatingDialog} onClose={handleRatingDialogClose} fullWidth>
        <DialogContent>
          <h2 className="text-2xl font-semibold">Đánh giá</h2>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
          {/* Content */}
          <div className="space-y-5">
            <FiveStartIconForRate
              iconClass="w-6 h-6"
              className="space-x-0.5"
              onRating={(rate) => setRating({ ...rating, rate: rate })}
            />
            <div className="relative">
              <Input
                fontClass=""
                sizeClass="h-16 px-4 py-3 w-full"
                rounded="rounded-3xl"
                placeholder="Đánh giá của bạn"
                onChange={(e) =>
                  setRating({ ...rating, message: e.target.value })
                }
              />
            </div>
            <button
              className="bg-green-500 text-white py-2 px-4 mt-3 rounded-lg w-40 mt-5"
              onClick={handleRatingSubmit}
            >
              Submit
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isProcessing}>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Đang xử lý...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingListPage;
