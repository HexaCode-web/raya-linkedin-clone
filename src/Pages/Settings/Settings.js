import React, { useEffect, useState } from "react";
import MyModal from "../../components/PopUps/Confirm/Confirm";
import "react-toastify/dist/ReactToastify.css";
import { CreateToast } from "../../App";
import _ from "lodash";
import Upload from "../../assests/upload.png";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

import {
  UPLOADPHOTO,
  DELETEDOC,
  GETDOC,
  UPDATEEMAIL,
  SETDOC,
  LOGIN,
  RESETPASSWORD,
  DELETECURRENTUSER,
  GETCOLLECTION,
  decrypt,
  encrypt,
} from "../../server";
import "./Settings.css";
import Input from "../../components/Input/Input";
export default function Settings() {
  const [activePage, setActivePage] = React.useState("Login");
  const [showModal, setShowModal] = React.useState(false);
  const [OldEmail, setOldEmail] = useState("");
  const [loginData, setLoginData] = React.useState({
    email: "",
    Password: "",
  });

  const [ActiveUser, setActiveUser] = React.useState("");
  const selectCountry = (val) => {
    setActiveUser((prev) => {
      return { ...prev, country: val };
    });
  };

  const selectRegion = (val) => {
    setActiveUser((prev) => {
      return { ...prev, region: val };
    });
  };
  const handleInput = async (e) => {
    const { name, value } = e.target;
    if (name === "Profile") {
      CreateToast("uploading Photo", "info");
      const Photo = e.target.files[0];
      const url = await UPLOADPHOTO(`Users/${ActiveUser.id}/Profile`, Photo);
      CreateToast("Photo uploaded", "success");
      setActiveUser((prev) => {
        return { ...prev, [name]: url };
      });
    } else if (name === "Cover") {
      CreateToast("uploading Cover", "info");
      const Photo = e.target.files[0];
      const url = await UPLOADPHOTO(`Users/${ActiveUser.id}/Cover`, Photo);
      CreateToast("Cover uploaded", "success");
      setActiveUser((prev) => {
        return { ...prev, [name]: url };
      });
    } else if (name === "CV") {
      CreateToast("uploading CV", "info");
      const CV = e.target.files[0];
      const url = await UPLOADPHOTO(`Users/${ActiveUser.id}/CV`, CV);
      CreateToast("Cover CV", "success");
      setActiveUser((prev) => {
        return { ...prev, [name]: url };
      });
    } else {
      setActiveUser((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  const SaveData = async (e) => {
    let userToSend = ActiveUser;

    e.preventDefault();
    const Users = await GETCOLLECTION("users");

    const CheckEmail = Users.find((user) => {
      return user.email === ActiveUser.email;
    });
    if (CheckEmail) {
      userToSend = { ...userToSend, email: OldEmail };
      if (ActiveUser.email !== OldEmail) {
        CreateToast(" email is taken Or Unchanged", "error");
      }
    } else {
      try {
        await UPDATEEMAIL(ActiveUser.email);
        CreateToast("Data updated", "success");
      } catch (error) {
        CreateToast(error.message, "error");
      }
    }
    UpdateUser(userToSend, true);
    setOldEmail(JSON.parse(sessionStorage.getItem("activeUser")).email);
  };
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handlePrimaryAction = async (e) => {
    const deleteDocPromise = DELETEDOC("users", ActiveUser.id);
    const deleteCurrentUserPromise = DELETECURRENTUSER();

    await Promise.all([deleteDocPromise, deleteCurrentUserPromise]);

    setShowModal(false);
    sessionStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    const FetchUser = async () => {
      await GETDOC(
        "users",
        decrypt(JSON.parse(sessionStorage.getItem("activeUser")).id)
      ).then((res) => {
        setActiveUser(res), setOldEmail(res.email);
      });
    };
    FetchUser();
  }, []);
  const SendResetEmail = async () => {
    try {
      RESETPASSWORD(ActiveUser.email);
      CreateToast("email has been sent", "success");
    } catch (error) {
      CreateToast(error, "error");
    }
  };
  const signIn = async (e) => {
    CreateToast("logging in", "info");
    e.preventDefault();
    if (loginData.email === ActiveUser.email) {
      try {
        const authUser = await LOGIN(loginData.email, loginData.Password);
        const DBuser = await GETDOC("users", authUser.uid);
        await SETDOC("users", authUser.uid, { ...DBuser, Active: true });
        sessionStorage.setItem(
          "activeUser",
          JSON.stringify({ ...DBuser, id: encrypt(DBuser.id) })
        );
        setActivePage("General");
      } catch (error) {
        if (error.message.includes("auth/user-not-found")) {
          CreateToast("no such user", "error");
        } else if (error.message.includes("invalid-email")) {
          CreateToast("invalid Email", "error");
        } else if (error.message.includes("missing-password")) {
          CreateToast("Password cant be empty", "error");
        } else if (error.message.includes("auth/wrong-password")) {
          CreateToast(
            "Wrong Password if you forgot it, try resetting it",
            "error"
          );
        } else {
          CreateToast(error.message, "error");
        }
      }
    } else {
      CreateToast("email doesn't match the signed in one", "error");
    }
  };
  const UpdateInput = (event) => {
    const { name, value } = event.target;
    setLoginData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const UpdateUser = async (targetUser, popups) => {
    try {
      await SETDOC("users", targetUser.id, { ...targetUser });
      sessionStorage.setItem(
        "activeUser",
        JSON.stringify({ ...targetUser, id: encrypt(targetUser.id) })
      );
      popups
        ? CreateToast("your changes have been saved", "success", 3000)
        : "";
    } catch (error) {
      popups ? CreateToast(error, "error", 3000) : "";
    }
  };
  return (
    <>
      {activePage === "Login" ? (
        <div className="Portal">
          <h3> please login once more </h3>
          <form>
            <Input
              label="Email"
              type="email"
              required={true}
              id="email"
              name="email"
              value={loginData.email}
              onChangeFunction={UpdateInput}
            />
            <Input
              label="Password"
              type="password"
              required={true}
              id="Password"
              name="Password"
              value={loginData.Password}
              onChangeFunction={UpdateInput}
            />

            <input
              type="submit"
              value="login"
              className="Button"
              onClick={signIn}
            ></input>
          </form>
        </div>
      ) : (
        <div className="Settings">
          <div className="SideBar">
            <ul className="BTNList">
              <li>
                <p
                  onClick={() => setActivePage("General")}
                  className={activePage === "General" ? "focus Link" : " Link"}
                >
                  General Info
                </p>
              </li>
              <li>
                <p
                  onClick={() => setActivePage("Privacy")}
                  className={activePage === "Privacy" ? "focus Link" : " Link"}
                >
                  Privacy
                </p>
              </li>
            </ul>
          </div>
          <div className="Main">
            {activePage === "General" ? (
              <div className="General">
                <h1>General info</h1>
                <form>
                  <Input
                    label="First Name"
                    type="text"
                    id="Fname"
                    name="Fname"
                    value={ActiveUser.Fname}
                    startWithContent={ActiveUser.Fname}
                    onChangeFunction={handleInput}
                  />

                  <Input
                    label="Last Name"
                    type="text"
                    id="Lname"
                    name="Lname"
                    value={ActiveUser.Lname}
                    startWithContent={ActiveUser.Lname}
                    onChangeFunction={handleInput}
                  />
                  <Input
                    label="About yourself:"
                    type="textarea"
                    textarea={true}
                    id="About"
                    name="About"
                    value={ActiveUser.about}
                    onChangeFunction={handleInput}
                  />

                  <Input
                    startWithContent={ActiveUser.phone}
                    label="Phone Number"
                    type="tel"
                    id="phone"
                    name="phone"
                    value={ActiveUser.phone}
                    onChangeFunction={handleInput}
                  />
                  <Input
                    startWithContent={ActiveUser.title}
                    label="Title"
                    type="text"
                    id="title"
                    name="title"
                    value={ActiveUser.title}
                    onChangeFunction={handleInput}
                  />
                  <Input
                    startWithContent={ActiveUser.email}
                    label="Email"
                    type="email"
                    id="email"
                    name="email"
                    value={ActiveUser.email}
                    onChangeFunction={handleInput}
                  />

                  <div id="Gender">
                    <label htmlFor="gender">Gender:</label>
                    <select
                      id="gender"
                      name="gender"
                      defaultValue={ActiveUser.gender}
                      onChange={handleInput}
                    >
                      <option value="" disabled>
                        Select your gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div id="DOB">
                    <label htmlFor="birthdate">Date of Birth:</label>
                    <input
                      type="date"
                      id="birthdate"
                      name="dateOfBirth"
                      value={ActiveUser.dateOfBirth}
                      onChange={handleInput}
                    />
                  </div>
                  <div id="Area">
                    <div>
                      Country:
                      <CountryDropdown
                        value={ActiveUser.country}
                        onChange={selectCountry}
                      />
                    </div>
                    <div>
                      Region:
                      <RegionDropdown
                        country={ActiveUser.country}
                        value={ActiveUser.region}
                        onChange={selectRegion}
                      />
                    </div>
                  </div>
                  <div id="Uploads">
                    <div className="FormItem" id="coverPhoto">
                      <span>Cover Photo:</span>
                      <label htmlFor="Cover">
                        <img
                          src={Upload}
                          style={{ width: "25px", cursor: "pointer" }}
                        />
                      </label>
                      <input
                        type="file"
                        hidden
                        required
                        id="Cover"
                        name="Cover"
                        onChange={handleInput}
                      />
                    </div>
                    <div className="FormItem" id="profilePhoto">
                      <span>Profile Photo:</span>
                      <label htmlFor="Profile">
                        <img
                          src={Upload}
                          style={{ width: "25px", cursor: "pointer" }}
                        />
                      </label>
                      <input
                        type="file"
                        hidden
                        required
                        id="Profile"
                        name="Profile"
                        onChange={handleInput}
                      />
                    </div>

                    <div className="FormItem" id="cv">
                      <span>CV:</span>
                      <label htmlFor="CV">
                        <img
                          src={Upload}
                          style={{ width: "25px", cursor: "pointer" }}
                        />
                      </label>
                      <input
                        type="file"
                        hidden
                        required
                        accept=".pdf,.doc,.docx"
                        id="CV"
                        name="CV"
                        onChange={handleInput}
                      />
                    </div>
                  </div>

                  <input
                    id="Save"
                    type="submit"
                    onClick={(e) => {
                      SaveData(e);
                    }}
                    className="Button"
                    value="Save"
                    style={{ margin: "auto", width: "50%" }}
                  />
                </form>
              </div>
            ) : (
              ""
            )}
            {activePage === "Privacy" ? (
              <div className="Privacy">
                <div className="Button-Wrapper">
                  <button className="btn btn-primary" onClick={SendResetEmail}>
                    Change Password
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleShowModal}
                    style={{ margin: "auto" }}
                  >
                    delete Account
                  </button>
                  <MyModal
                    className="Confirm"
                    show={showModal}
                    handleClose={handleCloseModal}
                    title="Delete Account"
                    primaryButtonText="Delete my account"
                    handlePrimaryAction={handlePrimaryAction}
                  >
                    <>
                      <p style={{ textAlign: "center" }}>
                        are you sure you want to delete your account? this
                        action can not be undone
                      </p>
                    </>
                  </MyModal>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </>
  );
}
