import React, { useEffect, useState } from "react";
import { DELETEDOC, QUERY } from "../../server";
import DataTable from "react-data-table-component";
import { CreateToast } from "../../App";

const General = ({ User }) => {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    const getJobs = async () => {
      setJobs(await QUERY("Jobs", "Creator", "==", User.id));
    };
    getJobs();
  }, []);

  const columns = [
    {
      name: "Title",
      selector: (row) => row.Title,
      sortable: true,
      center: true,
    },
    {
      name: "Vacancy",
      selector: (row) => row.Vacancy,
      sortable: true,
      center: true,
    },
    {
      name: "Location",
      selector: (row) => row.JobLocation,
      sortable: true,
      center: true,
    },
    {
      name: "Date ",
      selector: (row) => row.DateAdded,
      sortable: true,
      center: true,
    },
    {
      name: "Applicants",
      selector: (row) => row.Applicants,
      sortable: true,
      center: true,
    },
    {
      name: "Experience",
      selector: (row) => row.Experience,
      sortable: true,
      center: true,
    },

    {
      name: "Qualification",
      selector: (row) => row.Qualification,
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
  const DeleteJob = async (id) => {
    CreateToast("Deleting", "None", 1000);

    await DELETEDOC("Jobs", id);
    setJobs(await QUERY("Jobs", "Creator", "==", User.id));
    CreateToast(" deleted", "success", 1000);
  };
  const data = jobs?.map((job) => {
    return {
      Title: job.Designation,
      Vacancy: job.Vacancy,
      JobLocation: job.JobLocation,
      Qualification: job.Qualification,
      Experience: job.Experience,
      Applicants: job.Applicants.length,
      DateAdded: job.DateAdded,

      options: (
        <div className="Button-wrapper">
          <button
            className="Button Danger"
            onClick={() => {
              DeleteJob(job.id);
            }}
          >
            Delete
          </button>

          <button
            className="Button View"
            onClick={() => {
              window.location.href = `/JobsManager/jobs/${job.id}`;
            }}
          >
            View
          </button>
        </div>
      ),
    };
  });
  return (
    <div>
      {jobs.length > 0 ? (
        <DataTable title="Job Listings" columns={columns} data={data} />
      ) : (
        ""
      )}
    </div>
  );
};

export default General;
