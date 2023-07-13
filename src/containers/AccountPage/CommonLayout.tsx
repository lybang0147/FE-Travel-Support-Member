import React from "react";
import { FC } from "react";
import { NavLink, useLocation } from "react-router-dom";

export interface CommonLayoutProps {
  children?: React.ReactNode;
}

interface CustomNavLinkProps {
  to: string;
  children: React.ReactNode;
}

const CustomNavLink: FC<CustomNavLinkProps> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      className={`block py-5 md:py-8 border-b-2 flex-shrink-0 ${
        isActive ? "border-primary-500" : "border-transparent"
      }`}
    >
      {children}
    </NavLink>
  );
};

const CommonLayout: FC<CommonLayoutProps> = ({ children }) => {
  return (
    <div className="nc-CommonLayoutProps bg-neutral-50 dark:bg-neutral-900">
      <div className="border-b border-neutral-200 dark:border-neutral-700 pt-12 bg-white dark:bg-neutral-800">
        <div className="container">
          <div className="flex space-x-8 md:space-x-14 overflow-x-auto hiddenScrollbar">
            <CustomNavLink to="/account">Cá nhân</CustomNavLink>
            <CustomNavLink to="/account-savelists">Danh sách yêu thích</CustomNavLink>
            <CustomNavLink to="/account-password">Thay đổi mật khẩu</CustomNavLink>
          </div>
        </div>
      </div>
      <div className="container pt-14 sm:pt-20 pb-24 lg:pb-32">{children}</div>
    </div>
  );
};

export default CommonLayout;
