import React, { useState } from "react";
import { HiSearch } from "react-icons/hi";

const NavDesktop = ({ User, SearchValue, setSearchValue }) => {
  const urlFormatted = window.location.href
    .split("/")
    .pop()
    .replace(/%20/g, " ");

  const [ActivePage, setActivePage] = React.useState(urlFormatted);
  const [showSearch, setShowSearch] = useState(false);
  return (
    <>
      <nav id="navbar" className="navbar">
        <ul>
          {User && (
            <div className="searchWrapper">
              <HiSearch
                className="searchIcon"
                onClick={() => setShowSearch((prev) => !prev)}
              />
              <input
                type="text"
                placeholder="Search for Anything..."
                value={SearchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                className={showSearch ? "ShowSearch" : ""}
              />
            </div>
          )}
          <li
            className={ActivePage === "" ? "ActiveLink" : ""}
            onClick={() => {
              setActivePage("");
            }}
          >
            <a href={"/"}>Home</a>
          </li>
          {User && (
            <li
              className={ActivePage === "Profile" ? "ActiveLink" : ""}
              onClick={() => {
                setActivePage("Profile");
              }}
            >
              <a href={`/Profile/${User.id}`}>Profile</a>
            </li>
          )}
          <li
            className={ActivePage === "Jobs" ? "ActiveLink" : ""}
            onClick={() => {
              setActivePage("Jobs");
            }}
          >
            <a href={"/Jobs"}>Jobs</a>
          </li>
          {User?.Role === "Company" ? (
            <li
              className={ActivePage === "JobsManager" ? "ActiveLink" : ""}
              onClick={() => {
                setActivePage("JobsManager");
              }}
            >
              <a href={"/JobsManager"}>Jobs Manager</a>
            </li>
          ) : (
            ""
          )}
          {User && (
            <>
              <li
                className={ActivePage === "Settings" ? "ActiveLink" : ""}
                onClick={() => {
                  setActivePage("Settings");
                }}
              >
                <a href={"/Settings"}>Settings</a>
              </li>
              <li
                onClick={() => {
                  sessionStorage.setItem("activeUser", null);
                  window.location.reload();
                }}
                style={{ cursor: "pointer" }}
              >
                <a>Logout</a>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
};

export default NavDesktop;
