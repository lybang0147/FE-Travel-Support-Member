import React, { FC, useEffect } from "react";
import Input from "shared/Input/Input";
import Select from "shared/Select/Select";
import CommonLayout from "./CommonLayout";
import FormItem from "./FormItem";
import Textarea from "shared/Textarea/Textarea";
import { useState } from "react";
import { toast } from "react-hot-toast";
import StayAddRequest from "models/request/stayAddRequest";
import NoImage from "../../images/no-image.jpg";
import GallerySlider from "components/GallerySlider/GallerySlider";
import { InputLabel, TextField} from "@mui/material";
import Amentity from "models/amenity";
import amenitiesService from "api/amenitiesApi";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress,Box,Typography } from "@mui/material";
import stayService from "api/stayApi";
import { useParams } from "react-router-dom";
import Stay from "models/stay";
import StayUpdateRequest from "models/request/stayUpdateRequest";
import FormImage from "components/ImageForm/ImageForm";
import { LargeNumberLike } from "crypto";
import AutoCompleteSearch from "components/AutoComplete/AutoCompleteSearch";
export interface PageAddListing2Props {
  className?: string;
}

const PageAddListing2: FC<PageAddListing2Props> = ({
  className = "",
}) => {

  const { id } = useParams();
  
  const [stay, setStay] = useState<Stay>();
  const [stayName, setStayName] = useState<string>("");
  const [stayAddress, setStayAddress] = useState({
    address: "",
    longitude: 0,
    latitude: 0
  });
  const [stayDetails, setStayDetails] = useState<string>("");
  const [imageFile, setImageFile] = useState<File[]>([]);
  const [imageLink, setImageLink] = useState<string[] | null>(null);
  const [amenities, setAmenities] = useState<Amentity[]>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [checkinTime, setCheckinTime] = useState<string>("");
  const [checkoutTime, setCheckoutTime] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [deletedImage, setDeletedImage] = useState<string[]>([]);

  const handleStayNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStayName(event.target.value);
  };

  const handleStayAddressChange = (address: { address: string; longitude: number; latitude: number }) => {
    setStayAddress(address);
    console.log(address);
  };

  const handleStayDetailsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStayDetails(event.target.value);
  };

  const handleDialogToggle = () => {
    setIsDialogOpen(!isDialogOpen);
  };


  const handleAmenitySelect = (amenityId: string) => {
    setSelectedAmenities((prevSelectedAmenities) => {
      if (prevSelectedAmenities.includes(amenityId)) {
        return prevSelectedAmenities.filter((id) => id !== amenityId);
      } else {
        return [...prevSelectedAmenities, amenityId];
      }
    });
  };

  const handleDeleteImage = (index: number) => {
    if (imageLink && imageLink.length > 0 && imageFile && imageFile.length>0) {
      const updatedImageLink = [...imageLink];
      const updatedImageFile = [...imageFile];
  
      if (updatedImageFile[index] && updatedImageFile[index].size === 0) {
        const deletedImg = updatedImageLink[index];
        setDeletedImage((prevDeletedImage) => [...prevDeletedImage, deletedImg]);
      }
  
      updatedImageLink.splice(index, 1);
      updatedImageFile.splice(index, 1);
  
      setImageLink(updatedImageLink);
      setImageFile(updatedImageFile);
    }
  };

  useEffect(() => {
    const fecthStayInfo = async () => {
      try{
        if (id)
        {
          const stay = await stayService.getStayWithId(id);
          setStay(stay);

          const amenityIDs = stay?.amenities?.map((amenity) => amenity.id ?? "");
          const stayImg = stay?.stayImage.map((stayimg) => stayimg.imgLink ?? "");
          
          setSelectedAmenities(amenityIDs ?? []);
          setStayName(stay?.name ?? "");
          setStayDetails(stay?.stayDescription ?? "");
          setStayAddress((prevState) => ({
            ...prevState,
            longitude: stay?.longitude ?? 0,
            latitude: stay?.latitude ?? 0,
          }));
          console.log(stayAddress);
          setCheckinTime(stay?.checkinTime ?? "");
          setCheckoutTime(stay?.checkoutTime ?? "");
          setImageLink(stayImg ?? []);
          const emptyFiles = stayImg?.map(() => new File([], "")) ?? [];
          setImageFile(emptyFiles);
        }
      }catch (error) {
        console.log("Lỗi khi lấy thông tin nơi ở", error);
      }
    }

    fecthStayInfo();
  }, [id]);


  useEffect(() => {
    const fetchAmenitiesList = async () => {
      try {
        const amenitiesList = await amenitiesService.getAllAmenities();
        setAmenities(amenitiesList.content);
      } catch (error) {
        console.log("Error fetching booking list:", error);
      }
    };
    
    fetchAmenitiesList();
  }, []);

  const checkTypeFile = (type: any, filename: string) => {
    const typeFile = ["image/jpeg", "image/png", "image/jpg"];
    const validFilenameRegex = /^[a-zA-Z0-9_.-]+$/;
    return typeFile.includes(type) && validFilenameRegex.test(filename);
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    let reader = new FileReader();
    if (e.target.files && e.target.files.length > 0) { 
      const file = e.target.files[0];
      const filename = file.name;
      console.log(filename);
      reader.readAsDataURL(file);
      if (checkTypeFile(file.type,filename)) {
        if (file.size < 1024 * 1024 * 5) {
          setImageFile((prevImageFiles) => {
            if (prevImageFiles) {
              return [...prevImageFiles, file];
            }
            return [file];
          });
          reader.onloadend = function (e: ProgressEvent<FileReader>) {
            setImageLink((prevImageLinks) => {
              if (prevImageLinks) {
                return [...prevImageLinks, reader.result as string];
              }
              return [reader.result as string];
            });
          }.bind(this);
        } else {
          toast.error("Hình ảnh upload quá lớn, Hình ảnh phải nhỏ hơn 5MB");
        }
      } else {
        toast.error(
          " Chỉ cho phép upload đuôi (.jpg .png .jpeg) và tên tệp chỉ bao gồm chữ thường, chữ hoa, số, dấu gạch dưới và dấu gạch giữa '_-'"
        );
      }
    }
  };

  const handleSubmit = async () => {
    if (!stay || !stay.id || !stayName || !stayAddress || !stayDetails || !checkinTime || checkinTime=="" ||  !checkoutTime || checkoutTime=="") {
      toast.error("Vui lòng điền toàn bộ các trường");
      return;
    }
    if (stayAddress.address=="")
    {
      stayAddress.address = stay.addressDescription ?? "";
      stayAddress.latitude = stay.latitude ?? 0;
      stayAddress.longitude = stay.longitude ?? 0;
    }

    const filteredImageFile = imageFile.filter((file) => file.size > 0);

    const editedStay: StayUpdateRequest = {
      id: stay?.id,
      name: stayName,
      addressDescription: stayAddress.address,
      stayImage: filteredImageFile,
      stayDescription: stayDetails,
      checkinTime:checkinTime,
      checkoutTime: checkoutTime,
      amenities: selectedAmenities,
      stayRemoveImage: deletedImage,
      longitude: stayAddress.longitude,
      latitude: stayAddress.latitude,
    }
    
    try
    {
      setIsProcessing(true);
      const response = await stayService.updateStay(editedStay);
      toast.success("Chỉnh sửa thông tin nơi ở thành công");
      window.location.href = "/owner";
    }
    catch (error)
    {
      toast.error("Lỗi khi chỉnh sửa nơi ở");
    }
    finally
    {
      setIsProcessing(false);
    }
  };


  return (
    <CommonLayout
      index="01"
      backtHref="/owner"
      nextHref="/add-listing-2"
      nextBtnText="Submit"
      onSubmit={handleSubmit}
    >
      <>
        <h2 className="text-2xl font-semibold">Thông tin nơi ở:{stay?.name}</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* FORM */}
        <div className="space-y-8">
          {/* ITEM */}
          <FormItem
              label="Loại nơi ở"
              desc="Tips: Các nơi ở chuyên nghiệp thường có phong cách và chủ để trang trí độc đáo riêng cho nơi ở của mình "
            >
              <TextField className="w-full" value={stay?.type} disabled
               InputProps={{
                style: { color:'black',fontWeight: 'bold', backgroundColor: 'lightgrey' },
              }} />
            </FormItem>
          <FormItem
            label="Tên nơi ở"
            desc="Một cái tên hấp dẫn thường bao gồm: Tên nhà + Tên phòng + Đặc điểm nổi bật + Địa điểm du lịch"
          >
            <Input
              placeholder="Tên nơi ở"
              value={stayName}
              onChange={handleStayNameChange}
            />
          </FormItem>
          <FormItem
            label="Chi tiết nơi ở"
            desc="Hãy đề cập tới các tiện ích, các thuận lợi của nơi ở của bạn"
          >
            <Textarea
              placeholder="..."
              rows={14}
              value={stayDetails}
              onChange={handleStayDetailsChange}
            />
          </FormItem>
          <FormItem
          label="Tỉnh, thành phố"
          desc="Tỉnh, thành phố của nơi ở"
        >
          <TextField
            value={stay?.province?.name || ""}
            disabled
            fullWidth
            InputLabelProps={{ shrink: true}}
            InputProps={{
              style: { color:'black',fontWeight: 'bold', backgroundColor: 'lightgrey' },
            }}
          />
        </FormItem>
        <FormItem label="Địa chỉ nơi ở" desc={`Địa chỉ đã chọn: ${stayAddress.address == "" ? stay?.addressDescription : stayAddress.address}`}>
            <AutoCompleteSearch
              value={stayAddress.address}
              onChange={handleStayAddressChange}
            />
          </FormItem>
          <FormItem label="Các tiện ích của nơi ở"
            desc="Lựa chọn các tiện ích hiện có cho nơi ở của bạn">
            <div className="flex justify-start">
            {selectedAmenities.map((amenityId) => {
              const selectedAmenity = amenities?.find((amenity) => amenity.id === amenityId);
              if (selectedAmenity) {
                return (
                  <div key={selectedAmenity.id} className="bg-primary-500 text-white px-4 py-2 rounded mr-2">
                    {selectedAmenity.name}
                  </div>
                );
              }
              return null;
            })}
              <button
                className="bg-primary-500 text-white px-4 py-2 rounded"
                onClick={handleDialogToggle}
              >
                +
              </button>
            </div>
          </FormItem>
          <FormItem label="Check-in Time" desc="Select the check-in time">
            <TextField
              type="time"
              value={checkinTime}
              onChange={(e) => setCheckinTime(e.target.value)}
              inputProps={{
                step: 300, 
              }}
            />
          </FormItem>

          <FormItem label="Check-out Time" desc="Select the check-out time">
            <TextField
              type="time"
              value={checkoutTime}
              onChange={(e) => setCheckoutTime(e.target.value)}
              inputProps={{
                step: 300, 
              }}
            />
          </FormItem>

              <FormImage 
                  label="Hình ảnh"
                  desc=""
                  imageLink={imageLink ?? []}
                  handleUploadImage={handleUploadImage}
                  handleDeleteImage={handleDeleteImage}
                  />
        </div>
      </>
      <Dialog open={isDialogOpen}>
        <DialogTitle>Lựa chọn tiện ích</DialogTitle>
        <DialogContent>
          <div className="flex flex-wrap">
            {amenities?.map((amenity) => (
              <div key={amenity.id} className="w-1/3 mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity.id || "")}
                    onChange={() => handleAmenitySelect(amenity.id || "")}
                  />
                  <span className="ml-2">{amenity.name}</span>
                </label>
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogToggle}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isProcessing}>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Đang xử lý...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
      </CommonLayout>
  );
};

export default PageAddListing2;
