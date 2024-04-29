import React, { useEffect, useState } from "react";
import "./Profile.css";
import MyModal from "../../components/PopUps/Confirm/Confirm";
import { useParams } from "react-router-dom";
import { GETCOLLECTION } from "../../server";

const Profile = () => {
  const [Users, setUsers] = useState([]);

  const id = useParams().ID;
  let User = Users.find((user) => {
    return user.id == id;
  });

  const [showModal, setShowModal] = React.useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handlePrimaryAction = () => {};

  useEffect(() => {
    const FetchUsers = async () => {
      console.log("hello");
      const Users = await GETCOLLECTION("users");
      setUsers(Users);
    };
    FetchUsers();
  }, []);

  return (
    <div className="Profile">
      <div className="Photos">
        <img className="Banner" src={User?.Cover}></img>

        <img
          src={User?.Profile}
          style={{ position: User?.Cover ? "absolute" : "static" }}
          className="profilePhoto"
        ></img>
      </div>
      <div className="generalInfo">
        <h2 className="Header">General Info</h2>
        <p className="name">
          {User?.Fname} {User?.Lname}
        </p>
        <p className="title">{User?.title}</p>
        <p className="location">
          {User?.country} • {User?.region}
        </p>
        <button className="Button" onClick={handleShowModal}>
          Contact Info
        </button>
      </div>
      <div className="About">
        <h2 className="Header">About</h2>

        <p>{User?.About}</p>
      </div>
      <div className="CV">
        <h2 className="Header">CV</h2>
        <button
          className="Button"
          onClick={() => {
            window.open(
              User?.CV,
              "_blank" // <- This is what makes it open in a new window.
            );
          }}
        >
          Download CV
        </button>
      </div>
      <MyModal
        show={showModal}
        handleClose={handleCloseModal}
        title="Contact Info"
        // primaryButtonText="MODAL TEXT"
        handlePrimaryAction={handlePrimaryAction}
      >
        <>
          <p>Phone: {User?.phone}</p>
          <p>Email: {User?.email}</p>
        </>
      </MyModal>
      {/* <div className="certificates"></div> */}
    </div>
  );
};

export default Profile;
