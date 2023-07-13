import { FC, Fragment, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import LocationMarker from "components/AnyReactComponent/LocationMarker";
import CommentListing from "components/CommentListing/CommentListing";
import FiveStartIconForRate from "components/FiveStartIconForRate/FiveStartIconForRate";
import GuestsInput from "components/HeroSearchForm/GuestsInput";
import { DateRage } from "components/HeroSearchForm/StaySearchForm";
import StartRating from "components/StartRating/StartRating";
import GoogleMapReact from "google-map-react";
import useWindowSize from "hooks/useWindowResize";
import moment from "moment";
import NoImage from "../../images/no-image.jpg";
import {Dialog, TableContainer, Table, TableHead, TableCell, TableBody, TableRow,Typography, CircularProgress,Button, DialogContent, DialogTitle,DialogActions,Tooltip, Radio, RadioGroup, FormControlLabel, Box } from "@mui/material";
import {
  DayPickerRangeController,
  FocusedInputShape,
  isInclusivelyAfterDay,
} from "react-dates";
import Avatar from "shared/Avatar/Avatar";
import Badge from "shared/Badge/Badge";
import ButtonCircle from "shared/Button/ButtonCircle";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import ButtonClose from "shared/ButtonClose/ButtonClose";
import Input from "shared/Input/Input";
import NcImage from "shared/NcImage/NcImage";
import LikeSaveBtns from "containers/ListingDetailPage/LikeSaveBtns";
import ModalPhotos from "containers/ListingDetailPage/ModalPhotos";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import SectionSliderNewCategories from "components/SectionSliderNewCategories/SectionSliderNewCategories";
import SectionSubscribe2 from "components/SectionSubscribe2/SectionSubscribe2";
import StayDatesRangeInput from "components/HeroSearchForm/StayDatesRangeInput";
import MobileFooterSticky from "containers/ListingDetailPage/MobileFooterSticky";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getStayByID, likeStayByID } from "redux/slices/staySlice";
import Room from "models/room";
import Stay from "models/stay";
import Rating from "models/rating";
import { createRating, getRatingByStay } from "redux/slices/rating";
import toast from "react-hot-toast";
import stayService from "api/stayApi";
import { UserIcon } from "@heroicons/react/24/outline";
import { Select } from "@mui/base";
import Voucher from "models/voucher";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import AccessTime, { AttachMoney } from "@mui/icons-material"
import placesService from "api/placeApi";
import Place from "models/place";
import { ClockIcon } from "@heroicons/react/24/solid";
export interface ListingStayDetailPageProps {
  className?: string;
  isPreviewMode?: boolean;
}

