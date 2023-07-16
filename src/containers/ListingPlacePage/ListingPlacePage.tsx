import React, { FC, useEffect, useRef, useState } from "react";
import AnyReactComponent from "components/AnyReactComponent/AnyReactComponent";
import StayCardH from "components/StayCardH/StayCardH";
import GoogleMapReact from "google-map-react";
import { DEMO_STAY_LISTINGS } from "data/listings";
import ButtonClose from "shared/ButtonClose/ButtonClose";
import Checkbox from "shared/Checkbox/Checkbox";
import Pagination from "shared/Pagination/Pagination";
import TabFilters from "containers/ListingStayPage/TabFilters";
import Heading2 from "components/Heading/Heading2";
import PlaceCardH from "containers/PlacePage/PlaceCardH";
import Place from "models/place";
import placesService from "api/placeApi";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { Helmet } from "react-helmet";
import BgGlassmorphism from "components/BgGlassmorphism/BgGlassmorphism";
import { debounce } from "lodash";

const DEMO_STAYS = DEMO_STAY_LISTINGS.filter((_, i) => i < 12);

export interface SectionGridHasMapProps {}

const ListingPlacePage: FC<SectionGridHasMapProps> = () => {
  const {id} = useParams();
  const [currentHoverID, setCurrentHoverID] = useState<string | number>(-1);
  const [showFullMapFixed, setShowFullMapFixed] = useState(false);
  const [provincePlaces, setProvincePlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [searchedPlaceKey, setSearchedPlaceKey] = useState("");
  const placeCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 0,
    lng: 0,
  });

  const debouncedFetchAllPlaceInProvince = useRef(
    debounce(async (searchKey: string) => {
      try {
        const param: any = {
          provinceId: id,
          searchKey,
          latitude: 0,
          longitude: 0,
        };
        const place = await placesService.searchPlace(param);
        setProvincePlaces(place);
        if (place.length > 0) {
          setMapCenter({
            lat: place[0].latitude,
            lng: place[0].longitude,
          });
        }
        console.log(provincePlaces);
      } catch (error) {
        toast.error("Lỗi khi lấy dữ liệu địa điểm");
      }
    }, 1000)
  );

  useEffect(() => {
    debouncedFetchAllPlaceInProvince.current(searchedPlaceKey);
  }, [searchedPlaceKey,id]);

  useEffect(() => {
    placeCardRefs.current = Array(provincePlaces.length)
      .fill(null)
      .map((_, index) => placeCardRefs.current[index] ?? null);
  }, [provincePlaces]);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedPlaceKey(event.target.value);
  };

  const handleMarkerClick = (place: Place) => {
    setSelectedPlace(place);

    const placeIndex = provincePlaces.findIndex((p) => p.id === place.id);
    if (placeIndex !== -1 && placeCardRefs.current[placeIndex]) {
      setSelectedCardIndex(placeIndex);
      placeCardRefs.current[placeIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <div
      className={`nc-ListingStayMapPage relative`}
      data-nc-id="ListingStayMapPage"
    >
      <Helmet>
        <title>UTEtravel | Du lịch trong tầm tay</title>
      </Helmet>
      <h2 className="text-4xl font-semibold mb-4"> Danh sách địa điểm ở: {provincePlaces[0]?.province.name ?? ""} </h2>
      <BgGlassmorphism />
      <div className="relative flex min-h-screen">
        {/* CARDSSSS */}
        <div className="min-h-screen w-full xl:w-[780px] 2xl:w-[880px] flex-shrink-0 xl:px-8 ">
          <div className="mb-8 lg:mb-11">
            <input
              type="text"
              value={searchedPlaceKey}
              onChange={handleSearchInputChange}
              placeholder="Tìm kiếm địa điểm của bạn"
            />
          </div>
          <div className="grid grid-cols-1 gap-8">
          {provincePlaces.map((item, index) => (
              <div
                key={item.id}
                onMouseEnter={() => {setCurrentHoverID((_) => item.id)
                  setSelectedPlace(item);
                  setMapCenter(map => ({ ...map, lat: item.latitude, lng: item.longitude}));
                }}
                onMouseLeave={() => {setCurrentHoverID((_) => -1)
                  setSelectedPlace(null);
                }}
                ref={(ref) => {
                  placeCardRefs.current[index] = ref;
                }}
              >
                 <PlaceCardH data={item} userliked={false} />
              </div>
            ))}
          </div>
          <div className="flex mt-16 justify-center items-center">
          </div>
        </div>

        {!showFullMapFixed && (
          <div
            className="flex xl:hidden items-center justify-center fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-neutral-900 text-white shadow-2xl rounded-full z-30  space-x-3 text-sm cursor-pointer"
            onClick={() => setShowFullMapFixed(true)}
          >
            <i className="text-lg las la-map"></i>
            <span>Show map</span>
          </div>
        )}

        {/* MAPPPPP */}
        <div
          className={`xl:flex-grow xl:static xl:block ${
            showFullMapFixed ? "fixed inset-0 z-50" : "hidden"
          }`}
        >
          {showFullMapFixed && (
            <ButtonClose
              onClick={() => setShowFullMapFixed(false)}
              className="bg-white absolute z-50 left-3 top-3 shadow-lg rounded-xl w-10 h-10"
            />
          )}

          <div className="fixed xl:sticky top-0 xl:top-[88px] left-0 w-full h-full xl:h-[calc(100vh-88px)] rounded-md overflow-hidden">
            <div className="absolute bottom-5 left-3 lg:bottom-auto lg:top-2.5 lg:left-1/2 transform lg:-translate-x-1/2 py-2 px-4 bg-white dark:bg-neutral-800 shadow-xl z-10 rounded-2xl min-w-max">
              <Checkbox
                className="text-xs xl:text-sm"
                name="xx"
                label="Search as I move the map"
              />
            </div>
            {provincePlaces.length > 0 && (
              <GoogleMap
                  zoom={15}
                  center={mapCenter}
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                >
                  {provincePlaces.map((place) => {
                    return (
                      <Marker
                        key={place.id}
                        position={{ lat: place.latitude, lng: place.longitude }}
                        onClick={() => {handleMarkerClick(place)
                          setMapCenter(map => ({ ...map, lat: place.latitude, lng: place.longitude}));
                        }}
                      />
                    );
                  })}
                  {selectedPlace && (
                    <InfoWindow
                      position={{ lat: selectedPlace.latitude, lng: selectedPlace.longitude }}
                      onCloseClick={() => {
                        setSelectedPlace(null);
                      }}
                    >
                      <div>
                        <h3>{selectedPlace.name}</h3>
                        <p>{selectedPlace.addressDescription}</p>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPlacePage;
