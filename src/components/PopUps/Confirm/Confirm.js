import React from "react";
import { Button, Modal } from "react-bootstrap";
import "./Confirm.css";
function MyModal(props) {
  return (
    <Modal
      className={props.className}
      show={props.show}
      onHide={props.handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
        {props.primaryButtonText && (
          <Button variant="danger" onClick={props.handlePrimaryAction}>
            {props.primaryButtonText}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default MyModal;
/*
  import MyModal from "../components/Modal";

  const [showModal, setShowModal] = React.useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handlePrimaryAction =  () => {};
  
                <button onClick={handleShowModal}>delete Account</button>
                <MyModal
                  show={showModal}
                  handleClose={handleCloseModal}
                  //title="MODAL TITLE"
                 // primaryButtonText="MODAL TEXT"
                  handlePrimaryAction={handlePrimaryAction}
                >
                  <>
                    //MODAL CONTENT
                  </>
                </MyModal>
                 */
