import React, { useState } from "react";
import "../../Pages/Settings/Settings.css";
import { DELETEPHOTO } from "../../server";
import { CreateToast } from "../../App";
import PhotoOverlay from "./PhotoOverlay";
const Photo = ({
  AllowEdit,
  Photo,
  ActiveUser = null,
  setActiveUser = null,
  updateUser = null,
}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };
  const DeletePhoto = async () => {
    if (AllowEdit) {
      const UserToSend = {
        ...ActiveUser,
        Photos: ActiveUser.Photos.filter((photo) => photo.ID !== Photo.ID),
      };
      setActiveUser(UserToSend);
      await DELETEPHOTO(`Users/${ActiveUser.id}/${Photo.ID}`);
      await updateUser(UserToSend);
      CreateToast("Photo deleted successfully", "success");
    }
  };
  return (
    <div className="photoController">
      {AllowEdit && (
        <button className="Delete-btn" onClick={DeletePhoto}>
          &times;
        </button>
      )}
      <img
        src={Photo.Src}
        onClick={() => {
          setShowOverlay((prev) => !prev);
        }}
      />
      {showOverlay && (
        <PhotoOverlay photoURL={Photo.Src} onClose={handleCloseOverlay} />
      )}
    </div>
  );
};

export default Photo;
