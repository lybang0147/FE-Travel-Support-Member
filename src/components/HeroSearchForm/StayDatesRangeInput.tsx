import React, { useEffect, useState, ReactNode } from "react";
import {
  AnchorDirectionShape,
  DateRangePicker,
  FocusedInputShape,
  CalendarDayShape,
  ModifiersShape 
} from "react-dates";
import "moment/locale/vi";
import { DateRage } from "./StaySearchForm";
import { FC } from "react";
import useWindowSize from "hooks/useWindowResize";
import useNcId from "hooks/useNcId";
import stayService from "api/stayApi";
import moment from "moment";
import { Moment } from "moment";
import { useParams } from "react-router-dom";
export interface StayDatesRangeInputProps {
  defaultValue: DateRage;
  defaultFocus?: FocusedInputShape | null;
  onChange?: (data: DateRage) => void;
  onFocusChange?: (focus: FocusedInputShape | null) => void;
  className?: string;
  fieldClassName?: string;
  wrapClassName?: string;
  numberOfMonths?: number;
  anchorDirection?: AnchorDirectionShape;
}

const StayDatesRangeInput: FC<StayDatesRangeInputProps> = ({
  defaultValue,
  onChange,
  defaultFocus = null,
  onFocusChange,
  className = "[ lg:nc-flex-2 ]",
  fieldClassName = "[ nc-hero-field-padding ]",
  wrapClassName = "",
  numberOfMonths,
  anchorDirection,
}) => {
  const { id } = useParams();
  const [focusedInput, setFocusedInput] = useState(defaultFocus);
  const [stateDate, setStateDate] = useState(defaultValue);
  const startDateId = useNcId();
  const endDateId = useNcId();
  const windowSize = useWindowSize();

  useEffect(() => {
    setStateDate(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setFocusedInput(defaultFocus);
  }, [defaultFocus]);

  const handleDateFocusChange = (focus: FocusedInputShape | null) => {
    setFocusedInput(focus);
    onFocusChange && onFocusChange(focus);
  };

  const renderInputCheckInDate = () => {
    const focused = focusedInput === "startDate";
    return (
      <div
        className={`relative flex ${fieldClassName} items-center space-x-3 cursor-pointer ${
          focused ? "nc-hero-field-focused" : " "
        }`}
      >
        <div className="text-neutral-300 dark:text-neutral-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="nc-icon-field"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <span className="block xl:text-lg font-semibold">
            {stateDate.startDate
              ? stateDate.startDate.format("DD MMM")
              : "Ngày nhận phòng"}
          </span>
          <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
            {stateDate.startDate ? "Ngày nhận phòng" : `Thêm thời gian`}
          </span>
        </div>
      </div>
    );
  };

  const renderInputCheckOutDate = () => {
    const focused = focusedInput === "endDate";
    return (
      <div
        className={`relative flex ${fieldClassName} items-center space-x-3 cursor-pointer ${
          focused ? "nc-hero-field-focused" : " "
        }`}
      >
        <div className="text-neutral-300 dark:text-neutral-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="nc-icon-field"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <span className="block xl:text-lg font-semibold">
            {stateDate.endDate
              ? stateDate.endDate.format("DD MMM")
              : "Ngày trả phòng"}
          </span>
          <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
            {stateDate.endDate ? "Ngày trả phòng" : `Thêm thời gian`}
          </span>
        </div>
      </div>
    );
  };

  const [blockedDates, setBlockedDates] = useState<Moment[]>([]);

  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        if (id) {
          const blockedDatesResponse = await stayService.getBlockedDate(id);
          console.log(blockedDatesResponse)
          const parsedDates = blockedDatesResponse.map((dateString: string) => {
            const date = moment(dateString);
            return date.month(date.month() - 1);
          });
          setBlockedDates(parsedDates);
        }
      } catch (error) {
        console.log("Error fetching blocked dates:", error);
      }
    };
  
    fetchBlockedDates();
  }, []);


  const isDayBlocked = (day: Moment) => {
    return blockedDates.some((date) => day.isSame(date, "day"));
  };

  const handleDatesChange = (dates: { startDate: Moment | null; endDate: Moment | null }) => {
    const { startDate, endDate } = dates;


    const isRangeBlocked = blockedDates.some((blockedDate) => {
      if (startDate && endDate) {
        return blockedDate.isBetween(startDate, endDate, "day", "[]");
      }
      return false;
    });


    if (isRangeBlocked) {
      setStateDate({ startDate: null, endDate: null });
      onChange && onChange({ startDate: null, endDate: null });
    } else {
      setStateDate({ startDate, endDate });
      onChange && onChange({ startDate, endDate });
    }
  };

  const renderDayContents = (day: Moment) => {
    const isBlocked = isDayBlocked(day);
    const classNames = isBlocked ? "blocked-day bg-neutral-900 text-stone-50" : "";
    return (
      <span className={classNames}>{day.format("D")}</span>
    );
  };

  return (
    <div
      className={`StayDatesRangeInput relative flex z-10 ${className} ${
        !!focusedInput ? "nc-date-focusedInput" : "nc-date-not-focusedInput"
      }`}
    >
      <div className="absolute inset-0 flex">
        <DateRangePicker
          startDate={stateDate.startDate}
          endDate={stateDate.endDate}
          focusedInput={focusedInput}
          onDatesChange={handleDatesChange}
          onFocusChange={handleDateFocusChange}
          numberOfMonths={
            numberOfMonths || (windowSize.width < 1024 ? 1 : undefined)
          }
          startDateId={startDateId}
          endDateId={endDateId}
          daySize={
            windowSize.width >= 1024
              ? windowSize.width > 1279
                ? 56
                : 44
              : undefined
          }
          orientation={"horizontal"}
          showClearDates
          noBorder
          hideKeyboardShortcutsPanel
          anchorDirection={anchorDirection}
          customArrowIcon={<div />}
          reopenPickerOnClearDates
          renderDayContents={renderDayContents}
          isDayBlocked={isDayBlocked}
        />
      </div>

      <div className={`flex-1 grid grid-cols-2 relative ${wrapClassName}`}>
        {renderInputCheckInDate()}
        {renderInputCheckOutDate()}
      </div>
    </div>
  );
};

export default StayDatesRangeInput;
