import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  DELETEDOC,
  GETCOLLECTION,
  GETDOC,
  SETDOC,
  decrypt,
} from "../../../server";
import NotFound from "../../NotFound/NotFound";
import Input from "../../../components/Input/Input";
import { CreateToast } from "../../../App";
import TipTap from "../RichTextEditor/tiptap";
import DataTable from "react-data-table-component";

const EditJob = ({ user }) => {
  const [Users, setUsers] = useState([]);
  useEffect(() => {
    const FetchUsers = async () => {
      setUsers(await GETCOLLECTION("users"));
    };
    FetchUsers();
  }, []);
  const id = useParams().ID;
  const [job, setJob] = useState({});
  const [authorized, setAuthorized] = useState(null);
  useEffect(() => {
    const FetchJob = async () => {
      const Job = await GETDOC("Jobs", id);
      if (Job.Creator == decrypt(user.id)) {
        setJob(Job);
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    };
    FetchJob();
  }, []);
  const handleJobUpdate = (e) => {
    const { name, value } = e.target;
    setJob((prev) => {
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
    setJob((prev) => {
      return { ...prev, [valueToChange]: value };
    });
  };
  const SaveJob = async () => {
    CreateToast("saving", "info");

    await SETDOC("Jobs", job.id, job, false);

    CreateToast("Saved", "success");
  };
  const columns = [
    {
      name: "Name",
      selector: (row) => row.Name,
      sortable: true,
      center: true,
    },
    {
      name: "Email",
      selector: (row) => row.Email,
      sortable: true,
      center: true,
    },
    {
      name: "Phone",
      selector: (row) => row.Phone,
      sortable: true,
      center: true,
    },
    {
      name: "Gender",
      selector: (row) => row.Gender,
      sortable: true,
      center: true,
    },
    {
      name: "Title",
      selector: (row) => row.Title,
      sortable: true,
      center: true,
    },
    {
      name: "CV",
      selector: (row) => row.CV,
      sortable: true,
      center: true,
    },
    {
      name: "options",
      selector: (row) => row.options,

      center: true,
      width: "250px",
    },
  ];
  const DeleteApplicant = async (id) => {
    CreateToast("Deleting", "None", 1000);
    const newApplicantsArray = job.Applicants.filter(
      (Applicant) => Applicant != id
    );
    setJob((prev) => {
      return { ...prev, Applicants: newApplicantsArray };
    });
    await SETDOC(
      "Jobs",
      job.id,
      { ...job, Applicants: newApplicantsArray },
      false
    );
    CreateToast(" deleted", "success", 1000);
  };
  const data = job?.Applicants?.map((Applicant) => {
    const targetUser = Users.find((user) => user.id === Applicant);
    return {
      Name: targetUser?.Fname + targetUser?.Lname,
      Email: targetUser?.email,
      Phone: targetUser?.phone,
      Gender: targetUser?.gender,
      Title: targetUser?.title,
      CV: targetUser?.CV ? (
        <button
          className="Button View"
          onClick={() => {
            window.location.href = targetUser.CV;
          }}
        >
          Download
        </button>
      ) : (
        "N / A"
      ),

      options: (
        <div className="Button-wrapper">
          <button
            className="Button Danger"
            onClick={() => {
              DeleteApplicant(targetUser.id);
            }}
          >
            Delete
          </button>

          <button
            className="Button View"
            onClick={() => {
              window.location.href = `/Profile/${targetUser.id}`;
            }}
          >
            View
          </button>
        </div>
      ),
    };
  });
  return (
    <>
      {authorized ? (
        <div className="JobsWrapper">
          <DataTable title="Job Listings" columns={columns} data={data} />

          <Input
            label="Designation"
            type="text"
            id="Designation"
            name="Designation"
            value={job.Designation}
            onChangeFunction={handleJobUpdate}
            customWidth="70%"
          />
          <Input
            label="Experience"
            type="text"
            id="Experience"
            name="Experience"
            value={job.Experience}
            onChangeFunction={handleJobUpdate}
            customWidth="70%"
          />
          <Input
            label="Qualification"
            type="text"
            id="Qualification"
            name="Qualification"
            value={job.Qualification}
            onChangeFunction={handleJobUpdate}
            customWidth="70%"
          />
          <Input
            label="Vacancy"
            type="text"
            id="Vacancy"
            name="Vacancy"
            value={job.Vacancy}
            onChangeFunction={handleJobUpdate}
            customWidth="70%"
          />
          <Input
            label="Job Location"
            type="text"
            id="JobLocation"
            name="JobLocation"
            value={job.JobLocation}
            onChangeFunction={handleJobUpdate}
            customWidth="70%"
          />

          <div className="formItem" style={{ flexDirection: "column" }}>
            <label htmlFor="DescriptionContent">Description:</label>
            <TipTap
              setHTML={(value) => {
                handlePostBodyChange(value, "DescriptionContent");
              }}
              OldData={job.DescriptionContent}
            />
          </div>
          <div className="formItem" style={{ flexDirection: "column" }}>
            <label htmlFor="DesiredSkillsContent">Desired Skills:</label>
            <TipTap
              setHTML={(value) => {
                handlePostBodyChange(value, "DesiredSkillsContent");
              }}
              OldData={job.DesiredSkillsContent}
            />
          </div>
          <button className="Button" onClick={SaveJob}>
            Save
          </button>
        </div>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default EditJob;
