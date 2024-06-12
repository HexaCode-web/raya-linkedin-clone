import React, { useEffect, useState } from "react";
import { GETCOLLECTION } from "../../server";
import "./Jobs.css";
import JobCard from "../../components/Job/JobCard";
const Jobs = ({ user }) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const FetchJobs = async () => {
      setJobs(await GETCOLLECTION("Jobs"));
    };
    FetchJobs();
  }, []);
  const renderJobs = jobs.map((job, index) => {
    return <JobCard job={job} user={user} key={index} />;
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
