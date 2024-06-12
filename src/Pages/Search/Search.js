/* eslint-disable no-case-declarations */
import React, { useEffect, useState } from "react";
import "./Search.css";
import { QUERY } from "../../server";
import Loading from "../../components/Loading/Loading";
import Post from "../../components/Post/Post";
import JobCard from "../../components/Job/JobCard";
import LetteredAvatar from "../../components/LetteredAvatar/LetteredAvatar";
const Search = ({ SearchValue, User }) => {
  const [searchObject, setSearchObject] = useState({
    Term: SearchValue,
    Category: null,
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const startSearch = async () => {
    setLoading(true);
    let results;

    switch (searchObject.Category) {
      case "users":
        const [firstResults, secondResults, thirdResults] = await Promise.all([
          QUERY("users", "Fname", "==", SearchValue),
          QUERY("users", "Lname", "==", SearchValue),
          QUERY("users", "email", "==", SearchValue),
        ]);
        let data = [...firstResults, ...secondResults, ...thirdResults];
        const uniqueData = [
          ...new Map(data.map((item) => [JSON.stringify(item), item])).values(),
        ];

        results = uniqueData;
        break;

      case "Jobs":
        results = await QUERY("Jobs", "Designation", "==", SearchValue);

        break;

      case "Posts":
        results = await QUERY("Posts", "Body", "==", SearchValue);

        break;

      default:
        break;
    }
    setLoading(false);
    setResults(results);
  };
  useEffect(() => {
    if (searchObject.Category) {
      startSearch();
    }
  }, [searchObject]);
  const whatToRender = () => {
    switch (searchObject.Category) {
      case "users":
        return results?.map((user) => {
          return (
            <>
              <div
                className="User-wrapper"
                onClick={() => {
                  window.location.href = `/Profile/${user.id}`;
                }}
              >
                <div>
                  {User?.Profile ? (
                    <img src={User?.Profile} className="profilePhoto"></img>
                  ) : (
                    <LetteredAvatar
                      Name={User?.Fname}
                      customHeight="40px"
                      customWidth="40px"
                    />
                  )}
                </div>
                <div className="Data">
                  <p className="name">
                    {user.Fname} {user.Lname}
                  </p>
                  <p className="title">{user?.title}</p>
                </div>
              </div>
            </>
          );
        });
      case "Jobs":
        return results?.map((job) => {
          return <JobCard job={job} key={job.id} user={User} />;
        });

      case "Posts":
        return results?.map((post) => {
          return <Post post={post} key={post.id} User={User} />;
        });

      default:
        break;
    }
  };
  console.log(results);
  return (
    <div className="searchPage">
      <div className="Menu">
        <ul>
          <p>Search in...</p>
          <li
            onClick={() =>
              setSearchObject((prev) => ({ ...prev, Category: "users" }))
            }
            className={searchObject.Category === "users" ? "active" : ""}
          >
            People
          </li>

          <li
            onClick={() =>
              setSearchObject((prev) => ({ ...prev, Category: "Jobs" }))
            }
            className={searchObject.Category === "Jobs" ? "active" : ""}
          >
            Jobs
          </li>
          <li
            onClick={() =>
              setSearchObject((prev) => ({ ...prev, Category: "Posts" }))
            }
            className={searchObject.Category === "Posts" ? "active" : ""}
          >
            Posts
          </li>
        </ul>
      </div>
      {loading ? (
        <Loading loading={loading} />
      ) : (
        <div className="Results">{whatToRender()}</div>
      )}
    </div>
  );
};

export default Search;
