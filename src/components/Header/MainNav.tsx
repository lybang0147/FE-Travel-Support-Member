import React, { FC, useEffect } from "react";
import Logo from "shared/Logo/Logo";
import Navigation from "shared/Navigation/Navigation";
import SearchDropdown from "./SearchDropdown";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import MenuBar from "shared/MenuBar/MenuBar";
import SwitchDarkMode from "shared/SwitchDarkMode/SwitchDarkMode";
import HeroSearchForm2MobileFactory from "components/HeroSearchForm2Mobile/HeroSearchForm2MobileFactory";
import AvatarDropdown from "./AvatarDropdown";
import { AppDispatch } from "redux/store";
import { useDispatch } from "react-redux";
import { getUserInfo, setUser } from "redux/slices/authSlice";

export interface MainNavProps {
  className?: string;
}

const MainNav: FC<MainNavProps> = ({ className = "" }) => {
  const dispatch = useDispatch<AppDispatch>();

  const user = localStorage.getItem("user-UTEtravel") || "";

  useEffect(() => {
    if (user) {
      dispatch(getUserInfo());
    }
  }, [user]);

  return (
    <div className={`nc-MainNav1 relative z-10 ${className}`}>
      <div className="px-4 lg:container py-4 lg:py-3 relative flex justify-between items-center">
        <div className="hidden md:flex justify-start flex-1 items-center space-x-4 sm:space-x-10">
          <Logo />
          <Navigation />
        </div>

        <div className="lg:hidden flex-[3] max-w-lg !mx-auto md:px-3">
          <HeroSearchForm2MobileFactory />
        </div>

        <div className="hidden md:flex flex-shrink-0 items-center justify-end flex-1 lg:flex-none text-neutral-700 dark:text-neutral-100">
          <div className="hidden xl:flex items-center space-x-0.5">
            <SwitchDarkMode />
            <SearchDropdown />
            <div className="px-1" />
            {user ? (
              <AvatarDropdown />
            ) : (
              <ButtonPrimary href="/login">Đăng nhập</ButtonPrimary>
            )}
          </div>
          <div className="flex xl:hidden items-center">
            <SwitchDarkMode />
            <div className="px-0.5" />
            <MenuBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav;
