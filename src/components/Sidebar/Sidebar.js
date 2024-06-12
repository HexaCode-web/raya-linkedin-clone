import React, { useEffect, useState } from "react";
import LetteredAvatar from "../LetteredAvatar/LetteredAvatar";
import "./Sidebar.css";
import { GETDOC, SETDOC } from "../../server";
const Sidebar = ({ Profile, User, setActiveProfile }) => {
  const [userFollowing, setUserFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const FollowAction = async () => {
    setLoading(true);
    const updateUserDocuments = async (userUpdates, profileUpdates) => {
      await Promise.all([
        SETDOC("users", User.id, userUpdates),
        SETDOC("users", Profile.id, profileUpdates),
      ]);
      setActiveProfile(profileUpdates);
    };

    if (userFollowing) {
      setUserFollowing(false);

      const updatedUserFollowing = User.Following.filter(
        (user) => user !== Profile.id
      );
      const updatedProfileFollowers = Profile.Followers.filter(
        (user) => user !== User.id
      );

      await updateUserDocuments(
        { ...User, Following: updatedUserFollowing },
        { ...Profile, Followers: updatedProfileFollowers }
      );
    } else {
      setUserFollowing(true);

      const updatedUserFollowing = [...User.Following, Profile.id];
      const updatedProfileFollowers = [...Profile.Followers, User.id];

      await updateUserDocuments(
        { ...User, Following: updatedUserFollowing },
        { ...Profile, Followers: updatedProfileFollowers }
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    const checkFollow = async () => {
      const fetchedUser = await GETDOC("users", User.id);
      const foundUser = fetchedUser.Following.find(
        (Following) => Following === Profile.id
      );
      setUserFollowing(foundUser ? true : false);
    };
    checkFollow();
  }, [Profile]);
  return (
    <div className="SideBar">
      <img className="SideBar-Banner" src={Profile.Cover}></img>
      <div className="SideBar-basicInfo">
        {Profile.Profile ? (
          <img src={Profile.Profile} className="SideBar-profilePhoto"></img>
        ) : (
          <LetteredAvatar
            Name={Profile.Fname}
            customHeight="40px"
            customWidth="40px"
          />
        )}

        <div className="SideBar-basicData">
          <span className="SideBar-name">
            {Profile.Fname} {Profile.Lname}
          </span>
          {Profile.title && <p className="title">{Profile.title}</p>}
        </div>
      </div>
      <div className="SideBar-MoreInfo">
        {Profile.country && (
          <span className="location">
            {Profile.country} {" • "}
            {Profile.region}
          </span>
        )}
        <div className="SideBar-Followers-ing">
          <span>{Profile.Followers.length} Followers</span>
          {" • "}
          <span>{Profile.Following.length} Following</span>
        </div>
        <div className="SideBar-Buttons">
          <button
            className="Button"
            onClick={() => {
              window.location.href = `Profile/${Profile.id}`;
            }}
          >
            Visit Profile
          </button>
          {User.id !== Profile.id && (
            <button
              className="Button"
              onClick={FollowAction}
              disabled={loading}
            >
              {userFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
