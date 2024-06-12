import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GETDOC, SETDOC, QUERY } from "../../server";
import "./Job.css";
import { CreateToast } from "../../App";
import Loading from "../../components/Loading/Loading";
const Job = ({ user }) => {
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(false);
  const id = useParams().ID;
  const [alreadyApplied, setAlreadyApplied] = useState(null);
  const [job, setJob] = useState();
  useEffect(() => {
    const FetchJob = async () => {
      setLoading(true);
      const fetchedJob = await GETDOC("Jobs", id);
      const matches = await QUERY("users", "id", "==", job.Creator);
      setCreator(matches[0]);

      setJob(fetchedJob);
      setLoading(false);
    };
    FetchJob();
  }, []);
  useEffect(() => {
    setAlreadyApplied(
      job?.Applicants.find((Applicant) => Applicant === user.id)
    );
  }, [job]);
  function getTimePassed(dateString) {
    // Parse the input date string
    const parts = dateString.split("/");
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const year = parseInt(parts[2].substring(0, 2)); // Assuming the year is in the format YY

    // Create a Date object
    const date = new Date(year + 2000, month - 1, day); // Adding 2000 to the year to convert YY to YYYY format

    // Calculate the time difference in milliseconds
    const timeDifference = Date.now() - date.getTime();

    // Convert milliseconds to seconds
    const secondsDifference = Math.floor(timeDifference / 1000);

    // Define time intervals in seconds
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    // Iterate over intervals to find the largest interval that fits the time difference
    for (const interval of intervals) {
      const intervalValue = Math.floor(secondsDifference / interval.seconds);
      if (intervalValue >= 1) {
        return intervalValue === 1
          ? `1 ${interval.label} ago`
          : `${intervalValue} ${interval.label}s ago`;
      }
    }

    // If the date is in the future or if it's less than a second ago
    return "Just now";
  }

  const Apply = async () => {
    const newJob = {
      ...job,
      Applicants: [user.id, ...job.Applicants],
    };
    setJob(newJob);
    await SETDOC("Jobs", id, newJob);
    CreateToast("successfully applied", "success");
  };
  return (
    <div className="JobOffer">
      {job && (
        <>
          <div className="Title">
            <h4>{job.Designation}</h4>
            <h6>
              {creator?.Fname} {creator?.Lname} •{" "}
              <span className="location">{job.JobLocation}</span> •{" "}
              <span className="location">{getTimePassed(job.DateAdded)}</span> •{" "}
              <span className="location">
                {job.Applicants.length} Applicant
                {job.Applicants.length > 1 ? "s" : ""}
              </span>
            </h6>
          </div>

          <div className="JobDetails">
            {job.Qualification && (
              <div className="Detail">
                <span>Qualification: </span>
                <span>{job.Qualification}</span>
              </div>
            )}
            {job.Vacancy && (
              <div className="Detail">
                <span>Vacancy: </span>
                <span>{job.Vacancy}</span>
              </div>
            )}
            {job.Experience && (
              <div className="Detail">
                <span>Experience: </span>
                <span>{job.Experience}</span>
              </div>
            )}
            {job.JobLocation && (
              <div className="Detail">
                <span>Job Location: </span>
                <span>{job.JobLocation}</span>
              </div>
            )}
            {job.DateAdded && (
              <div className="Detail">
                <span>Date Added: </span>
                <span>{job.DateAdded}</span>
              </div>
            )}
          </div>

          <div className="Description">
            <p className="Description">Description</p>
            <div
              dangerouslySetInnerHTML={{ __html: job.DescriptionContent }}
            ></div>
          </div>

          <div className="Description">
            <p className="Description">Desired Skills</p>
            <div
              dangerouslySetInnerHTML={{ __html: job.DesiredSkillsContent }}
            ></div>
          </div>

          {alreadyApplied ? (
            <h3>You already applied for this job</h3>
          ) : (
            <button className="Button" onClick={Apply}>
              Apply Now
            </button>
          )}
        </>
      )}
      <Loading loading={loading} />
    </div>
  );
};

export default Job;
