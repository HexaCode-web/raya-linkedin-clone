import React, { useEffect, useState } from "react";
import "./JobManager.css";
import logout from "../../assests/logout.png";
import expand from "../../assests/Expand.png";
import Shrink from "../../assests/Shrink.png";
import { GETDOC, decrypt } from "../../server";
import { IoIosAdd } from "react-icons/io";
import NotFound from "../NotFound/NotFound";
import CreateJob from "./CreateJob/CreateJob";
import General from "./General";

const Dashboard = ({ User }) => {
  const [greeting, setGreeting] = useState("");
  const [activePage, setActivePage] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [ActiveUser, setActiveUser] = useState(User);
  const [width, setWidth] = useState(window.innerWidth);
  const [authorized, setAuthorized] = useState(null);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    const checkData = async () => {
      let fetchedData = {};
      GETDOC("users", decrypt(ActiveUser.id)).then((res) => {
        fetchedData = res;
        setActiveUser(fetchedData);
        setAuthorized(fetchedData.Role === "Company" ? true : false);
      });
    };
    checkData();
  }, []);
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    if (new Date().getHours() < 12) setGreeting("Good morning");
    else if (new Date().getHours() < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);
  const logOut = async () => {
    sessionStorage.clear();
    window.location.href = "/";
  };
  return (
    <div className="Dashboard">
      {width < 800 ? (
        <h1 className="Reject">
          Sorry you must be on a larger screen to view this page
        </h1>
      ) : authorized ? (
        <>
          <div className={`${expanded ? "Expanded" : ""} SideBar`}>
            <h3 className="Greet">
              {expanded && (
                <p
                  className="animate__animated animate__fadeInDown"
                  style={{
                    position: "absolute",
                    top: "-15px",
                    right: "27%",
                  }}
                >
                  {greeting}
                </p>
              )}
              <span
                className=" animate__animated animate__fadeInUp"
                style={{ animationDelay: ".3s" }}
              >
                {ActiveUser.Fname} {ActiveUser.Lname}
              </span>
            </h3>
            <ul className="BTNList">
              <li
                onClick={() => {
                  setActivePage("Create");
                }}
                style={{ animationDelay: ".6s" }}
                className="animate__animated animate__fadeInLeft"
              >
                {expanded ? (
                  <span
                    className={`${activePage === "Create" ? "focus" : ""} Link`}
                  >
                    -Create Job Offer
                  </span>
                ) : (
                  <IoIosAdd />
                )}
              </li>
              <li
                onClick={logOut}
                style={{ animationDelay: "1s", marginTop: "auto" }}
                className={`animate__animated animate__fadeInLeft`}
              >
                {expanded ? (
                  <span className="Link">-Logout</span>
                ) : (
                  <img src={logout} className="Icon" />
                )}
              </li>
            </ul>

            <img
              onClick={() => {
                setExpanded((prev) => !prev);
              }}
              className={`animate__animated animate__fadeInLeft`}
              style={{
                margin: "auto",
                width: "25px",
                cursor: "pointer",
                animationDelay: "1.1s",
              }}
              src={expanded ? Shrink : expand}
            />
          </div>
          <div className="Page">
            {activePage === "" && <General User={User} />}
            {activePage === "Create" && <CreateJob User={User} />}
          </div>
        </>
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default Dashboard;
