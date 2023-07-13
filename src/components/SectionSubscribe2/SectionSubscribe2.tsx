import React, { FC, useState } from "react";
import ButtonCircle from "shared/Button/ButtonCircle";
import rightImg from "images/SVG-subcribe2.png";
import NcImage from "shared/NcImage/NcImage";
import Badge from "shared/Badge/Badge";
import Input from "shared/Input/Input";
import authenticationService from "api/authenticationApi";
import { FormEvent } from "react";
import { toast } from "react-hot-toast";
import { CircularProgress } from "@mui/material";
export interface SectionSubscribe2Props {
  className?: string;
}

const SectionSubscribe2: FC<SectionSubscribe2Props> = ({ className = "" }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const onFormSubmit = async (e: FormEvent, email: string) => {
    e.preventDefault();
    try{
      setisLoading(true);
    await authenticationService.registerOwnerEmail(email);
    toast.success('Đăng ký thành công. Vui lòng kiểm tra email để biết thêm thông tin')
    } catch(error) {
      toast.error('Email đã được đăng ký rồi. Vui lòng dùng mail khác ');
      }
    finally{
      setisLoading(false);
    };
  };


  return (
    <div
      className={`nc-SectionSubscribe2 relative flex flex-col lg:flex-row lg:items-center ${className}`}
      data-nc-id="SectionSubscribe2"
    >
      <div className="flex-shrink-0 mb-10 lg:mb-0 lg:mr-10 lg:w-2/5">
        <h2 className="font-semibold text-4xl">Hợp tác cùng UTEtravel🎉</h2>
        <span className="block mt-5 text-neutral-500 dark:text-neutral-400">
          Giới thiệu về những địa điểm nổi bật cùng với UTEtravel.
        </span>
        <ul className="space-y-4 mt-10">
          <li className="flex items-center space-x-4">
            <Badge name="01" />
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              Hợp tác quảng cáo
            </span>
          </li>
          <li className="flex items-center space-x-4">
            <Badge color="red" name="02" />
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              Hợp tác kinh doanh
            </span>
          </li>
        </ul>
        <form className="mt-10 relative max-w-sm" onSubmit={(e) => onFormSubmit(e, email)}>
          <Input
            required
            aria-required
            placeholder="Hãy nhập email của bạn vào đây nha"
            type="email"
            rounded="rounded-full"
            onChange={(e) => setEmail(e.target.value)}
          />
          {isLoading ? (
            <CircularProgress /> 
          ) : (
            <ButtonCircle
              type="submit"
              className="absolute transform top-1/2 -translate-y-1/2 right-[5px]"
            >
              <i className="las la-arrow-right text-xl"></i>
            </ButtonCircle>
          )}
        </form>
      </div>
      <div className="flex-grow">
        <NcImage src={rightImg} />
      </div>
    </div>
  );
};

export default SectionSubscribe2;
