import React, { useEffect, useState } from "react";
import { QUERY } from "../../server";
import "./Post Popup.css";
import LetteredAvatar from "../LetteredAvatar/LetteredAvatar";

export const Comment = ({ comment }) => {
  const [commentCreator, setCommentCreator] = useState(null);
  useEffect(() => {
    const FetchCreator = async () => {
      const Matches = await QUERY("users", "id", "==", comment.PersonId);
      setCommentCreator(Matches[0]);
    };
    FetchCreator();
  }, []);
  return (
    <div className="Post">
      <div
        className="Data"
        onClick={() => {
          window.location.href = `/Profile/${commentCreator?.id}`;
        }}
      >
        <div>
          {commentCreator?.Profile ? (
            <img src={commentCreator?.Profile} className="profilePhoto"></img>
          ) : (
            <LetteredAvatar
              Name={commentCreator?.Fname}
              customHeight="40px"
              customWidth="40px"
            />
          )}
        </div>
        <p className="name">
          {commentCreator ? commentCreator.Fname : "deleted user"}
          {commentCreator?.Lname}
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
};
