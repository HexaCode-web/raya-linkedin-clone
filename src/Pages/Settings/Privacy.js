import React from "react";
import { DELETECURRENTUSER, DELETEDOC, RESETPASSWORD } from "../../server";
import { CreateToast } from "../../App";
import MyModal from "../../components/PopUps/Confirm/Confirm";

const Privacy = ({ ActiveUser }) => {
  const [showModal, setShowModal] = React.useState(false);

  const SendResetEmail = async () => {
    try {
      RESETPASSWORD(ActiveUser.email);
      CreateToast("email has been sent", "success");
    } catch (error) {
      CreateToast(error, "error");
    }
  };
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handlePrimaryAction = async (e) => {
    const deleteDocPromise = DELETEDOC("users", ActiveUser.id);
    const deleteCurrentUserPromise = DELETECURRENTUSER();

    await Promise.all([deleteDocPromise, deleteCurrentUserPromise]);

    setShowModal(false);
    sessionStorage.clear();
    window.location.href = "/";
  };
  return (
    <div className="Privacy">
      <div className="Button-Wrapper">
        <button className="btn btn-primary" onClick={SendResetEmail}>
          Change Password
        </button>
        <button
          className="btn btn-danger"
          onClick={handleShowModal}
          style={{ margin: "auto" }}
        >
          delete Account
        </button>
        <MyModal
          className="Confirm"
          show={showModal}
          handleClose={handleCloseModal}
          title="Delete Account"
          primaryButtonText="Delete my account"
          handlePrimaryAction={handlePrimaryAction}
        >
          <>
            <p style={{ textAlign: "center" }}>
              are you sure you want to delete your account? this action can not
              be undone
            </p>
          </>
        </MyModal>
      </div>
    </div>
  );
};

export default Privacy;
