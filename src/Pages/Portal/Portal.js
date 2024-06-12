/* eslint-disable no-undef */
import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { CreateToast } from "../../App";
import {
  GETDOC,
  NEWUSER,
  SETDOC,
  LOGIN,
  DELETECURRENTUSER,
  DELETEDOC,
  RESETPASSWORD,
  GETCOLLECTION,
  encrypt,
  decrypt,
} from "../../server.js";
import "./Portal.css";
import MyModal from "../../components/PopUps/Confirm/Confirm.js";
import Loading from "../../components/Loading/Loading.js";
import Input from "../../components/Input/Input";
export default function Portal() {
  const [user, setUser] = React.useState(
    JSON.parse(sessionStorage.getItem("activeUser")) || ""
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [showSignup, setShowSignUp] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [newUser, setNewUser] = React.useState({
    Lname: "",
    Fname: "",
    Role: "User",
    dateOfBirth: "",
    email: "",
    deleteUser: false,
    gender: "",
    joinedAt: getCurrentDateFormatted(),
    Password: "",
    phone: "",
    cover: "",
    profilePhoto: "",
    Education: "",
    title: "",
    cv: "",
    SkillSet: [],
    photos: "",
    Followers: [],
    Following: [],
  });
  const [showModal, setShowModal] = React.useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handlePrimaryAction = async () => {
    handleCloseModal();
    try {
      RESETPASSWORD(email);
      CreateToast("email has been sent", "success");
    } catch (error) {
      CreateToast(error, "error");
    }
    setEmail("");
  };
  const [loginData, setLoginData] = React.useState({
    email: "",
    Password: "",
  });
  const changeForm = () => {
    setShowSignUp((prev) => !prev);
    setLoginData({
      email: "",
      Password: "",
    });
    setNewUser((prev) => {
      return { ...prev, email: "", Password: "" };
    });
  };

  const UpdateInput = (form, event) => {
    if (form === "login") {
      const { name, value } = event.target;
      setLoginData((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
    if (form === "newUser") {
      const { name, value } = event.target;
      setNewUser((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };
  function getCurrentDateFormatted() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = String(currentDate.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  const Signup = async (e) => {
    if (
      ![newUser.Fname, newUser.Lname, newUser.Password, newUser.email].every(
        Boolean
      )
    ) {
      CreateToast("Please fill out all the fields", "error");
      return;
    }
    CreateToast("creating account...", "info");
    e.preventDefault();
    const Users = await GETCOLLECTION("users");

    try {
      const CheckUsername = Users.find((user) => {
        return user.email === newUser.email;
      });

      if (CheckUsername) {
        CreateToast("username is taken.", "error");

        return;
      }
      await NEWUSER(newUser.email, newUser.Password);
      const authUser = await LOGIN(newUser.email, newUser.Password);
      await SETDOC(
        "users",
        authUser.uid,
        { ...newUser, id: authUser.uid, Password: "" },
        true
      );
      sessionStorage.setItem(
        "activeUser",
        JSON.stringify({ id: encrypt(authUser.uid) })
      );
      if (newUser.Role === "Owner" || newUser.Role === "Admin") {
        window.location.href = "/Dashboard";
      } else {
        window.location.reload();
      }

      CreateToast("Successfully signed up! logging in...", "success");
      setShowSignUp(false);
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
  };
  const signIn = async (e) => {
    e.preventDefault();
    CreateToast("logging in", "info");

    try {
      const authUser = await LOGIN(loginData.email, loginData.Password);
      const DBuser = await GETDOC("users", authUser.uid);
      if (DBuser.deleteUser) {
        await DELETEDOC("users", authUser.uid),
          await DELETECURRENTUSER(),
          CreateToast("sorry your account have been deleted", "info");
        return;
      } else {
        sessionStorage.setItem(
          "activeUser",
          JSON.stringify({ id: encrypt(DBuser.id) })
        );
        if (DBuser.Role === "Owner" || DBuser.Role === "Admin") {
          window.location.href = "/Dashboard";
        } else {
          window.location.reload();
        }
      }
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
  };

  useEffect(() => {
    const checkData = async () => {
      let fetchedData = {};
      GETDOC("users", decrypt(user.id)).then((res) => {
        fetchedData = res;
        setUser(fetchedData);
      });
    };
    if (user) {
      checkData();
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <div className="Portal ">
        <h3
          className="animate__animated animate__fadeInDown"
          style={{ animationDelay: ".5s" }}
        >
          {!showSignup ? "Welcome Back" : "Register"}
        </h3>
        {showSignup ? (
          <form className="animate__animated animate__fadeInDown SignupForm">
            <Input
              label="Email"
              type="email"
              required={true}
              id="email"
              name="email"
              value={newUser.email}
              onChangeFunction={() => {
                UpdateInput("newUser", event);
              }}
            />
            <div id="Role">
              <label htmlFor="Role">Role:</label>
              <select
                id="Role"
                name="Role"
                defaultValue={newUser.Role}
                onChange={() => {
                  UpdateInput("newUser", event);
                }}
              >
                <option value="" disabled>
                  Select your Role
                </option>
                <option value="User">User</option>
                <option value="Company">Company</option>
              </select>
            </div>
            <div className="NameWrapper">
              <Input
                label="FirstName"
                type="text"
                required={true}
                id="Fname"
                name="Fname"
                value={newUser.Fname}
                onChangeFunction={() => {
                  UpdateInput("newUser", event);
                }}
              />
              <Input
                label="LastName"
                type="text"
                required={true}
                id="Lname"
                name="Lname"
                value={newUser.Lname}
                onChangeFunction={() => {
                  UpdateInput("newUser", event);
                }}
              />
            </div>
            <Input
              label="Password"
              type="password"
              required={true}
              id="Password"
              name="Password"
              value={newUser.Password}
              onChangeFunction={() => {
                UpdateInput("newUser", event);
              }}
            />

            <input
              type="submit"
              className="Button"
              value="sign up"
              onClick={Signup}
            ></input>
          </form>
        ) : (
          <form className="animate__animated animate__fadeInDown">
            <Input
              label="Email"
              type="email"
              required={true}
              id="email"
              name="email"
              value={loginData.email}
              onChangeFunction={() => {
                UpdateInput("login", event);
              }}
            />
            <Input
              label="Password"
              type="password"
              required={true}
              id="Password"
              name="Password"
              value={loginData.Password}
              onChangeFunction={() => {
                UpdateInput("login", event);
              }}
            />

            <input
              type="submit"
              value="login"
              className="Button"
              onClick={signIn}
            ></input>
          </form>
        )}
        <p
          className="animate__animated animate__fadeInUp"
          style={{
            textAlign: "center",
            animationDelay: "1s",
            marginTop: "15px",
          }}
        >
          {!showSignup ? "not a user?" : "already have an account?"}{" "}
          <span style={{ cursor: "pointer" }} onClick={changeForm}>
            {!showSignup ? "sign up now" : "sign in now!"}
          </span>
        </p>
        <button
          style={{
            border: "none",
            animationDelay: "1.1s",
            opacity: ".7",
            backgroundColor: "white",
            fontSize: ".8rem",
          }}
          className="animate__animated animate__fadeInUp"
          onClick={handleShowModal}
        >
          Forgot Password?
        </button>
        <MyModal
          className="Confirm"
          show={showModal}
          handleClose={handleCloseModal}
          title="Reset password"
          primaryButtonText="send email"
          handlePrimaryAction={handlePrimaryAction}
        >
          <>
            <p>
              please put your email and if its a valid email we will send a
              reset password link to it
            </p>
            <Input
              required
              type="email"
              name="email"
              label="Email:"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </>
        </MyModal>
      </div>

      <Loading loading={isLoading} />
    </>
  );
}
