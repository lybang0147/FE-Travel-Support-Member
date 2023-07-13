import React from "react";
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const MAX_IMAGES = 6;

const FormImage = ({
  label,
  desc,
  imageLink,
  handleUploadImage,
  handleDeleteImage
}: {
    label: string;
    desc: string;
    imageLink: string[];
    handleUploadImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleDeleteImage: (index: number) => void;
  }) => {
  const handleMouseEnter = (index: number) => {
    const image = document.getElementById(`image-delete-${index}`);
    if (image) {
      image.style.display = "block";
    }
  };

  const handleMouseLeave = (index: number) => {
    const image = document.getElementById(`image-delete-${index}`);
    if (image) {
      image.style.display = "none";
    }
  };

  return (
    <div>
      <label className="block mb-2 font-semibold">{label}</label>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">{desc}</p>
      <div className="flex flex-wrap -mx-2">
        {imageLink &&
          imageLink.map((link, index) => (
            <div key={index} className="w-1/2 p-2">
              <div
                className="relative group aspect-w-4 aspect-h-3 bg-neutral-200 dark:bg-neutral-700 rounded-xl overflow-hidden cursor-pointer"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
              >
                <img
                  className="w-full h-full object-cover"
                  src={link}
                  alt={`Image ${index + 1}`}
                />
                 <div id={`image-delete-${index}`} 
                 className="absolute top-2 right-2 z-10">
                    <IconButton onClick={() => handleDeleteImage(index)} size="small">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                 </div>
              </div>
            </div>
          ))}
    </div>
    {imageLink && imageLink.length < MAX_IMAGES && (
          <div className="p-2 w-1/2 mt-12">
            <label className="relative group aspect-w-4 aspect-h-3 bg-neutral-200 dark:bg-neutral-700 rounded-xl cursor-pointer">
              <input
                accept="image/*"
                type="file"
                onChange={handleUploadImage}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              />
              <span className="absolute inset-0 flex items-center justify-center cursor-pointer">
                <Button variant="contained" component="span">
                  Thêm ảnh
                </Button>
              </span>
            </label>
          </div>
        )}
      </div>
  );
};

export default FormImage;
