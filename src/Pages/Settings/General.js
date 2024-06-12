import React from "react";
import { CreateToast } from "../../App";
import {
  GETCOLLECTION,
  SETDOC,
  UPDATEEMAIL,
  UPLOADPHOTO,
  encrypt,
} from "../../server";
import Input from "../../components/Input/Input";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import Upload from "../../assests/upload.png";
import { v4 as uuidv4 } from "uuid";
import Photo from "../../components/Photo/Photo";
import SkillDropdown from "../../components/SkillDropdown/SkillDropdown";
const General = ({ setActiveUser, ActiveUser, OldEmail, setOldEmail }) => {
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
  const changeSkills = (value) => {
    setActiveUser((prev) => {
      return { ...prev, SkillSet: value };
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
    } else if (name === "Photo") {
      const Photo = e.target.files[0];
      if (Photo) {
        const PhotoID = uuidv4();
        const url = await UPLOADPHOTO(
          `Users/${ActiveUser.id}/${PhotoID}`,
          Photo
        );
        CreateToast("Photo uploaded", "success");
        setActiveUser((prev) => {
          return {
            ...prev,
            Photos: [...prev.Photos, { Src: url, ID: PhotoID }],
          };
        });
      }
    } else {
      setActiveUser((prev) => {
        return { ...prev, [name]: value };
      });
    }
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
    setActiveUser(userToSend);
    setOldEmail(JSON.parse(sessionStorage.getItem("activeUser")).email);
  };
  console.log(ActiveUser);
  return (
    <div className="General">
      <form>
        <div className="FormItem">
          <h1>Personal Information</h1>

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
          <div>
            <label htmlFor="birthDate">Date of Birth:</label>
            <input
              type="date"
              id="birthDate"
              name="dateOfBirth"
              value={ActiveUser.dateOfBirth}
              onChange={handleInput}
            />
          </div>
        </div>
        <div className="FormItem">
          <h1>Contact Info:</h1>
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
            startWithContent={ActiveUser.email}
            label="Email"
            type="email"
            id="email"
            name="email"
            value={ActiveUser.email}
            onChangeFunction={handleInput}
          />
        </div>
        <div className="FormItem">
          <h1>Professional Information</h1>
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
            startWithContent={ActiveUser.Education}
            label="Education"
            type="text"
            id="Education"
            name="Education"
            value={ActiveUser.Education}
            onChangeFunction={handleInput}
          />
          <div>
            <h1>Skill Selection Dropdown</h1>
            <SkillDropdown
              PrevSkills={ActiveUser.SkillSet}
              SetSkills={changeSkills}
            />
          </div>
        </div>
        <div className="FormItem">
          <h1>Profile Information:</h1>
          <div>
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
        <div className="FormItem">
          <h1>Additional Information:</h1>
          <Input
            label="About yourself:"
            type="textarea"
            textarea={true}
            id="About"
            name="About"
            value={ActiveUser.about}
            onChangeFunction={handleInput}
          />
        </div>

        <div id="Uploads">
          <div className="Photos">
            <div className="FormItem" id="coverPhoto">
              <h1>Cover Photo:</h1>
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
              <img className="Cover" src={ActiveUser.Cover} />
            </div>
            <div className="FormItem" id="profilePhoto">
              <h1>Profile Photo:</h1>
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
              <img className="Picture" src={ActiveUser.Profile} />
            </div>
          </div>
          <div className="FormItem" id="cv">
            <h1>Resume:</h1>

            <label htmlFor="CV">
              <img src={Upload} style={{ width: "25px", cursor: "pointer" }} />
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
            {ActiveUser.CV && (
              <a href={ActiveUser.CV} target="_blank" rel="noreferrer">
                Current CV
              </a>
            )}
          </div>
        </div>
        <div className="FormItem" id="Certificates">
          <h1>Certificates:</h1>
          <span>Upload Photo:</span>
          <label htmlFor="Photo">
            <img src={Upload} style={{ width: "25px", cursor: "pointer" }} />
          </label>
          <input
            type="file"
            accept="image/*"
            hidden
            required
            id="Photo"
            name="Photo"
            onChange={handleInput}
          />
          <div style={{ display: "flex" }}>
            {ActiveUser.Photos.map((photo) => {
              return (
                <Photo
                  AllowEdit={true}
                  Photo={photo}
                  key={photo.ID}
                  ActiveUser={ActiveUser}
                  setActiveUser={setActiveUser}
                  updateUser={UpdateUser}
                />
              );
            })}
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
  );
};

export default General;
