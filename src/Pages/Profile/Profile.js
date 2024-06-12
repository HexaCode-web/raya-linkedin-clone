import React, { useEffect, useState } from "react";
import "./Profile.css";
import MyModal from "../../components/PopUps/Confirm/Confirm";
import { useParams } from "react-router-dom";
import { GETDOC, GETPOSTS, QUERY, SETDOC, decrypt } from "../../server";
import Loading from "../../components/Loading/Loading";
import CreatePost from "../../components/Create Post/CreatePost";
import Post from "../../components/Post/Post";
import LetteredAvatar from "../../components/LetteredAvatar/LetteredAvatar";
import NotFound from "../NotFound/NotFound";
import Photo from "../../components/Photo/Photo";
const Profile = () => {
  const id = useParams().ID;
  const [User, setUser] = useState(null);
  const [ActiveUser, setActiveUser] = useState(
    JSON.parse(sessionStorage.getItem("activeUser")) || null
  );
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [oldPosts, setOldPosts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [ActiveUserFollowing, setActiveUserFollowing] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handlePrimaryAction = () => {};
  useEffect(() => {
    const FetchUsers = async () => {
      setLoading(true);
      const fetchedUser = await GETDOC(
        "users",
        decrypt(JSON.parse(sessionStorage.getItem("activeUser")).id)
      );
      const User = await QUERY("users", "id", "==", id);
      const foundUser = fetchedUser.Following.find(
        (Following) => Following === id
      );
      setActiveUserFollowing(foundUser ? true : false);

      setActiveUser(fetchedUser);
      setUser(User[0]);
      setLoading(false);
    };

    FetchUsers();
  }, []);

  useEffect(() => {
    loadInitialData();
  }, []);
  const FollowAction = async () => {
    setLoading(true);
    const updateUserDocuments = async (activeUserUpdates, userUpdates) => {
      await Promise.all([
        SETDOC("users", ActiveUser.id, activeUserUpdates),
        SETDOC("users", User.id, userUpdates),
      ]);
      setUser(userUpdates);
    };

    if (ActiveUserFollowing) {
      setActiveUserFollowing(false);

      const updatedActiveUserFollowings = ActiveUser.Following.filter(
        (user) => user !== User.id
      );
      const updatedUserFollowers = User.Followers.filter(
        (user) => user !== ActiveUser.id
      );
      await updateUserDocuments(
        { ...ActiveUser, Following: updatedActiveUserFollowings },
        { ...User, Followers: updatedUserFollowers }
      );
    } else {
      setActiveUserFollowing(true);

      const updatedActiveUserFollowings = [...ActiveUser.Following, User.id];
      const updatedUserFollowers = [...User.Followers, ActiveUser.id];

      await updateUserDocuments(
        { ...ActiveUser, Following: updatedActiveUserFollowings },
        { ...User, Followers: updatedUserFollowers }
      );
    }
    setLoading(false);
  };
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
    const foundPosts = postData.filter((data) => data.Creator === id);
    if (foundPosts.length > 0) {
      setPosts(foundPosts);
      setLastDoc(newLastDoc);
    } else {
      const { data: postData, lastDoc: newLastDoc } = await GETPOSTS(
        "Posts",
        100,
        lastDoc
      );
      const foundPosts = postData.filter((data) => data.Creator === id);

      setPosts(foundPosts);
      setLastDoc(newLastDoc);
    }
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

    setPosts((prevPosts) => [
      ...prevPosts,
      ...morePosts.filter((data) => data.Creator === id),
    ]);
    setLastDoc(newLastDoc);
    setHasMore(morePosts.length > 0);
    setLoading(false);
  };
  const RenderPosts = posts?.map((post) => {
    return <Post post={post} key={post.id} User={User} />;
  });
  const RenderOldPosts = oldPosts?.map((post) => {
    const postCreator = QUERY("users");
    return (
      <Post post={post} postCreator={postCreator} key={post.id} User={User} />
    );
  });

  return (
    <>
      {loading && <Loading loading={loading} />}
      {User && (
        <div className="Main">
          <div className="Photos">
            <img className="Banner" src={User.Cover} alt="Banner" />
            <div className="basicInfo">
              {User.Profile ? (
                <img
                  src={User.Profile}
                  className="profilePhoto"
                  alt="Profile"
                />
              ) : (
                <LetteredAvatar
                  Name={User.Fname}
                  customHeight="40px"
                  customWidth="40px"
                />
              )}
              <div className="basicData">
                <p className="name">
                  {User.Fname} {User.Lname}
                </p>
                {User.title && <p className="title">{User.title}</p>}
              </div>
              {User && (
                <>
                  <div className="Followers-ing">
                    <span>{User.Followers.length} Followers</span>
                    {" • "}
                    <span>{User.Following.length} Following</span>
                  </div>
                  {User.id !== ActiveUser.id && (
                    <button className="Button" onClick={FollowAction}>
                      {ActiveUserFollowing ? "Unfollow" : "Follow"}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="Profile">
            <div className="Left">
              <div className="generalInfo">
                <h2 className="Header">General Info</h2>
                <p className="name">
                  {User.Fname} {User.Lname}
                </p>
                <p className="title">{User.title}</p>
                {User.country && (
                  <p className="location">
                    {User.country} • {User.region}
                  </p>
                )}
                <button className="Button" onClick={handleShowModal}>
                  Contact Info
                </button>
              </div>
              <div className="About">
                <h2 className="Header">About</h2>
                <p>{User.About}</p>
              </div>
              <div className="About">
                <h2 className="Header">Education</h2>
                <span>{User.Education}</span>
              </div>
              <div className="About">
                <h2 className="Header">Skills</h2>
                <div className="selected-skills">
                  {User.SkillSet.map((skill) => {
                    return (
                      <div className="Skill" key={skill}>
                        <span>{skill}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="CV">
                <h2 className="Header">CV</h2>
                <button
                  className="Button"
                  onClick={() => {
                    window.open(User.CV, "_blank");
                  }}
                >
                  Download CV
                </button>
              </div>
              <div className="Photos">
                <h2 className="Header">Certificates</h2>
                <div className="Container">
                  {User.Photos.map((photo) => {
                    return (
                      <Photo
                        AllowEdit={false}
                        Photo={photo}
                        key={photo.ID}
                        ActiveUser={null}
                        setActiveUser={null}
                        updateUser={null}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="Right">
              {ActiveUser.id === User.id && <CreatePost User={User} />}
              <div className="Timeline">
                {loading ? RenderOldPosts : RenderPosts}
              </div>
              <Loading loading={loading} />
            </div>
          </div>
          <MyModal
            show={showModal}
            handleClose={handleCloseModal}
            title="Contact Info"
            handlePrimaryAction={handlePrimaryAction}
          >
            <>
              <p>Phone: {User.phone}</p>
              <p>Email: {User.email}</p>
            </>
          </MyModal>
        </div>
      )}
      {!User && !loading && <NotFound />}
    </>
  );
};

export default Profile;
