import React, { FC, useEffect, useState, useRef } from "react";
import AnyReactComponent from "components/AnyReactComponent/AnyReactComponent";
import StayCardH from "components/StayCardH/StayCardH";
import GoogleMapReact from "google-map-react";
import { DEMO_STAY_LISTINGS } from "data/listings";
import ButtonClose from "shared/ButtonClose/ButtonClose";
import Checkbox from "shared/Checkbox/Checkbox";
import Pagination from "shared/Pagination/Pagination";
import TabFilters from "containers/ListingStayPage/TabFilters";
import Heading2 from "components/Heading/Heading2";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import Stay from "models/stay";
import User from "models/user";
import placesService from "api/placeApi";
import toast from "react-hot-toast";
import { SearchParams } from "types";
import stayService from "api/stayApi";
import { Autocomplete, Box, Button, CircularProgress, Dialog, DialogContent, TextField, Typography } from "@mui/material";
import Place from "models/place";
import PlaceCardH from "./PlaceCardH";
import { GoogleMap, InfoWindow, Marker, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const DEMO_STAYS = DEMO_STAY_LISTINGS.filter((_, i) => i < 12);
interface TripPlaceData {
  place: Place;
  distance: number;
}
export interface SectionGridHasMapProps {}

const SectionPlaceTrip: FC<SectionGridHasMapProps> = () => {
  type PlaceData = Record<string, number>;
  const [currentHoverID, setCurrentHoverID] = useState<string | number>(-1);
  const [stayId, setStayId] = useState("");
  const [showFullMapFixed, setShowFullMapFixed] = useState(false);
  const [provincePlaces, setProvincePlaces] = useState<Place[]>([]);
  const [tripPlaces, setTripPlaces] = useState<PlaceData[]>([]);
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);
  const [stays, setStays] = useState<Stay[]>([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [mapCenter, setMapCenter] = useState({
    lat: selectedStay?.latitude ?? 0,
    lng: selectedStay?.longitude ?? 0,
  });
  const [waypoints, setWaypoints] = useState<google.maps.DirectionsWaypoint[]>([]);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [lastPlaceIndex, setLastPlaceIndex] = useState(0);
  const [rendered, setRendered] = useState(false);
  const [routeIndex, setRouteIndex] = useState(0);
  const [searchedPlaceKey, setSearchedPlaceKey] = useState("");
  const [searchPlaceResult, setSearchPlaceResult] = useState<Place[]>([]);
  const [tripPlaceData, setTripPlaceData] = useState<(TripPlaceData)[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect (() => {
    const fetchList = async () => {
      try {
        if (selectedStay !== null) {
          setIsProcessing(true);
          const data = await placesService.getNearByPlaces(selectedStay.id ?? "");
          const transformedData = Object.entries(data).reduce<PlaceData[]>((acc, [key, value]) => {
            acc.push({ [key]: value } as Record<string, number>);
            return acc;
          }, []);

          setTripPlaces(transformedData);

          const directionsWaypoints: google.maps.DirectionsWaypoint[] = [];
          transformedData.forEach((item) => {
            const placeId = Object.keys(item)[0];
            const place = provincePlaces.find((place) => place.id === placeId);
            if (place) {
              directionsWaypoints.push({
                location: `${place.latitude},${place.longitude}`,
                stopover: true,
              });
            }
          });

          const lastPlaceId = Object.keys(transformedData[transformedData.length - 1])[0];
          console.log(lastPlaceId);
          const lastPlace = provincePlaces.find((place) => place.id === lastPlaceId);
          setLastPlaceIndex(lastPlace!= undefined ? provincePlaces.indexOf(lastPlace) : 0);
          setWaypoints(directionsWaypoints);
          setRendered(true);
        }
      }
      catch(error)
      {
        toast.error("Lỗi khi lấy dữ liệu chuyến đi. Vui lòng chọn địa điểm khác")
      }
      finally
      {
        setIsProcessing(false);
      }
    }
    fetchList();
  }, [selectedStay]);

  useEffect(() =>{
    console.log(waypoints);
  }, [waypoints])

  useEffect(() => {
    const fetchAllPlaceInProvince = async () => {
      try{
        const place = await placesService.getPlaceByProvince("2151b654-0e7f-4d07-a378-48c697459627");
        setProvincePlaces(place);
        console.log(provincePlaces);
      }
      catch(error)
      {
        toast.error("Lỗi khi lấy dữ liệu địa điểm");
      }
    }
    fetchAllPlaceInProvince();
  }, [selectedStay])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const fetchStay = async () => {
      try {
        const params: any = {
          provinceId: "2151b654-0e7f-4d07-a378-48c697459627",
          searchKey: searchKey,
          pageIndex: 0,
          pageSize: 20,
        };
        const data = await stayService.getStayByCriteria(params);
        setStays(data.content);
      } catch (error) {
        toast("Lỗi xảy ra khi lấy dữ liệu khách sạn");
      }
    };
  
    const debounceFetchStay = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(fetchStay, 1000);
    };
  
    debounceFetchStay();
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchKey]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const fetchSearchList = async () => {
      try {
        const param: any = {
          provinceId: "2151b654-0e7f-4d07-a378-48c697459627",
          searchKey: searchedPlaceKey,
          latitude: 0,
          longitude: 0,
        };
        const data = await placesService.searchPlace(param);
        setSearchPlaceResult(data);
      } catch (error) {
        toast.error("Lỗi khi lấy dữ liệu địa điểm");
      }
    };
  
    const debounceFetchPlace = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(fetchSearchList, 1000);
    };
  
    debounceFetchPlace();
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchedPlaceKey]);



  const handleSearchChange = (event: React.ChangeEvent<{}>, value: string) => {
    setSearchKey(value);
  };
  const handleSearchPlaceChange = (event: React.ChangeEvent<{}>, value: string) => {
    setSearchedPlaceKey(value);
  };
  const handlePickedPlace = async (place: Place | null) => {
    if (place != null && selectedStay!=null)
    {
      const currentPlaces = tripPlaceData.map((tripPlace) => tripPlace.place);
      const placeExists = currentPlaces.some((p) => p.id === place.id);
      if (!placeExists)
      {
        try
        {
          const updatedPlaces = [...currentPlaces, place];
          const placeIds = updatedPlaces.map((place) => place.id);
          setIsProcessing(true);
          const newTrip = await placesService.buildNewRoute(selectedStay.id ?? "", placeIds);
          const transformedData = Object.entries(newTrip).reduce<PlaceData[]>((acc, [key, value]) => {
            acc.push({ [key]: value } as Record<string, number>);
            return acc;
          }, []);

          setTripPlaces(transformedData);

          const placesToAdd: Place[] = [];
          const directionsWaypoints: google.maps.DirectionsWaypoint[] = [];
          transformedData.forEach((item) => {
            const placeId = Object.keys(item)[0];
            const place = provincePlaces.find((place) => place.id === placeId);
            if (place) {
              directionsWaypoints.push({
                location: `${place.latitude},${place.longitude}`,
                stopover: true,
              });
              placesToAdd.push(place);
            }
          });
          const lastPlaceId = Object.keys(transformedData[transformedData.length - 1])[0];
          console.log(lastPlaceId);
          const lastPlace = provincePlaces.find((place) => place.id === lastPlaceId);
          setLastPlaceIndex(lastPlace!= undefined ? provincePlaces.indexOf(lastPlace) : 0);
          setWaypoints(directionsWaypoints);
          setRendered(true);
        }
        catch(error)
        {
          toast.error("Lỗi khi lấy dữ liệu chuyến đi. Vui lòng chọn địa điểm khác")
        }
        finally
        {
          setIsProcessing(false);
        }
      }
    }
  }

  useEffect(() => {
    const updatedTripPlaceData = tripPlaces.map((item) => {
      const placeId = Object.keys(item)[0];
      const placeDistance = item[placeId];
      const place = provincePlaces.find((place) => place.id === placeId);
      if (place) {
        return {
          place,
          distance: placeDistance
        };
      } else {
        throw new Error(`Place not found with id: ${placeId}`);
      }
    });
    try
    {
      setTripPlaceData(updatedTripPlaceData);
    }
    catch(error: any)
    {
      toast(error.message);
    }
  }, [tripPlaces, provincePlaces]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const updatedPlaces = Array.from(tripPlaces);
    const [removed] = updatedPlaces.splice(result.source.index, 1);
    updatedPlaces.splice(result.destination.index, 0, removed);


    const directionsWaypoints: google.maps.DirectionsWaypoint[] = [];
    updatedPlaces.forEach((item) => {
      const placeId = Object.keys(item)[0];
      const place = provincePlaces.find((place) => place.id === placeId);
      if (place) {
        directionsWaypoints.push({
          location: `${place.latitude},${place.longitude}`,
          stopover: true,
        });
      }
    });

    const lastPlaceId = Object.keys(updatedPlaces[updatedPlaces.length - 1])[0];
    console.log(lastPlaceId);
    const lastPlace = provincePlaces.find((place) => place.id === lastPlaceId);
    setLastPlaceIndex(lastPlace!= undefined ? provincePlaces.indexOf(lastPlace) : 0);
    setWaypoints(directionsWaypoints);
    setRendered(true);
    setTripPlaces(updatedPlaces);
  };

  useEffect(() => {
    console.log(tripPlaces);
  }, [tripPlaces])

  const handleRemovePlace = (placeId: string) => {
    const updatedTripPlaces = tripPlaces.filter(
      (item) => Object.keys(item)[0] !== placeId
    );
    setTripPlaces(updatedTripPlaces);
    const placesToAdd: Place[] = [];
    const directionsWaypoints: google.maps.DirectionsWaypoint[] = [];
    updatedTripPlaces.forEach((item) => {
      const placeId = Object.keys(item)[0];
      const place = provincePlaces.find((place) => place.id === placeId);
      if (place) {
        directionsWaypoints.push({
          location: `${place.latitude},${place.longitude}`,
          stopover: true,
        });
        placesToAdd.push(place);
      }
    });
    const lastPlaceId = Object.keys(updatedTripPlaces[updatedTripPlaces.length - 1])[0];
    console.log(lastPlaceId);
    const lastPlace = provincePlaces.find((place) => place.id === lastPlaceId);
    setLastPlaceIndex(lastPlace!= undefined ? provincePlaces.indexOf(lastPlace) : 0);
    setWaypoints(directionsWaypoints);
    setRendered(true);
  };


  return (
    
    <div>
      <div className="relative flex min-h-screen">
        {/* CARDSSSS */}
        <div className="min-h-screen w-full xl:w-[780px] 2xl:w-[880px] flex-shrink-0 xl:px-8 ">
        <Typography variant="h2" component="span" sx={{ fontSize: 'lg', fontWeight: 'bold', marginBottom: '1rem'}}>Chuyến đi của bạn</Typography>
          <div>
            <Autocomplete
              options={stays}
              getOptionLabel={(option: Stay) => option.name ?? ""} 
              value={null}
              onChange={(event, value) => {setSelectedStay(value);
                setMapCenter(map => ({ ...map, lat: value?.latitude ?? 0, lng: value?.longitude ?? 0}));
              }}
              onInputChange={handleSearchChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search"
                  variant="outlined"
                  fullWidth
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Typography variant="body2">{option.name}</Typography>
                  {/* Render other relevant information */}
                </li>
              )}
              
            />
          </div>
          {/* <div className="mb-8 lg:mb-11">
            <TabFilters />
          </div> */}
          <div className="grid grid-cols-1 gap-8">
          {selectedStay != null && (
            <div
              key={selectedStay.id}
              onMouseEnter={() => {setCurrentHoverID(selectedStay.id ?? "")}}
              onMouseLeave={() => setCurrentHoverID(-1)}
            >
              <StayCardH data={selectedStay} userliked={false} />
            </div>
          )}
           {isProcessing ? (
            <div className="flex justify-center items-center mt-8">
              <CircularProgress />
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tripPlaceData.map((item, index) => (
                      <Draggable key={item.place.id} draggableId={item.place.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div
                              key={item.place.id}
                              onMouseEnter={() => {
                                setCurrentHoverID(item.place.id)
                                setSelectedPlace(item.place);
                                setMapCenter(map => ({ ...map, lat: item.place.latitude, lng: item.place.longitude}));
                              }}
                              onMouseLeave={() => {setCurrentHoverID(-1)
                              setSelectedPlace(null)}}
                            >
                              <PlaceCardH data={item.place} userliked={false} distance={item.distance} />
                            </div>
                            <div className="relative flex-shrink-0 w-full md:w-72 ">
                              <Button onClick={() => handleRemovePlace(item.place.id)} className="mt-2">
                                Remove
                              </Button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
            
          </div>
          {/* <div className="flex mt-16 justify-center items-center">
            <Pagination />
          </div> */}
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
            <div className="absolute bottom-5 left-3 lg:bottom-auto lg:top-2.5 lg:left-1/2 transform lg:-translate-x-1/2 py-2 px-4 bg-white dark:bg-neutral-800 shadow-xl z-10 rounded-2xl w-1/2">
              <Button onClick={() => {
                setShowRoute(!showRoute)
                setRouteIndex(0);
              }}
              style={{ margin: '0 auto', display: 'block' }}
              >
                {showRoute ? "Hide Route" : "Show Route"}
              </Button>
              <Autocomplete
                options={searchPlaceResult}
                getOptionLabel={(option: Place) => option.name ?? ""}
                value={null}
                onChange={(event, value) => {
                  handlePickedPlace(value);
                  setSelectedPlace(value);
                  setMapCenter(map => ({ ...map, lat: value?.latitude ?? 0, lng: value?.longitude ?? 0 }));
                }}
                onInputChange={handleSearchPlaceChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tìm và chọn địa điểm để thêm vào chuyến đi của bạn"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>

            <GoogleMap
                zoom={15}
                center={mapCenter}
                mapContainerStyle={{ width: '100%', height: '100%' }}
              >
                {(showRoute && rendered) && ( 
                    <DirectionsService
                      options={{ 
                        origin: `${selectedStay?.latitude ?? 0},${selectedStay?.longitude ?? 0}`,
                        destination: `${provincePlaces[lastPlaceIndex]?.latitude ?? 0},${provincePlaces[lastPlaceIndex]?.longitude ?? 0}`,
                        waypoints: waypoints.slice(0, waypoints.length-1),
                        travelMode: google.maps.TravelMode.DRIVING
                      }}
                      callback={(result) => {
                        if (result !== null) {
                          setDirections(result);
                          console.log("called");
                          setRendered(false);
                        }
                      }}
                      onLoad={(directionsService) => {
                        setDirectionsService(directionsService);
                      }}
                    />
                  )}
                {showRoute && (
                  <>
                    {directions?.routes.map((route, index) => {
                      return (
                      <DirectionsRenderer
                        key={index}
                        options={{
                          directions: directions,
                          routeIndex: index,
                          suppressMarkers: true,
                          // polylineOptions: {
                          //   strokeColor: getRouteColor(routeIndex),
                          // },
                        }}
                        onLoad={(directionsRenderer) => {
                          setDirectionsRenderer(directionsRenderer);
                          console.log("rendered");
                        }}
                      />
                    );})}
                  </>
                )}
                <Marker position={{ lat: selectedStay?.latitude ?? 0, lng: selectedStay?.longitude ?? 0 }} />
                {provincePlaces.map((place) => {
                  const isTripPlace = tripPlaces.some((item) => Object.keys(item)[0] === place.id);
                  const markerIcon = isTripPlace ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" : "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

                  return (
                    <Marker
                      key={place.id}
                      position={{ lat: place.latitude, lng: place.longitude }}
                      icon={markerIcon}
                      onClick={() => {setSelectedPlace(place);
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionPlaceTrip;
