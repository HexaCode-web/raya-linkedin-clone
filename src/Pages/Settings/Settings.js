import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { CreateToast } from "../../App";
import _ from "lodash";

import { GETDOC, SETDOC, LOGIN, decrypt, encrypt } from "../../server";
import "./Settings.css";
import Input from "../../components/Input/Input";
import Privacy from "./Privacy";
import General from "./General";
export default function Settings() {
  const [activePage, setActivePage] = React.useState("Login");
  const [OldEmail, setOldEmail] = useState("");
  const [loginData, setLoginData] = React.useState({
    email: "",
    Password: "",
  });

  const [ActiveUser, setActiveUser] = React.useState("");

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
            {activePage === "General" && (
              <General
                ActiveUser={ActiveUser}
                OldEmail={OldEmail}
                setActiveUser={setActiveUser}
                setOldEmail={setOldEmail}
              />
            )}
            {activePage === "Privacy" && <Privacy ActiveUser={ActiveUser} />}
          </div>
        </div>
      )}
    </>
  );
}
