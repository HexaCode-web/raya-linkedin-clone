import React, { useEffect, useState } from "react";
import { GETCOLLECTION } from "../../server";
import "./Jobs.css";
const Jobs = ({ Users }) => {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    const FetchJobs = async () => {
      setJobs(await GETCOLLECTION("Jobs"));
    };
    FetchJobs();
  }, []);
  const renderJobs = jobs.map((job) => {
    const jobCreator = Users.find((user) => user.id === job.Creator);
    return (
      <div
        className="JobCard"
        key={job.id}
        onClick={() => {
          window.location.href = `/Job/${job.id}`;
        }}
      >
        <div className="Data">
          <img src={jobCreator.Profile} className="profilePhoto"></img>
          <div className="InnerData">
            <p className="Title">{job.Designation}</p>
            <p className="name">
              {jobCreator.Fname} {jobCreator.Lname}
            </p>
            <p className="Location">{job.JobLocation}</p>
          </div>
        </div>
        <div className="Date">
          <p>{job.DateAdded}</p>
        </div>
      </div>
    );
  });
  return <div className="Jobs">{renderJobs}</div>;
};

export default Jobs;
// {
//   "DateAdded": "29/04/24 03:40",
//   "JobLocation": "cairo - egypt",
//   "DesiredSkillsContent": "<p>edf</p>",
//   "Designation": "Senior Java",
//   "Experience": "7 years minimum",
//   "Vacancy": "Immediate",
//   "id": "8fc936b0-4f4d-41c0-81fd-3270b26a300e",
//   "Creator": "HSeVpQpmgrU9MCR3RFKNTgeHqog2",
//   "Applicants": [],
//   "DescriptionContent": "<p>abc</p>",
//   "Qualification": "Engineering/Sciences Degree"
// }
