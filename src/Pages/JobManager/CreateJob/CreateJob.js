import React, { useState } from "react";
import Input from "../../../components/Input/Input";
import TipTap from "../RichTextEditor/tiptap";
import "./CreateJob.css";
import { v4 as uuidv4 } from "uuid";
import { SETDOC } from "../../../server";
import { CreateToast } from "../../../App";

const CreateJob = ({ User }) => {
  const [NewJob, setNewJob] = useState({
    DateAdded: "",
    DescriptionContent: "",
    Designation: "",
    DesiredSkillsContent: "",
    Experience: "",
    JobLocation: "",
    Qualification: "",
    Vacancy: "",
    id: "",
    Applicants: [],
  });
  function getCurrentDateFormatted() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = String(currentDate.getFullYear()).slice(-2);
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  const SaveJob = async () => {
    CreateToast("Creating job", "info");
    const newJob = {
      ...NewJob,
      Creator: User.id,
      DateAdded: getCurrentDateFormatted(),
      id: uuidv4(),
    };
    await SETDOC("Jobs", newJob.id, newJob, true);
    setNewJob({
      DateAdded: "",
      DescriptionContent: "",
      Designation: "",
      DesiredSkillsContent: "",
      Experience: "",
      JobLocation: "",
      Qualification: "",
      Vacancy: "",
      id: "",
      Creator: "",

      Applicants: [],
    });
    CreateToast("Job Created", "success");
  };
  const handleJobUpdate = (e) => {
    const { name, value } = e.target;
    setNewJob((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handlePostBodyChange = (value, Target) => {
    let valueToChange;
    switch (Target) {
      case "DescriptionContent":
        valueToChange = "DescriptionContent";
        break;
      case "DesiredSkillsContent":
        valueToChange = "DesiredSkillsContent";
        break;
    }
    setNewJob((prev) => {
      return { ...prev, [valueToChange]: value };
    });
  };
  return (
    <div className="JobsWrapper">
      <Input
        label="Designation"
        type="text"
        id="Designation"
        name="Designation"
        value={NewJob.Designation}
        onChangeFunction={handleJobUpdate}
        customWidth="70%"
      />
      <Input
        label="Experience"
        type="text"
        id="Experience"
        name="Experience"
        value={NewJob.Experience}
        onChangeFunction={handleJobUpdate}
        customWidth="70%"
      />
      <Input
        label="Qualification"
        type="text"
        id="Qualification"
        name="Qualification"
        value={NewJob.Qualification}
        onChangeFunction={handleJobUpdate}
        customWidth="70%"
      />
      <Input
        label="Vacancy"
        type="text"
        id="Vacancy"
        name="Vacancy"
        value={NewJob.Vacancy}
        onChangeFunction={handleJobUpdate}
        customWidth="70%"
      />
      <Input
        label="Job Location"
        type="text"
        id="JobLocation"
        name="JobLocation"
        value={NewJob.JobLocation}
        onChangeFunction={handleJobUpdate}
        customWidth="70%"
      />

      <div className="formItem" style={{ flexDirection: "column" }}>
        <label htmlFor="DescriptionContent">Description:</label>
        <TipTap
          setHTML={(value) => {
            handlePostBodyChange(value, "DescriptionContent");
          }}
          OldData={NewJob.DescriptionContent}
        />
      </div>
      <div className="formItem" style={{ flexDirection: "column" }}>
        <label htmlFor="DesiredSkillsContent">Desired Skills:</label>
        <TipTap
          setHTML={(value) => {
            handlePostBodyChange(value, "DesiredSkillsContent");
          }}
          OldData={NewJob.DesiredSkillsContent}
        />
      </div>
      <button className="Button" onClick={SaveJob}>
        Add
      </button>
    </div>
  );
};

export default CreateJob;