const PlaceDetailPage: FC<ListingStayDetailPageProps> = ({
  className = "",
  isPreviewMode,
}) => {
  const { id } = useParams();
  const windowSize = useWindowSize();
  let navigate = useNavigate();
  const [isRefesh, setIsRefesh] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openFocusIndex, setOpenFocusIndex] = useState(0);
  const [rooms,setRooms] = useState<Room[]>([]);
  const [totalPrice,setTotalPrice] = useState<number>(0);
  const [totalRoom,setTotalRoom] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateRage>({
    startDate: null,
    endDate: null,
  });
  const [maxPeople, setMaxPeople] = useState<number>();
  const [selectedNumberOfRooms, setSelectedNumberOfRooms] = useState<Record<string, number>>({});
  const [selectedVoucherList, setSelectedVoucherList] = useState<Record<string, string>>({})
  const [voucherDialogOpen, setVoucherDialogOpen] = useState(false);
  const [vouchers,setVouchers] = useState<Voucher[]>([]);
  const [stayVouchers,setStayVouchers] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [nearByPlace, setNearByPlace] = useState([]);
  const [place, setPlace] =useState<Place>();

  const handleOpenModal = (index: number) => {
    setIsOpen(true);
    setOpenFocusIndex(index);
  };

  const handleCloseModal = () => setIsOpen(false);

  const handleClose = () => {

  }
  
  useEffect(() =>{
    const fetchPlace = async () => {
      if (id)
      {  
        try
        {
          const data = await placesService.getPlaceById(id);
          setPlace(data);
        }
        catch(error)
        {
          toast.error("Lỗi khi lấy dữ liệu địa điểm");
        }
      }
    }
    fetchPlace();
  }, [id])

  const renderSection1 = () => {
    return (
      <div className="listingSection__wrap !space-y-6">
        {/* 1 */}
        <div className="flex justify-between items-center">
          <Badge name={place?.type || ""} />
          {/* <LikeSaveBtns /> */}
        </div>

        {/* 2 */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
          {place?.name || ""}
        </h2>
        {/* {Array.isArray(stay?.stayRating) && stay.stayRating?.length > 0 ? (
            <StartRating
            point={
              parseFloat((stay.stayRating.reduce((sum, rating) => sum + (rating.rate ?? 0), 0) /
        stay.stayRating.length).toFixed(1))
            }
              reviewCount={stay?.stayRating?.length}
            />
          ) : (
            <StartRating point={0} reviewCount={0} />
          )} */}

        {/* 3 */}
        <div className="flex items-center space-x-4">
          <span>
            <i className="las la-map-marker-alt"></i>
            <span className="ml-1">{place?.addressDescription || ""}</span>
          </span>
        </div>

        {/* 4 */}
        <div className="flex items-center">
          <Avatar imgUrl={place?.author?.imgLink || ""} hasChecked sizeClass="h-10 w-10" radius="rounded-full" />
          <span className="ml-2.5 text-neutral-500 dark:text-neutral-400">
            Được đăng bởi{" "}
            {place?.author && (
              <span className="text-neutral-900 dark:text-neutral-200 font-medium">
                {place?.author?.fullName || ""}
              </span>
            )}
          </span>
        </div>

        {/* 5 */}
        <div className="w-full border-b border-neutral-100 dark:border-neutral-700" />
        

        {/* 6 */}
        <div className="flex items-center justify-between xl:justify-start space-x-8 xl:space-x-12 text-sm text-neutral-700 dark:text-neutral-300">
          {/* <div className="flex items-center space-x-3 ">
            <i className=" las la-user text-2xl "></i>
            <span className="">
              <>
                {stay?.maxPeople}{" "}
                <span className="hidden sm:inline-block">người</span>
              </>
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <i className=" las la-bed text-2xl"></i>
            <span className=" ">
              <>
                {stay?.bedNumber}{" "}
                <span className="hidden sm:inline-block"> giường</span>
              </>
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <i className=" las la-bath text-2xl"></i>
            <span className=" ">
              <>
                {stay?.bathNumber}{" "}
                <span className="hidden sm:inline-block"> phòng tắm</span>
              </>
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <i className=" las la-door-open text-2xl"></i>
            <span className=" ">
              <>
                {stay?.bedroomNumber}{" "}
                <span className="hidden sm:inline-block"> phòng ngủ</span>
              </>
            </span>
          </div> */}
        </div>
      </div>
    );
  };

  const renderSection2 = () => {
    return (
      <div className="listingSection__wrap">
        <h2 className="text-2xl font-semibold">Thông tin chi tiết</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div className="text-neutral-6000 dark:text-neutral-300">
          <span>{place?.description}</span>
          <br />
        </div>
      </div>
    );
  };

  const renderSection3 = () => {
      const isFree = place?.minPrice === 0 && place.maxPrice === 0;
      const isSamePrice = place?.minPrice === place?.maxPrice && place?.minPrice !== 0;
    return (
      place && (
        <div className="listingSection__wrap">
          <div>
            <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
              Thông tin về địa điểm
            </span>
          </div>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
  
          <div className="content-between-div">
            <div className="flex items-center">
              <ClockIcon className="mr-2 h-5 w-5" />
              <span className="text-base">
                Thời gian hoạt động: {place.timeOpen} - {place.timeClose}
              </span>
            </div>
            {isFree ? (
              <span className="flex items-center text-base">
                <AttachMoney className="mr-2 h-5 w-5" />
                Miễn phí
              </span>
            ) : isSamePrice ? (
              <span className="flex items-center text-base">
                <AttachMoney className="mr-2 h-5 w-5" />
                Giá tham khảo: {place.minPrice.toLocaleString('vn')} VNĐ
              </span>
            ) : (
              <span className="flex items-center text-base">
                <AttachMoney className="mr-2 h-5 w-5" />
                Giá tham khảo: {place.minPrice.toLocaleString('vn')} - {place.maxPrice.toLocaleString('vn')} VNĐ
              </span>
            )}
          </div>
  
          <div className="w-14 border-b border-neutral-200"></div>
        </div>
      )
    );
  };


  const handleOpenVoucherDialog = async (room: Room) => {
    try
    {
      setIsProcessing(true);  
      const voucherList = await stayService.getRoomVoucher(room.id);
      const usedList = await stayService.getUserVoucher(room.id);
      const stayVoucherList = await stayService.getStayVoucher(id ?? "");
      setStayVouchers(stayVoucherList);
      const filteredVouchers = voucherList
      .filter((voucher) => voucher.hidden === false && new Date(voucher.expirationDate) > new Date())
      .map((voucher) => ({
        ...voucher,
        hidden: usedList.some((usedVoucher) => usedVoucher.id === voucher.id)
      }));
      setVouchers(filteredVouchers);
      setSelectedRoom(room.id);
      setVoucherDialogOpen(true);
    }
    catch(error)
    {
      toast("Lỗi khi lấy danh sách voucher");
    }
    finally
    {
      setIsProcessing(false);
    }
  }

  const handleCloseVoucherDialog = () => {
    setSelectedRoom("");
    setVoucherDialogOpen(false);
  }

  const handleChooseVoucherDialog = () => {
    if (selectedVoucher == null || selectedRoom == "")
    {
      toast.error("Vui lòng chọn voucher")
      return
    }
    setSelectedVoucherList((prevSelectedVoucherList) => ({
      ...prevSelectedVoucherList,
      [selectedRoom]: selectedVoucher,
    }));
    console.log(selectedVoucherList);
    handleCloseVoucherDialog();
  }


//   const handleRating = async () => {
//     const rate = { ...rating, stayid: id };
//     dispatch(createRating(rate));
//     setIsRefesh(!isRefesh);
//   };

//   const renderSection4 = () => {
//     return (
//         <div className="listingSection__wrap">
//           <h2 className="text-2xl font-semibold">Danh sách phòng</h2>
//           <div className="text-neutral-6000 dark:text-neutral-300">
//           <span>Chọn ngày và số lượng thành viên đến ở và chúng tôi sẽ đưa ra các loại phòng phù hợp nhất đối với bạn</span>
//           <br />
//         </div>
//           <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
//           <form className="flex flex-col border border-neutral-200 dark:border-neutral-700 rounded-3xl">
//           <div className="flex flex-col sm:flex-row">
//             <div className="sm:w-1/2">
//               <StayDatesRangeInput
//                 wrapClassName="divide-x divide-neutral-200 dark:divide-neutral-700 !grid-cols-1 sm:!grid-cols-2"
//                 onChange={(date) => setSelectedDate(date)}
//                 fieldClassName="p-3"
//                 defaultValue={selectedDate}
//                 anchorDirection="right"
//                 className="nc-ListingStayDetailPage__stayDatesRangeInput flex-1"
//               />
//             </div>
//             <div className="w-full sm:w-1/2">
//               <GuestsInput
//                 className="nc-ListingStayDetailPage__guestsInput flex-1"
//                 fieldClassName="p-3"
//                 defaultValue={guestValue}
//                 onChange={(data) => changeMaxPeople(data)}
//                 hasButtonSubmit={false}
//               />
//             </div>
//           </div>
//           <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
//           <div className="flex items-center justify-center py-3">
//             <button
//               type="button"
//               className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
//               onClick={handleGetRoom}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <circle cx="10.5" cy="10.5" r="7.5"></circle>
//                 <line x1="21" y1="21" x2="15.8" y2="15.8"></line>
//               </svg>
//               Tìm phòng
//             </button>
//           </div>
//         </form>
//           <TableContainer>
//             <Table style={{ border: '1px solid #000' }}>
//               <TableHead>
//                 <TableRow>
//                   <TableCell className="border">Loại phòng</TableCell>
//                   <TableCell className="border">Số lượng khách</TableCell>
//                   <TableCell className="border" align="right">Giá tiền</TableCell>
//                   <TableCell className="border" align="right">Voucher</TableCell>
//                   <TableCell className="border" align="right">Số lượng phòng</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {rooms.map((room) => {
//                   const roomOptions = Array.from({ length: (room.numberOfRoom ?? 0) + 1 }, (_, optionIndex) => optionIndex);
//                   const roomSelectedNumberOfRooms = selectedNumberOfRooms[room.id] || 0;
  
//                   return (
//                     <TableRow hover key={room.id} className="border">
//                       <TableCell className="border">
//                         <Typography variant="body1" fontWeight="bold" color="primary" gutterBottom noWrap className="text-blue-500 text-lg underline">
//                           {room.roomName}
//                         </Typography>
//                         {room.roomService && room.roomService.map((service) => (
//                           <div key={service.roomServiceName} className="flex items-center">
//                             <span className="mr-2 text-green-500">&#10003;</span>
//                             <span>{service.roomServiceName}</span>
//                           </div>
//                         ))}
//                       </TableCell>
//                       <TableCell className="border">
//                         <div className="flex gap-2">
//                         {(room ? room.guestNumber : 0) > 4 ? (
//                             <>
//                               <UserIcon className="w-8 h-8" />
//                               x {room.guestNumber}
//                             </>
//                           ) : (
//                             Array.from(Array(room.guestNumber), (_, guestIndex) => (
//                               <UserIcon key={guestIndex} className="w-8 h-8" />
//                             ))
//                           )}
//                         </div>
//                       </TableCell>
//                       <TableCell className="border" align="right">
//                         <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
//                           {room.price?.toLocaleString("vn")} VND
//                         </Typography>
//                       </TableCell>
//                       <TableCell align="right">
//                         <Button onClick={() => handleOpenVoucherDialog(room)}>Xem voucher</Button>
//                       </TableCell>
//                       <TableCell className="border" align="right">
//                         {room.numberOfRoom === 0 ? (
//                           <span className="inline-block px-2 py-1 text-sm font-semibold text-red-500 bg-red-100 rounded">
//                           Đã hết phòng
//                         </span>
//                         ) : (
//                           <select
//                             value={roomSelectedNumberOfRooms}
//                             onChange={(e) =>
//                               handleNumberOfRoomsChange(room.id, parseInt(e.target.value))
//                             }
//                           >
//                             {roomOptions.map((option) => (
//                               <option key={option} value={option}>
//                                 {option}
//                               </option>
//                             ))}
//                           </select>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </div>
//     );
//   };
  

  // const renderSection6 = () => {
  //   return (
  //     ratings && (
  //       <div className="listingSection__wrap">
  //         {/* HEADING */}
  //         <h2 className="text-2xl font-semibold">
  //           Đánh giá ({ratings?.length})
  //         </h2>
  //         <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

  //         {/* Content */}
  //         {/* <div className="space-y-5">
  //           <FiveStartIconForRate
  //             iconClass="w-6 h-6"
  //             className="space-x-0.5"
  //             onRating={(rate) => setRating({ ...rating, rate: rate })}
  //           />
  //           <div className="relative">
  //             <Input
  //               fontClass=""
  //               sizeClass="h-16 px-4 py-3"
  //               rounded="rounded-3xl"
  //               placeholder="Hãy chia sẽ cảm nghĩ của bạn nào ..."
  //               onChange={(e) =>
  //                 setRating({ ...rating, message: e.target.value })
  //               }
  //             />
  //             <ButtonCircle
  //               className="absolute right-2 top-1/2 transform -translate-y-1/2"
  //               size=" w-12 h-12 "
  //               onClick={handleRating}
  //             >
  //               <ArrowRightIcon className="w-5 h-5" />
  //             </ButtonCircle>
  //           </div>
  //         </div> */}

  //         {/* comment */}
  //         <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
  //           <>
  //             {ratings &&
  //               Array.isArray(ratings) &&
  //               ratings?.length > 0 &&
  //               ratings.map((rating: Rating, index: number) => {
  //                 return <CommentListing className="py-8" data={rating} />;
  //               })}
  //             {/* {ratings?.length > 8 && (
  //               <div className="pt-8">
  //                 <ButtonSecondary>Xem thêm nè</ButtonSecondary>
  //               </div>
  //             )} */}
  //           </>
  //         </div>
  //       </div>
  //     )
  //   );
  // };

  // useEffect(() => {
  //   const searchNearbyPlaces = async () => {
  //     try 
  //     {
  //       const data = await placesService.getNearByPlaces(stay.latitude ?? 0,stay.longitude ?? 0);
  //       const firstFiveResults = data.results.slice(0, 5);
  //       setNearByPlace(firstFiveResults);
  //       console.log(nearByPlace);
  //     }
  //     catch(error)
  //     {
  //       console.log(error);
  //     }
  //   };
  //   searchNearbyPlaces();
  // }, [id]);



  const renderSectionMap = () => {
    if (!place) {
      return null; 
    }
  
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <div>
          <h2 className="text-2xl font-semibold">Định vị</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            {place.addressDescription}
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />
  
        {/* MAP */}
        <div className="aspect-w-5 aspect-h-5 sm:aspect-h-3">
          <div className="rounded-xl overflow-hidden">
              <GoogleMap
                zoom={15}
                center={{
                  lat: place.latitude,
                  lng: place.longitude,
                }}
                mapContainerStyle={{ width: '100%', height: '100%' }}
              >
                <Marker position={{ lat: place.latitude, lng: place.longitude }} />
              </GoogleMap>
          </div>
        </div>
      </div>
    );
  };

  // const changeMaxPeople = async (data: any) => {
  //   setGuestValue(data);
  //   console.log(data)
  //   const peoples = Object.values(data).reduce((accumulator, current) => {
  //     return Number(accumulator) + Number(current);
  //   }, 0);
  //   peoples && setMaxPeople(Number(peoples));
  // };

  const renderSidebar = () => {
    return (
      <div className="listingSectionSidebar__wrap shadow-xl">
        {/* PRICE */}
        {/* <div className="flex justify-between">
          <div className="flex flex-col">
            {rooms.map((room) => {
              const voucherId = selectedVoucherList[room.id];
              const voucher = stayVouchers.find((v) => v.id === voucherId);
              return (
                <div key={room.id}>
                  {selectedNumberOfRooms[room.id] && (
                    <span>
                      {room.roomName} x{selectedNumberOfRooms[room.id]}
                    </span>
                    
                  )}
                  <br/>
                  {voucher && (
                    <span
                      style={{ marginLeft: '5px', fontSize: '14px' }}
                      key={room.id}
                    >
                      +{voucher.name} ({voucher.discount}%)
                    </span>
                )}  
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
            {totalPrice>0 && (
              <>
                  {selectedDate.endDate != null &&
                  selectedDate.startDate != null &&(
                  <span>
                  {moment(selectedDate.endDate).diff(
                          moment(selectedDate.startDate),
                          "days"
                        )} {"ngày, "} {totalRoom} phòng
                  </span>
                  )}
              </>
            )}
          </div>
          <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
          <div className="flex justify-between font-semibold">
            <span>Tổng chi phí</span>
            {totalPrice>0 &&
              selectedDate.endDate != null &&
              selectedDate.startDate != null && (
                <span>
                  {(Number(totalPrice) *
                    moment(selectedDate.endDate).diff(
                      moment(selectedDate.startDate),
                      "days"
                    )).toLocaleString("vn")} {" "}VND
                </span>
              )}
          </div>
        </div> */}

        {/* SUBMIT */}
        {/* <ButtonPrimary onClick={handleBook}>Tiếp tục</ButtonPrimary> */}
      </div>
    );
  };

  const handleBook = () => {

    if (
      !maxPeople &&
      selectedDate.startDate === null &&
      selectedDate.endDate === null
    ) {
      toast.error("Vui lòng chọn thông tin !");
    } else {
      if (selectedDate.startDate === null || selectedDate.endDate === null) {
        toast.error("Vui lòng chọn ngày !");
      } else {
        if (!maxPeople) {
          toast.error("Vui lòng chọn tổng số người !");
        } else {
          const numberOfRoomsArray = Object.entries(selectedNumberOfRooms);
          const numberOfRoomsString = numberOfRoomsArray
            .map(([room, count]) => `${room}:${count}`)
            .join(",");
          const numberOfVouchersArray = Object.entries(selectedVoucherList);
          const numberofVoucherString = numberOfVouchersArray
            .map(([room, voucher]) => `${room}:${voucher}`)
            .join(",");
          navigate(
            `/checkout/${id}&${moment(selectedDate.startDate).format(
              "YYYY-MM-DDTHH:mm"
            )}&${moment(selectedDate.endDate).format(
              "YYYY-MM-DDTHH:mm"
            )}&${maxPeople}&${numberOfRoomsString}&${numberofVoucherString}`
          );
        }
      }
    }
  };
  return (
    <div
      className={`ListingDetailPage nc-ListingStayDetailPage ${className}`}
      data-nc-id="ListingStayDetailPage"
    >
      {/* SINGLE HEADER */}
      <>
        <header className="container 2xl:px-14 rounded-md sm:rounded-xl">
          <div className="relative grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2">
            <div
              className="col-span-2 row-span-3 sm:row-span-2 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer"
              onClick={() => handleOpenModal(0)}
            >
              {place?.placeImage &&
                Array.isArray(place.placeImage) &&
                place.placeImage.length > 0 && (
                  <NcImage
                    containerClassName="absolute inset-0"
                    className="object-cover w-full h-full rounded-md sm:rounded-xl"
                    src={place.placeImage[0].imgLink || ""}
                  />
                )}
              <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity"></div>
            </div>
            {place?.placeImage &&
              place?.placeImage
                ?.filter((_, i) => i >= 1 && i < 5)
                .map((item, index) => (
                  <div
                    key={index}
                    className={`relative rounded-md sm:rounded-xl overflow-hidden ${
                      index >= 3 ? "hidden sm:block" : ""
                    }`}
                  >
                    <NcImage
                      containerClassName="aspect-w-4 aspect-h-3 sm:aspect-w-6 sm:aspect-h-5"
                      className="object-cover w-full h-full rounded-md sm:rounded-xl "
                      src={item.imgLink || ""}
                    />

                    {/* OVERLAY */}
                    <div
                      className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => handleOpenModal(index + 1)}
                    />
                  </div>
                ))}

            <div
              className="absolute hidden md:flex md:items-center md:justify-center left-3 bottom-3 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-500 cursor-pointer hover:bg-neutral-200 z-10"
              onClick={() => handleOpenModal(0)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <span className="ml-2 text-neutral-800 text-sm font-medium">
                Tất cả hình ảnh
              </span>
            </div>
          </div>
        </header>
        {/* MODAL PHOTOS */}
        <ModalPhotos
          imgs={place?.placeImage ?? [{ imgId: "19110330", imgLink: NoImage }]}
          isOpen={isOpen}
          onClose={handleCloseModal}
          initFocus={openFocusIndex}
          uniqueClassName="nc-ListingStayDetailPage-modalPhotos"
        />
      </>

      {/* MAIn */}
      <main className="container relative z-10 mt-11 flex flex-col lg:flex-row ">
        {/* CONTENT */}
        <div className="w-full lg:w-2/3 xl:w-3/4 space-y-8 lg:space-y-10 lg:pr-10">
          {renderSection1()}
          {renderSection2()}
          {renderSection3()}
          {/* {renderSection4()} */}
          {/* {renderSectionCheckIndate()} */}
          {/* {renderSection5()} */}
          {renderSectionMap()}
          {/* {renderSection6()} */}
          {/* {renderSection8()} */}
          {/* <Dialog open={voucherDialogOpen} onClose={handleCloseVoucherDialog}>
            <DialogTitle>Voucher</DialogTitle>
            <DialogContent>
              <Box maxWidth="sm">
                <div>
                  <h4>Voucher hiện tại:</h4>
                  <RadioGroup
                    aria-label="vouchers"
                    name="vouchers"
                    value={selectedVoucher ? selectedVoucher : null}
                    onChange={(e) => {
                      setSelectedVoucher(e.target.value);
                    }}
                  >
                    {vouchers.map((voucher) => {
                      const expirationDate = new Date(voucher.expirationDate);
                      const formattedExpirationDate = expirationDate.toLocaleDateString();
                      const isPicked = voucher.id === selectedVoucher;
                      return (
                        <Box
                          key={voucher.id}
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          border={isPicked ? "2px solid blue" : "2px solid grey"}
                          padding="1rem"
                          borderRadius="0.25rem"
                          marginBottom="0.5rem"
                        >
                          <FormControlLabel
                            value={voucher.id}
                            control={<Radio />}
                            disabled={voucher.hidden}
                            label={
                              <Typography>
                                <div>
                                  <span>Tên: {voucher.name}</span>
                                </div>
                                <div>
                                  <span>Hết hạn: {formattedExpirationDate}</span>
                                </div>
                                <div>
                                  <span>Giảm giá: {voucher.discount}%</span>
                                </div>
                                <div>
                                  <span>Số lượng còn lại: {voucher.quantity-voucher.remainingQuantity}</span>
                                </div>
                              </Typography>
                            }
                            style={{
                              background: voucher.hidden ? 'grey' : 'inherit',
                              pointerEvents: voucher.hidden ? 'none' : 'auto',
                            }}
                          />
                        </Box>
                      );
                    })}
                  </RadioGroup>
                </div>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleChooseVoucherDialog} color="primary">
                Áp dụng
              </Button>
              <Button onClick={handleCloseVoucherDialog}>Đóng</Button>
            </DialogActions>
          </Dialog> */}
        </div>

        {/* SIDEBAR */}
        {/* <div className="hidden lg:block flex-grow mt-14 lg:mt-0">
          <div className="sticky top-28">{renderSidebar()}</div>
        </div> */}
      </main>

      {/* STICKY FOOTER MOBILE */}
      {!isPreviewMode && <MobileFooterSticky />}

      {/* OTHER SECTION */}
      {!isPreviewMode && (
        <div className="container py-24 lg:py-32">
          {/* SECTION 1 */}
          {/* <div className="relative py-16">
            <BackgroundSection /ß
            <SectionSliderNewCategories
              categoryCardType="card5"
              itemPerRow={5}
              sliderStyle="style2"
              uniqueClassName={"ListingStayDetailPage1"}
            />
          </div> */}

          {/* SECTION */}
        </div>
      )}
      <Dialog open={isProcessing} onClose={handleClose}>
        <div className="flex items-center justify-center">
          <CircularProgress />
          <Typography variant="body1">Đang tải dữ liệu</Typography>
        </div>
      </Dialog>
    </div>
  );
};

export default PlaceDetailPage;
