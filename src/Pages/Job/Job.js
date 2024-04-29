import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GETDOC } from "../../server";
import "./Job.css";
const Job = () => {
  const id = useParams().ID;

  const [job, setActiveJob] = useState();
  useEffect(() => {
    const FetchJob = async () => {
      setActiveJob(await GETDOC("Jobs", id));
    };
    FetchJob();
  }, []);

  return (
    <div className="JobOffer">
      {job ? (
        <div>
          <h4>{job.Designation}</h4>
          <div className="JobDetails">
            {job.Designation && (
              <div className="Detail">
                <span>Designation: </span>
                <span>{job.Designation}</span>
              </div>
            )}
            {job.Qualification && (
              <div className="Detail">
                <span>Qualification: </span>
                <span> {job.Qualification}</span>
              </div>
            )}
            {job.Vacancy && (
              <div className="Detail">
                <span>Vacancy: </span>
                <span> {job.Vacancy}</span>
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
          <button className="Button">Apply Now</button>
        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
};

export default Job;
