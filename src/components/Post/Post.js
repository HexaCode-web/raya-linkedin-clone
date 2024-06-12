import React, { useEffect, useState } from "react";
import { FaRegCommentAlt } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { CreateToast } from "../../App";
import DOMPurify from "dompurify";

import "./Post.css";
import { QUERY, SETDOC } from "../../server";
import PostPopup from "../Post Popup/Post Popup";
import LetteredAvatar from "../LetteredAvatar/LetteredAvatar";
const Post = ({ post, User, setActiveProfile }) => {
  const [postCreator, setPostCreator] = useState(null);
  const [Post, setPost] = useState(post);
  const [showPopup, setShowPopup] = useState(false);
  const [userLiked, setUserLiked] = useState(
    Post.Likes.find((like) => like === User.id)
  );
  const sanitizedData = () => ({
    __html: DOMPurify.sanitize(Post.Body),
  });

  useEffect(() => {
    const FetchCreator = async () => {
      const Matches = await QUERY("users", "id", "==", post.Creator);
      setPostCreator(Matches[0]);
    };
    FetchCreator();
  }, []);
  const LikePost = async () => {
    // eslint-disable-next-line no-debugger
    let newLikes;
    const alreadyLiked = Post.Likes.find((like) => like === User.id);
    if (alreadyLiked) {
      setUserLiked(false);

      newLikes = Post.Likes.filter((like) => like !== User.id);
      setPost((prev) => {
        return { ...prev, Likes: newLikes };
      });
    } else {
      setUserLiked(true);
      setPost((prev) => {
        return { ...prev, Likes: [...prev.Likes, User.id] };
      });
    }

    await SETDOC(
      "Posts",
      Post.ID,
      { ...Post, Likes: alreadyLiked ? newLikes : [...Post.Likes, User.id] },
      false
    );
  };
  const togglePopup = () => {
    setShowPopup((prev) => !prev);
  };
  const AddComment = async (comment) => {
    CreateToast("Adding Comment", "info");
    if (!User) {
      CreateToast("you aren't signed in", "error");
      return;
    }
    if (comment.replyText === "") {
      return;
    }
    const newPost = { ...Post, Comments: [comment, ...Post.Comments] };
    await SETDOC("Posts", Post.ID, { ...newPost }, false);
    setPost(newPost);
    CreateToast("Comment Added", "sucess");
  };
  return (
    <div className="Post">
      <div
        className="Data-wrapper"
        onClick={() => {
          if (setActiveProfile) {
            setActiveProfile(postCreator);
          } else {
            window.location.href = `/Profile/${postCreator?.id}`;
          }
        }}
      >
        <div>
          {postCreator?.Profile ? (
            <img src={postCreator?.Profile} className="profilePhoto"></img>
          ) : (
            <LetteredAvatar
              Name={postCreator?.Fname}
              customHeight="40px"
              customWidth="40px"
            />
          )}
        </div>
        <div className="Data">
          <p className="name">
            {postCreator ? postCreator.Fname : "deleted user"}{" "}
            {postCreator?.Lname}
          </p>
          <p className="title">{User?.title}</p>
          <div className="Date">
            <p>{Post.Date ? Post.Date : Post.TimeStamp}</p>
          </div>
        </div>
      </div>
      <div className="PostBody" dangerouslySetInnerHTML={sanitizedData()}></div>
      <div className="Buttons">
        <div className="Like" onClick={LikePost}>
          {userLiked ? <AiFillLike /> : <AiOutlineLike />} {Post.Likes.length}
        </div>
        <div className="Comment" onClick={togglePopup}>
          <FaRegCommentAlt />
          {Post.Comments.length}
        </div>
      </div>
      {showPopup && (
        <PostPopup
          post={Post}
          postCreator={postCreator}
          userLiked={userLiked}
          LikePost={LikePost}
          togglePopup={togglePopup}
          AddComment={AddComment}
        />
      )}
    </div>
  );
};

export default Post;
