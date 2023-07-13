import React, { FC, useState } from "react";
import GallerySlider from "components/GallerySlider/GallerySlider";
import { DEMO_STAY_LISTINGS } from "data/listings";
import NoImage from "../../images/no-image.jpg";
import { Booking } from "models/booking";
import Badge from "shared/Badge/Badge";
export interface BookingCardHProps {
  className?: string;
  data: Booking;
}

const DEMO_DATA = DEMO_STAY_LISTINGS[0];

const BookingCardH: FC<BookingCardHProps> = ({ className = "", data }) => {
  const {
    stay,
    checkinDate,
    checkoutDate,
    totalPrice,
    totalPeople,
    status,
    bookingRoom,
    paymentId,
    expiredPaymentTime,
  } = data;
  

  const renderSliderGallery = () => {
    return (
      <div className="relative flex-shrink-0 w-full md:w-72 ">
        {/* <GallerySlider
          ratioClass="aspect-w-6 aspect-h-5"
          galleryImgs={galleryImgs}
          uniqueID={`StayCardH_${id}`}
          href={href}
        /> */}
        <GallerySlider
          uniqueID={`StayCard_${stay?.id}`}
          ratioClass="aspect-w-4 aspect-h-3 "
          galleryImgs={
            stay?.stayImage.length > 0
              ? stay?.stayImage
              : [{ imgId: "19110330", imgLink: NoImage }]
          }
          //href={`/stay/${id}`}
        />
        {/* {saleOff && <SaleOffBadge className="absolute left-3 top-3" />} */}
        {status === 0 && (
          <div className="center ml-10">
            <span>
              Bạn cần thanh toán trước{""}
              <br />
              {expiredPaymentTime
                ? new Date(expiredPaymentTime.toString()).toLocaleString("vi-VN", {
                    hour: "numeric",
                    minute: "numeric",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : ""}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderTienIch = () => {
  let statusText = "";
  if (status === 0) {
    statusText = "Chờ thanh toán";
  } else if (status === 1) {
    statusText = "Đã thanh toán";
  }
  else if (status === 2) {
    statusText = "Đã chấp nhận";
  }
  else if (status === 3) {
    statusText = "Bị hủy bởi khách sạn";
  }
  else if (status === 4) {
    statusText = "Bị hủy bởi người đặt";
  }
  else if (status === 5) {
    statusText = "Đã hoàn tất";
  }
  const formattedCheckinDate = checkinDate ? new Date(checkinDate).toLocaleDateString() : "";
  const formattedCheckoutDate = checkoutDate ? new Date(checkoutDate).toLocaleDateString() : "";

    return (
      <div className="hidden sm:grid grid-rows-3 gap-2">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <i className="las la-user text-lg"></i>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              <>{totalPeople} người</>
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <i className="las la-calendar-check text-lg"></i>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              <>{formattedCheckinDate}</>
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <i className="las la-calendar-times text-lg"></i>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              <>{formattedCheckoutDate}</>
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-md text-neutral-500 dark:text-neutral-400">
              <>Trạng thái: {statusText} </>
            </span>
          </div>
        </div>
        {bookingRoom?.map((room, index) => (
        <div key={index} className="space-y-3">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              <>{room.room.roomName} x {room.quantity} phòng</>
            </span>
          </div>
          {room.voucher && (
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              <>+{room.voucher.name} x1</>
            </span>
          )}
        </div>
      ))}
      </div>
    );
  };
  

  const renderContent = () => {
    return (
      <div className="flex-grow p-3 sm:p-5 flex flex-col">
        <div className="space-y-2">
        <Badge name={stay?.type || ""} />
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            <span>
               {stay?.addressDescription}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-medium capitalize">
              <span className="line-clamp-1">{stay?.name}</span>
            </h2>
          </div>
        </div>
        <div className="hidden sm:block w-14 border-b border-neutral-100 dark:border-neutral-800 my-4"></div>
        {renderTienIch()}
        <div className="w-14 border-b border-neutral-100 dark:border-neutral-800"></div>
        <div className="flex justify-between items-end">
          {/* <StartRating reviewCount={reviewCount} point={reviewStart} /> */}
          <span className="text-base font-semibold text-secondary-500">
            <>
              Tổng giá:{totalPrice?.toLocaleString("vn")} VND
            </>
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`nc-StayCardH group relative bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow will-change-transform ${className}`}
      data-nc-id="StayCardH"
    >
      {/* <Link to={`/listing-stay/stay/${id}`} className="absolute inset-0"></Link> */}
      <div className="grid grid-cols-1 md:flex md:flex-row ">
        {renderSliderGallery()}
        {renderContent()}
      </div>
    </div>
  );
};

export default BookingCardH;
