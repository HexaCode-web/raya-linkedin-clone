import React, { useEffect, useState } from "react";
import "./Job.css";
import { QUERY } from "../../server";
import LetteredAvatar from "../LetteredAvatar/LetteredAvatar";
const JobCard = ({ job, user }) => {
  const alreadyApplied = job.Applicants.find(
    (Applicant) => Applicant === user.id
  );
  const [jobCreator, setJobCreator] = useState(null);
  useEffect(() => {
    const fetchJobCreator = async () => {
      const matches = await QUERY("users", "id", "==", job.Creator);
      setJobCreator(matches[0]);
    };
    fetchJobCreator();
  }, []);
  return (
    jobCreator && (
      <div
        className="JobCard"
        key={job.id}
        onClick={() => {
          window.location.href = `/Job/${job.id}`;
        }}
      >
        <div className="Data">
          <div>
            {jobCreator?.Profile ? (
              <img src={jobCreator?.Profile} className="profilePhoto"></img>
            ) : (
              <LetteredAvatar
                Name={jobCreator?.Fname}
                customHeight="40px"
                customWidth="40px"
              />
            )}
          </div>
          <div className="InnerData">
            <p className="Title">{job.Designation}</p>
            <p className="name">
              {jobCreator?.Fname} {jobCreator?.Lname}
            </p>
            <p className="Location">{job.JobLocation}</p>
          </div>
        </div>
        <div className="Date">
          <p>{job.DateAdded}</p>
        </div>
        {alreadyApplied && <div className="status">Applied</div>}
      </div>
    )
  );
};

export default JobCard;
