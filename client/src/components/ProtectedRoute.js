import { message } from "antd";
import React, { useEffect, useState } from "react";
import { getUserInfo } from "../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice.js";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.users);
  const [menu, setMenu] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const userMenu = [
    {
      title: "Play !",
      paths: ["/", "/user/write-exam"],
      onClick: () => navigate("/"),
      icon: <i className="ri-gamepad-line"></i>,
      className: "play-menu-item",
      style: {
        backgroundColor: "#10a810",
        border: "1px solid white",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "25px",
      },
      hoverStyle: {
        backgroundColor: "#10a810",
        color: "white",
      },
    },
    {
      title: "Leaderboard",
      paths: ["/leaderboard"],
      icon: <i className="ri-medal-line"></i>,
      onClick: () => navigate("/leaderboard"),
    },
    {
      title: "My exams",
      paths: ["/user/exams", "/user/exams/add"],
      icon: <i className="ri-file-list-line"></i>,
      onClick: () => navigate("/user/exams"),
    },
    {
      title: "My reports",
      paths: ["/user/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/user/reports"),
    },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: <i className="ri-logout-box-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    },
  ];

  const adminMenu = [
    {
      title: "Play !",
      paths: ["/", "/admin/write-exam"],
      onClick: () => navigate("/"),
      icon: <i className="ri-gamepad-line"></i>,
      className: "play-menu-item",
      style: {
        backgroundColor: "#10a810",
        border: "1px solid white",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      hoverStyle: {
        backgroundColor: "#10a810",
        color: "white",
      },
    },
    {
      title: "Leaderboard",
      paths: ["/leaderboard"],
      icon: <i className="ri-medal-line"></i>,
      onClick: () => navigate("/leaderboard"),
    },
    {
      title: "All exams",
      paths: ["/admin/exams", "/admin/exams/add"],
      icon: <i className="ri-file-list-line"></i>,
      onClick: () => navigate("/admin/exams"),
    },
    {
      title: "All reports",
      paths: ["/admin/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/admin/reports"),
    },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: <i className="ri-logout-box-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    },
  ];

  const getUserData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getUserInfo();
      dispatch(HideLoading());
      if (response.success) {
        dispatch(SetUser(response.data));
        if (response.data.isAdmin) {
          setMenu(adminMenu);
        } else {
          setMenu(userMenu);
        }
      } else {
        message.error(response.message);
      }
    } catch (error) {
      navigate("/login");
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserData();
    } else {
      navigate("/login");
    }
  }, []);

  const activeRoute = window.location.pathname;

  const getIsActiveOrNot = (paths) => {
    if (paths.includes(activeRoute)) {
      return true;
    } else {
      if (
        activeRoute.includes("/admin/exams/edit") &&
        paths.includes("/admin/exams")
      ) {
        return true;
      }
      if (
        activeRoute.includes("/user/write-exam") &&
        paths.includes("/user/write-exam")
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="layout">
      <div className="flex gap-2 w-full h-full h-100">
        {(!isSmallScreen || collapsed) && (
          <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
            <div className="menu">
              {menu.map((item, index) => (
                <div
                  className={`menu-item ${getIsActiveOrNot(item.paths) && "active-menu-item"}`}
                  key={index}
                  onClick={item.onClick}
                  style={item.style}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = item.hoverStyle.backgroundColor;
                    e.target.style.color = item.hoverStyle.color;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = item.style.backgroundColor;
                    e.target.style.color = item.style.color || "inherit";
                  }}
                >
                  {item.icon}
                  {!collapsed && <span>{item.title}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="body">
          <div className="header flex justify-between items-center">
            <i
              className={isSmallScreen ? "ri-menu-line" : "ri-close-line"}
              onClick={() => {
                if (isSmallScreen) {
                  setDropdownVisible(!dropdownVisible);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
            ></i>
            <h1
              className="text-2xl text-white cursor-pointer"
              onClick={() => navigate("/")}
            >
              Quizuzz!
            </h1>
            <div onClick={() => navigate("/profile")} className="cursor-pointer">
              <div className="flex gap-1 items-center">
                <h1 className="text-md text-white">{user?.name}</h1>
              </div>
              <span>Role : {user?.isAdmin ? "Admin" : "User"}</span>
            </div>
          </div>
          {isSmallScreen && dropdownVisible && (
            <div className="dropdown-menu">
              {menu.map((item, index) => (
                <div
                  className={`dropdown-item ${getIsActiveOrNot(item.paths) && "active-dropdown-item"}`}
                  key={index}
                  onClick={() => {
                    item.onClick();
                    setDropdownVisible(false);
                  }}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          )}
          <div className="content">{children}</div>
          <div className="footer">
            <p>
              Copyright 2024 © Quizuzz!{" "}
              <a
                href="https://discord.gg/KQUPYeSH"
                target="_blank"
                rel="noopener noreferrer"
                style={{ borderBottom: "1px solid black" }}
              >
                Contact us
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProtectedRoute;
