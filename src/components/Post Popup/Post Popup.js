import React, { useState } from "react";
import "./Post Popup.css";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaRegCommentAlt } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { decrypt } from "../../server";

const PostPopup = ({
  post,
  postCreator,
  userLiked,
  LikePost,
  togglePopup,
  AddComment,
  users,
}) => {
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("activeUser")) || ""
  );
  const [comment, setComment] = useState({
    replyText: "",
    PersonId: user,
    Date: "",
  });
  const [showComments, setShowComments] = useState(false);
  function getCurrentDateFormatted() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = String(currentDate.getFullYear()).slice(-2);
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setComment((prev) => {
      return {
        ...prev,
        [name]: value,
        Date: getCurrentDateFormatted(),
      };
    });
    if (user) {
      setComment((prev) => {
        return {
          ...prev,
          PersonId: decrypt(user.id),
        };
      });
    }
  };
  const RenderComments = post?.Comments.map((comment, index) => {
    let NameToRender;
    const Person = users.find((User) => {
      return User.id == comment.PersonId;
    });

    return (
      <div className="Post" key={index}>
        <div
          className="Data"
          onClick={() => {
            window.location.href = `/Profile/${Person?.id}`;
          }}
        >
          <img src={Person?.Profile} className="profilePhoto"></img>
          <p className="name">
            {Person ? Person.Fname : "deleted user"}
            {Person?.Lname}
          </p>
        </div>
        <div className="Date">
          <p>{comment.Date}</p>
        </div>
        <div className="PostBody">
          <p>{comment.replyText}</p>
        </div>
      </div>
    );
  });
  return (
    <div className="PopupContainer">
      <div className="PopupContent">
        <GiCancel
          style={{
            position: "absolute",
            top: "10",
            right: "10",
            cursor: "pointer",
          }}
          onClick={togglePopup}
        />
        <div
          className="Data"
          onClick={() => {
            window.location.href = `/Profile/${postCreator?.id}`;
          }}
        >
          <img
            src={postCreator?.Profile}
            className="profilePhoto"
            alt="Profile"
          />
          <p className="name">
            {postCreator
              ? `${postCreator.Fname} ${postCreator.Lname}`
              : "Deleted User"}
          </p>
        </div>
        <div className="Date">
          <p>{post.Date}</p>
        </div>
        <div className="PostBody">
          <p>{post.Body}</p>
        </div>
        <div className="Buttons">
          <div className="Like" onClick={LikePost}>
            {userLiked ? <AiFillLike /> : <AiOutlineLike />}
            {post.Likes.length}
          </div>
          <div
            className="Comment"
            onClick={() => {
              setShowComments((prev) => !prev);
            }}
          >
            <FaRegCommentAlt /> {post.Comments.length}
          </div>
        </div>
        {showComments && (
          <div className="Comments">
            <div className="AddComment">
              <input
                id="CommentArea"
                value={comment.replyText}
                onChange={(e) => {
                  handleChange(e);
                }}
                name="replyText"
              ></input>

              <button
                className="Button"
                onClick={() => {
                  setComment((prev) => {
                    return { ...prev, replyText: "" };
                  });
                  AddComment(comment);
                }}
              >
                Comment
              </button>
            </div>
            <div className="Comments-wrapper"> {RenderComments}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostPopup;
