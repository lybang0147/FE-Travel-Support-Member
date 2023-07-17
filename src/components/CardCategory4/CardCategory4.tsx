import React, { FC } from "react";
import NcImage from "shared/NcImage/NcImage";
import { TaxonomyType } from "data/types";
import { Link } from "react-router-dom";
import convertNumbThousand from "utils/convertNumbThousand";
import Place from "models/place";
import GallerySlider from "components/GallerySlider/GallerySlider";
import NoImage from "../../images/no-image.jpg";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export interface CardCategory4Props {
  className?: string;
  taxonomy: Place;
}

const CardCategory4: FC<CardCategory4Props> = ({ className = "", taxonomy }) => {
  const { name, placeImage, id, addressDescription, timeOpen, timeClose } = taxonomy;

  const renderSliderGallery = () => {
    return (
      <div className="relative w-full">
        <GallerySlider
          uniqueID={`PlaceCard_${id}`}
          ratioClass="aspect-w-4 aspect-h-3"
          galleryImgs={
            placeImage.length > 0
              ? placeImage
              : [{ imgId: "19110052", imgLink: NoImage }]
          }
        />
      </div>
    );
  };

  return (
    <div className={`nc-StayCard group relative bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden will-change-transform hover:shadow-xl transition-shadow ${className}`}>
      {renderSliderGallery()}
      <Link
        to={`/listing-place/place/${id}`}
        className={`nc-CardCategory4 flex flex-col ${className}`}
        data-nc-id="CardCategory4"
      >
        <div className="mt-4 px-2">
          <div className="flex items-center">
            <h2 className="text-base sm:text-lg text-neutral-900 dark:text-neutral-100 font-medium truncate">
              {name}
            </h2>
          </div>
          <div className="flex items-center mt-2">
            <AccessTimeIcon className="text-neutral-6000 dark:text-neutral-400 mr-1" />
            <span className="text-sm text-neutral-6000 dark:text-neutral-400">
              {timeOpen} - {timeClose}
            </span>
          </div>
          <div className="flex items-center">
            <PlaceIcon className="text-neutral-6000 dark:text-neutral-400 mr-2" />
            <span className="block mt-2 text-sm text-neutral-6000 dark:text-neutral-400">
              {addressDescription}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CardCategory4;
