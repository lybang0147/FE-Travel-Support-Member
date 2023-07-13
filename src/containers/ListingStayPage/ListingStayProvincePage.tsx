import React, { FC, ChangeEvent } from "react";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import BgGlassmorphism from "components/BgGlassmorphism/BgGlassmorphism";
import SectionGridAuthorBox from "components/SectionGridAuthorBox/SectionGridAuthorBox";
import SectionHeroArchivePage from "components/SectionHeroArchivePage/SectionHeroArchivePage";
import SectionSliderNewCategories from "components/SectionSliderNewCategories/SectionSliderNewCategories";
import SectionSubscribe2 from "components/SectionSubscribe2/SectionSubscribe2";
import SectionGridHasMap from "./SectionGridHasMap";
import StayCardH from "components/StayCardH/StayCardH";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStayByCriteria } from "redux/slices/staySlice";
import { searchParamsDefault } from "contains/defaultValue";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "redux/store";
import Heading2 from "components/Heading/Heading2";
import Stay from "models/stay";
import User from "models/user";
import Province from "models/province";
import provinceService from "api/provinceApi";
import ReactInputRange, { Range } from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import MoneyRangePicker from "shared/MoneyPicker/MoneyPicker";
import amenitiesService from "api/amenitiesApi";
import Amentity from "models/amenity";
import { SearchParams } from "types";
import Pagination from "shared/Pagination/Pagination";
export interface ListingStayProvincePageProps {
  className?: string;
}

const ListingStayProvincePage: FC<ListingStayProvincePageProps> = ({
  className = "",
}) => {
  const [selectedRange, setSelectedRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 10000000
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
            provinceId: id,
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
    const { id } = useParams();
    const [provinceName, setProvinceName] = useState("");
    useEffect(() => {
      let timeoutId: NodeJS.Timeout;
  
      const fetchProvinceNameAndLoadStays = async () => {
        try {
          if (id) {
            const response = await provinceService.getProvince(id);
            setProvinceName(response.content.name);
            console.log(response.content.name);
            loadStayByCriteria(); 
          }
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
    }, [id, searchQuery, selectedRange.max, selectedRange.min, selectedAmenities, pageIndex, pageSize]);
    
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
    
    <div
      className={`nc-ListingStayMapPage relative ${className}`}
      data-nc-id="ListingStayMapPage"
    >
      <Helmet>
        <title>UTEtravel | Du lịch trong tầm tay</title>
      </Helmet>
      <BgGlassmorphism />

      {/* SECTION HERO */}
      {/* <div className="container pt-10 pb-24 lg:pt-16 lg:pb-28">
        <SectionHeroArchivePage currentPage="Địa điểm" currentTab="Địa điểm" />
      </div> */}

      {/* SECTION */}
      <div className="container pb-24 lg:pb-28 2xl:pl-10 xl:pr-0 xl:max-w-none">
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
            heading={`Khách sạn ở ${provinceName}`}
            subHeading={`${stays.length} khách sạn theo yêu cầu tìm kiếm của bạn`}
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
    </div>
      </div>
      <div className="container overflow-hidden">
        {/* SECTION 1 */}
        {/* <div className="relative py-16">
          <BackgroundSection />
          <SectionSliderNewCategories
            heading="Explore by types of stays"
            subHeading="Explore houses based on 10 types of stays"
            categoryCardType="card5"
            itemPerRow={5}
            sliderStyle="style2"
            uniqueClassName="ListingStayMapPage"
          />
        </div> */}

        {/* SECTION */}
        <SectionSubscribe2 className="py-24 lg:py-28" />

        {/* SECTION */}
        {/* <div className="relative py-16 mb-24 lg:mb-28">
          <BackgroundSection className="bg-orange-50 dark:bg-black dark:bg-opacity-20 " />
          <SectionGridAuthorBox />
        </div> */}
      </div>
    </div>
  );
};

export default ListingStayProvincePage;
