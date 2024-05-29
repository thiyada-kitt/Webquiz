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
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        color: "while",
        padding: "10px 20px",
        borderRadius: "5px",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginbottom: "25",
      },
      hoverStyle: {
        backgroundColor: "#10a810",
        color: "white"
      }
    },
    // {
    //   title: "Timed mode",
    //   paths: ["user/timemode"],
    //   icon: <i className="ri-timer-line"></i>,
    //   onClick: () => navigate("/"),
    // },
    // {
    //   title: "Non-timed mode",
    //   paths: ["user/notimemode"],
    //   icon: <i className="ri-close-circle-line"></i>,
    //   onClick: () => navigate("/"),
    // },
    {
      title: "Leaderboard",
      paths: ["/leaderboard"],
      icon: <i className="ri-medal-line"></i>,
      onClick: () => navigate("/leaderboard"),
    },
    {
      title: "Exams",
      paths: ["/user/exams", "/user/exams/add"],
      icon: <i className="ri-file-list-line"></i>,
      onClick: () => navigate("/user/exams"),
    },
    {
      title: "Reports",
      paths: ["/user/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/user/reports"),
    },
    // {
    //   title: "Profile",
    //   paths: ["/profile"],
    //   icon: <i className="ri-file-list-line"></i>,
    //   onClick: () => navigate("/profile"),
    // },
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
        color: "while",
        padding: "10px 20px",
        borderRadius: "5px",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      hoverStyle: {
        backgroundColor: "#10a810",
        color: "white"
      }
    },
    {
      title: "Leaderboard",
      paths: ["/leaderboard"],
      icon: <i className="ri-medal-line"></i>,
      onClick: () => navigate("/leaderboard"),
    },
    {
      title: "Exams",
      paths: ["/admin/exams", "/admin/exams/add"],
      icon: <i className="ri-file-list-line"></i>,
      onClick: () => navigate("/admin/exams"),
    },
    {
      title: "Reports",
      paths: ["/admin/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/admin/reports"),
    },
    // {
    //   title: "Profile",
    //   paths: ["/profile"],
    //   icon: <i className="ri-file-list-line"></i>,
    //   onClick: () => navigate("/profile"),
    // },
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
 // eslint-disable-next-line
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
        <div className="sidebar">
          <div className="menu">
            {menu.map((item, index) => {
              return (
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
              );
            })}
          </div>
        </div>
        <div className="body">
          <div className="header flex justify-between">
            {!collapsed ? (
              <i className="ri-close-line" onClick={() => setCollapsed(true)}></i>
            ) : (
              <i className="ri-menu-line" onClick={() => setCollapsed(false)}></i>
            )}
            <h1 className="text-2xl text-white cursor-pointer" onClick={() => navigate("/")}>Quizuzz!</h1>
            <div onClick={() => navigate("/profile")} className="cursor-pointer">
              <div className="flex gap-1 items-center">
                <h1 className="text-md text-white">{user?.name}</h1>
              </div>
              <span>Role : {user?.isAdmin ? "Admin" : "User"}</span>
            </div>
          </div>
          <div className="content">{children}</div>
          <div className="footer">
            <p>Copyright 2024 © Quizuzz! <a href="https://discord.gg/KQUPYeSH" target="_blank" rel="noopener noreferrer" style={{ borderBottom: "1px solid black" }}>Contact us</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProtectedRoute;