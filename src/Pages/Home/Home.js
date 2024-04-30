"use client";
import React, { useEffect, useState } from "react";
import "./Home.css";
import { v4 as uuidv4 } from "uuid";
import { CreateToast } from "../../App";
import { GETCOLLECTION, SETDOC } from "../../server";

import Post from "../../components/Post/Post";
const Home = ({ User }) => {
  const [newPost, setNewPost] = useState({
    ID: "",
    Creator: "",
    Body: "",
    Date: getCurrentDateFormatted(),
    Likes: [],
    Comments: [],
  });
  const [posts, SetPosts] = useState([]);
  const [users, SetUsers] = useState([]);
  function getCurrentDateFormatted() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = String(currentDate.getFullYear()).slice(-2);
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  const updateInput = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => {
      return {
        ...prev,
        [name]: value,
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
      Likes: 0,
      Comments: [],
    });
    const Post = { ...newPost, ID: uuidv4(), Creator: User.id };
    await SETDOC("Posts", Post.ID, Post, true);
    await FetchPosts();
    CreateToast("Post Uploaded", "success");
  };
  const FetchPosts = async () => {
    const Posts = await GETCOLLECTION("Posts");
    const parseDate = (dateString) => {
      const [day, month, yearTime] = dateString.split("/");
      const [year, time] = yearTime.split(" ");
      const [hour, minute] = time.split(":");
      const isoDateString = `20${year}-${month}-${day}T${hour}:${minute}:00`;
      return new Date(isoDateString);
    };

    // Sorting the array based on the parsed dates
    const sortedArray = Posts.sort((a, b) => {
      const dateA = parseDate(a.Date);
      const dateB = parseDate(b.Date);
      return dateB - dateA;
    });

    const Users = await GETCOLLECTION("users");
    SetPosts(sortedArray);
    SetUsers(Users);
  };
  useEffect(() => {
    FetchPosts();
  }, []);
  const RenderPosts = posts.map((post) => {
    const postCreator = users.find((user) => user.id === post.Creator);
    return (
      <Post
        post={post}
        postCreator={postCreator}
        key={post.id}
        User={User}
        users={users}
      />
    );
  });
  return (
    <div className="Home">
      <div className="SideBar">
        <div className="Photos">
          <img className="Banner" src={User.Cover}></img>

          <img src={User.Profile} className="profilePhoto"></img>
        </div>
        <p className="name">
          {User.Fname} {User.Lname}
        </p>
      </div>
      <div className="Main">
        <div className="Post-wrapper">
          <div>
            <img src={User.Profile} className="profilePhoto"></img>
          </div>
          <input
            name="Body"
            type="text"
            className="PostInput"
            value={newPost.Body}
            onChange={updateInput}
          />
          <button className="Button" onClick={uploadPost}>
            Upload
          </button>
        </div>
        <div className="Timeline">{RenderPosts}</div>
      </div>
    </div>
  );
};

export default Home;
