"use client";
import React, { useEffect, useState } from "react";
import "./Home.css";

import { GETPOSTS, QUERY } from "../../server";

import Post from "../../components/Post/Post";
import Loading from "../../components/Loading/Loading";
import CreatePost from "../../components/Create Post/CreatePost";
import Sidebar from "../../components/Sidebar/Sidebar";
const Home = ({ User }) => {
  const [posts, setPosts] = useState([]);
  const [oldPosts, setOldPosts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeProfile, setActiveProfile] = useState();
  useEffect(() => {
    loadInitialData();
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        loading
      )
        return;
      loadMorePosts();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const loadInitialData = async () => {
    setLoading(true);
    const { data: postData, lastDoc: newLastDoc } = await GETPOSTS("Posts");
    setPosts(postData);
    setLastDoc(newLastDoc);
    setLoading(false);
  };
  const loadMorePosts = async () => {
    setOldPosts(posts);

    if (loading || !hasMore) return;
    setLoading(true);

    const { data: morePosts, lastDoc: newLastDoc } = await GETPOSTS(
      "Posts",
      3,
      lastDoc
    );
    setPosts((prevPosts) => [...prevPosts, ...morePosts]);
    setLastDoc(newLastDoc);
    setHasMore(morePosts.length > 0);
    setLoading(false);
  };
  const RenderPosts = posts?.map((post) => {
    return (
      <Post
        post={post}
        key={post.id}
        User={User}
        setActiveProfile={setActiveProfile}
      />
    );
  });
  const RenderOldPosts = oldPosts?.map((post) => {
    const postCreator = QUERY("users");
    return (
      <Post
        post={post}
        postCreator={postCreator}
        key={post.id}
        User={User}
        setActiveProfile={setActiveProfile}
      />
    );
  });
  return (
    <div className="Home">
      {activeProfile && (
        <Sidebar
          Profile={activeProfile}
          User={User}
          setActiveProfile={setActiveProfile}
        />
      )}
      <div className="Main">
        <CreatePost User={User} />
        <div className="Timeline">{loading ? RenderOldPosts : RenderPosts}</div>
        <Loading loading={loading} />
      </div>
    </div>
  );
};

export default Home;
