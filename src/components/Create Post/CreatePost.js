import React, { useState } from "react";
import { SETDOC } from "../../server";
import { v4 as uuidv4 } from "uuid";
import { CreateToast } from "../../App";
import LetteredAvatar from "../LetteredAvatar/LetteredAvatar";
import "./CreatePost.css";
import SimpleEditor from "./SimpleEditor";
const CreatePost = ({ User }) => {
  const [newPost, setNewPost] = useState({
    ID: "",
    Creator: "",
    Body: "",
    TimeStamp: getCurrentDateFormatted().isoDate,
    Date: getCurrentDateFormatted().ReadAbleDate,
    Likes: [],
    Comments: [],
  });
  const [showPostPopup, setShowPostPopup] = useState(false);
  function getCurrentDateFormatted() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");
    const ReadAbleDate = `${day}/${month}/${year} ${hours}:${minutes}`;
    const isoDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
    return { isoDate, ReadAbleDate };
  }
  const updateInput = (value) => {
    setNewPost((prev) => {
      return {
        ...prev,
        Body: value,
      };
    });
  };

  const uploadPost = async () => {
    if (newPost.Body === "") {
      return;
    }
    setNewPost({
      ID: "",
      Creator: "",
      Body: "",
      Date: getCurrentDateFormatted(),
      Likes: [],
      Comments: [],
    });
    const Post = { ...newPost, ID: uuidv4(), Creator: User.id };
    await SETDOC("Posts", Post.ID, Post, true);
    setShowPostPopup(false);
    CreateToast("Post Uploaded", "success");
  };
  return (
    <div className="Post-wrapper">
      <div>
        {User?.Profile ? (
          <img src={User?.Profile} className="profilePhoto"></img>
        ) : (
          <LetteredAvatar
            Name={User?.Fname}
            customHeight="40px"
            customWidth="40px"
          />
        )}
      </div>
      <div
        className="typeArea"
        onClick={() => {
          setShowPostPopup((prev) => !prev);
        }}
      >
        {!showPostPopup && <span>Whats on your mind?</span>}
      </div>

      <div className={`popup ${showPostPopup ? "open" : ""}`}>
        <div className="popup-content">
          <button
            className="close-btn"
            onClick={() => {
              setShowPostPopup((prev) => !prev);
            }}
          >
            &times;
          </button>
          <SimpleEditor
            handlePostBodyChange={updateInput}
            toolBarID={"ToolBar50"}
            oldValue={newPost.Body}
          />
          <button className="Button" onClick={uploadPost}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
