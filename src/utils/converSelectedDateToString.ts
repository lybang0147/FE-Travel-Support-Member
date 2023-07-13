import { DateRage } from "components/HeroSearchForm/StaySearchForm";

const converSelectedDateToString = ({ startDate, endDate }: DateRage) => {
  const startDateString = endDate?.get("month") !== startDate?.get("month")
  ? startDate?.format("DD MMM")
  : startDate?.format("DD");
  const endDateString = endDate?.format("DD MMM")
  const dateSelectedString =
    startDateString && endDateString
      ? `${startDateString} - ${endDateString}`
      : `${startDateString || endDateString || ""}`;
  return dateSelectedString;
};

export default converSelectedDateToString;
