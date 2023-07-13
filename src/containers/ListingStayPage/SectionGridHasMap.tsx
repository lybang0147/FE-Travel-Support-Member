import React, { FC, useState, useEffect, ChangeEvent } from "react";
import AnyReactComponent from "components/AnyReactComponent/AnyReactComponent";
import StayCardH from "components/StayCardH/StayCardH";
import GoogleMapReact from "google-map-react";
import { DEMO_STAY_LISTINGS } from "data/listings";
import ButtonClose from "shared/ButtonClose/ButtonClose";
import Checkbox from "shared/Checkbox/Checkbox";
import Pagination from "shared/Pagination/Pagination";
import TabFilters from "./TabFilters";
import { AppDispatch } from "redux/store";
import Heading2 from "components/Heading/Heading2";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "redux/store";
import Stay from "models/stay";
import User from "models/user";
import { getAllStay,getStayByCriteria } from "redux/slices/staySlice";
import { searchParamsDefault } from "contains/defaultValue";
import Amentity from "models/amenity";
import amenitiesService from "api/amenitiesApi";
import { SearchParams } from "types";
import MoneyRangePicker from "shared/MoneyPicker/MoneyPicker";

const DEMO_STAYS = DEMO_STAY_LISTINGS.filter((_, i) => i < 12);

export interface SectionGridHasMapProps {}

const SectionGridHasMap: FC<SectionGridHasMapProps> = () => {

  const [selectedRange, setSelectedRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 20000000
  });
const [pageIndex, setPageIndex] = useState(searchParamsDefault.pageIndex); 
const [pageNumbers, setPageNumbers] = useState<number[]>([]);
const [pageSize, setPageSize] = useState(3); 
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPageIndex(searchParamsDefault.pageIndex);
  };

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<Amentity[]>([]);
  const handleAmenityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const amenity = event.target.value;
    setPageIndex(searchParamsDefault.pageIndex);
    setSelectedAmenities((prevSelectedAmenities) => {
      if (prevSelectedAmenities.includes(amenity)) {
        return prevSelectedAmenities.filter((item) => item !== amenity);
      } else {
        return [...prevSelectedAmenities, amenity];
      }
    });
  };
  useEffect(() => {
    console.log(selectedAmenities);
  }, [selectedAmenities]);
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await amenitiesService.getAllAmenities();
        setAmenities(response.content);
      } catch (error) {
        console.error("Error fetching amenities:", error);
      }
    };
  
    fetchAmenities();
  }, []);

    const dispatch = useDispatch<AppDispatch>();
    const stays = useSelector<RootState, Stay[]>(
        (state) => state.stayStore.stays.content
      );
      const totalElements = useSelector<RootState, number>(
        (state) => state.stayStore.stays.totalElements
      );
      const totalPages = useSelector<RootState, number>(
        (state) => state.stayStore.stays.totalPages
      );
      
      const user = useSelector<RootState, User>((state) => state.userStore.user);
      const [currentHoverID, setCurrentHoverID] = useState<string | number>(-1);
      const [showFullMapFixed, setShowFullMapFixed] = useState(false);

      const loadStayByCriteria = async () => {
        try {
          const params: SearchParams = {
            minPrice: selectedRange.min,
            maxPrice: selectedRange.max,
            searchKey: searchQuery,
            amenitiesId: selectedAmenities.length > 0 ? selectedAmenities.join(',') : undefined,
            pageIndex: pageIndex, 
            pageSize: pageSize, 
          };
          dispatch(getStayByCriteria(params));
        } catch (error) {
          console.log(error);
        }
      };
    const [provinceName, setProvinceName] = useState("");
    useEffect(() => {
      let timeoutId: NodeJS.Timeout;
  
      const fetchProvinceNameAndLoadStays = async () => {
        try {
            loadStayByCriteria(); 
        } catch (error) {
          console.error("Error fetching province name:", error);
        }
      };
  
      const debounceFetch = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(fetchProvinceNameAndLoadStays, 1000);
      };
      debounceFetch();
  
      return () => {
        
        clearTimeout(timeoutId);
      };
    }, [searchQuery, selectedRange.max, selectedRange.min, selectedAmenities, pageIndex, pageSize]);
    
    const handleRangeChange = (value: { min: number; max: number }) => {
      setSelectedRange(value);
      setPageIndex(searchParamsDefault.pageIndex);
    };
    const handlePageChange = (newPageIndex: number) => {
      setPageIndex(newPageIndex);
    };
    useEffect(() => {
      console.log(totalPages)
      const numbers = [];
      for (let i = 1; i <= totalPages; i++) {
        numbers.push(i);
      }
      setPageNumbers(numbers);
    }, [totalPages]);



  return (
    <div>
      <div className="relative flex min-h-screen">
      <div className="flex flex-col mt-8 mb-8">
        <div className="flex-shrink-0 xl:px-8 ">
          <div className="relative mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchQueryChange}
              placeholder="Tìm kiếm khách sạn..."
              className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <MoneyRangePicker selectedRange={selectedRange} onRangeChange={handleRangeChange} />
              <div className="mt-8 flex-shrink-0 xl:px-8">
                <p className="text-lg text-gray-600 mb-4">Tiện ích:</p>
                {amenities.map((amenity) => (
                  <div className="mb-2" key={amenity.id}>
                   <label>
                     <input
                       type="checkbox"
                       value={amenity.id}
                       checked={selectedAmenities.includes(amenity.id || "")}
                       onChange={handleAmenityChange}
                       className="rounded-md h-6 w-6"
                     />
                     <span className="ml-2 font-medium">{amenity.name}</span>
                   </label>
                 </div>
                ))}
              </div>
      </div>
        {/* CARDSSSS */}
        <div className="min-h-screen w-full xl:w-[780px] 2xl:w-[880px] flex-shrink-0 xl:px-8 ">
          <Heading2
            heading={"Kết quả tìm kiếm"}
            subHeading={`${totalElements} khách sạn`}
          />
          {/* <div className="mb-8 lg:mb-11">
            <TabFilters />
          </div> */}
          <div className="grid grid-cols-1 gap-8">
            {stays.map((stay: Stay) => {
              let liked = false;
              if (user) {
                const item = stay?.userLiked?.filter(
                  (item) => item.id === user.id
                );
                if (item && item?.length > 0) {
                  liked = true;
                }
              }
              return (
                <div
                  key={stay.id}
                  onMouseEnter={() => setCurrentHoverID((_) => stay.id ?? -1)}
                  onMouseLeave={() => setCurrentHoverID((_) => -1)}
                >
                  <StayCardH data={stay} userliked={liked} />
                </div>
              );
            })}
          </div>
          <div className="flex justify-center mt-8">
  {totalPages > 0 && (
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
            pageNumber === pageIndex + 1 ? 'bg-blue-500 text-white' : ''
          }`}
          onClick={() => handlePageChange(pageNumber-1)}
        >
          {pageNumber}
        </button>
      ))}
      {pageIndex < totalPages-1 && (
        <button
          className="px-3 py-2 font-medium border rounded-md"
          onClick={() => handlePageChange(pageIndex + 1)}
        >
          Next
        </button>
      )}
    </div>
  )}
</div>
        </div>
      </div>
    </div>
  );
};

export default SectionGridHasMap;
