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
export interface PageAddListing3Props {
  className?: string;
}

const PageAddListing3: FC<PageAddListing3Props> = ({
  className = "",
}) => {

  const { id } = useParams();
  
  const [stay, setStay] = useState<Stay>();
  const [stayName, setStayName] = useState<string>("");
  const [stayAddress, setStayAddress] = useState<string>("");
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

  const handleStayAddressChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStayAddress(event.target.value);
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

  useEffect(() => {
    const fecthStay = async () => {
      try{
        if (id)
        {
          const stay = await stayService.getStayWithId(id);
          setStay(stay);
        }
      }catch (error) {
        console.log("Lỗi khi lấy thông tin nơi ở", error);
      }
    }

    fecthStay();
  }, [id]);

  const handleSubmit = async () => {
    if (!stay || !stay.id || !stayName || !stayAddress || !stayDetails || !checkinTime || checkinTime=="" ||  !checkoutTime || checkoutTime=="") {
      toast.error("Vui lòng điền toàn bộ các trường");
      return;
    }

    const filteredImageFile = imageFile.filter((file) => file.size > 0);

    const editedStay: any = {
      id: stay?.id,
      name: stayName,
      addressDescription: stayAddress,
      stayImage: filteredImageFile,
      stayDescription: stayDetails,
      checkinTime:checkinTime,
      checkoutTime: checkoutTime,
      amenities: selectedAmenities,
      stayRemoveImage: deletedImage
    }
    
    try
    {
      setIsProcessing(true);
      const response = await stayService.updateStay(editedStay);
      toast.success("Chỉnh sửa thông tin nơi ở thành công");
      window.location.reload();
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
        <h2 className="text-2xl font-semibold">Thông tin phòng của nơi ở nơi ở:{stay?.name}</h2>
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

export default PageAddListing3;
