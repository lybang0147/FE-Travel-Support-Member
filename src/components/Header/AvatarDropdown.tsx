import { Popover, Transition } from "@headlessui/react";
import {
  UserCircleIcon,
  HeartIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import User from "models/user";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "redux/slices/authSlice";
import { AppDispatch, RootState } from "redux/store";
import Avatar from "shared/Avatar/Avatar";
import jwt_decode from 'jwt-decode';

interface JwtPayload {
  sub: string;
  roles: string[];
  exp: number; 
}



const solutionsFoot = [
  {
    name: "Đăng xuất",
    href: "##",
    icon: ArrowRightOnRectangleIcon,
  },
];

export default function AvatarDropdown() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector<RootState, User>((state) => state.userStore.user);
  const [avatar, setAvatar] = useState<any>();
  const [decodedToken, setDecodedToken] = useState<JwtPayload>();
  const [solutions, setSolutions] = useState<Array<any>>([
    {
      name: "Trang cá nhân",
      href: "/account",
      icon: UserCircleIcon,
    },
    {
      name: "Danh sách yêu thích",
      href: "/account-savelists",
      icon: HeartIcon,
    },
    {
      name: "Booking",
      href: `/booking`,
      icon: HomeIcon,
    },
  ])

  useEffect(() => {
    if (user) {
      setAvatar(user.imgLink);
      if (localStorage.getItem("token-UTEtravel")!=null)
      {
        setDecodedToken(jwt_decode<JwtPayload>(localStorage.getItem("token-UTEtravel")!))
      }
    }
  }, [user]);

  useEffect(() => {
    const hasOwner = solutions.some((solution) => solution.name === "Trang quản lý phòng");
    if (decodedToken && decodedToken.roles.includes("ROLE_OWNER") && !hasOwner) {
      setSolutions((prevSolutions) => {
        const updatedSolutions = prevSolutions.map((solution) => {
          if (solution.name === "Booking") {
            return {
              name: "Quản lý đặt phòng",
              href: "/ownerBooking",
              icon: HomeIcon
            };
          }
          return solution;
        });
        const newSolution = {
          name: "Trang quản lý phòng",
          href: "/owner",
          icon: UserIcon
        };
        return [...updatedSolutions, newSolution];
      });

    }
  }, [decodedToken]);

  const handleLogout = () => {
    dispatch(setUser({}));
    localStorage.removeItem("token-UTEtravel");
    localStorage.removeItem("refreshToken-UTEtravel");
    localStorage.removeItem("user-UTEtravel");
    navigate("/");
  };

  return (
    <div className="AvatarDropdown">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <Avatar
                sizeClass="w-8 h-8 sm:w-9 sm:h-9"
                imgUrl={avatar && avatar}
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-screen max-w-[260px] px-4 mt-4 -right-10 sm:right-0 sm:px-0">
                <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative grid gap-6 bg-white dark:bg-neutral-800 p-7">
                    {solutions.map((item, index) => (
                      <Link
                        key={index}
                        to={item.href}
                        className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      >
                        <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                          <item.icon aria-hidden="true" className="w-6 h-6" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium ">{item.name}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <hr className="h-[1px] border-t border-neutral-300 dark:border-neutral-700" />
                  <div className="relative grid gap-6 bg-white dark:bg-neutral-800 p-7">
                    {solutionsFoot.map((item, index) => (
                      <a
                        key={index}
                        href={item.href}
                        onClick={handleLogout}
                        className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      >
                        <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                          <item.icon aria-hidden="true" className="w-6 h-6" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium ">{item.name}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
