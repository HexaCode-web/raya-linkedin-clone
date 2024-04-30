import { useEffect, useState } from "react";
import { GETCOLLECTION, GETDOC, decrypt } from "./server";
import { Routes, Route } from "react-router";
import Nav from "./components/Nav/Nav";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./Pages/NotFound/NotFound";
import Loading from "./components/Loading/Loading";
import Home from "./Pages/Home/Home";
import Portal from "./Pages/Portal/Portal";
import Jobs from "./Pages/Jobs/Jobs";
import Profile from "./Pages/Profile/Profile";
import { ToastContainer, toast } from "react-toastify";
import Settings from "./Pages/Settings/Settings";
import JobManager from "./Pages/JobManager/JobManager";
import Job from "./Pages/Job/Job";
import EditJob from "./Pages/JobManager/CreateJob/EditJob";
export const CreateToast = (text, type, duration = 4000) => {
  let value;
  switch (type) {
    case "success":
      value = toast.success;
      break;
    case "info":
      value = toast.info;
      break;
    case "warning":
      value = toast.warn;
      break;
    case "error":
      value = toast.error;
      break;
    default:
      value = toast;
      break;
  }
  return value(text, {
    position: "bottom-right",
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
function App() {
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("activeUser")) || ""
  );
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [width, setWidth] = useState(window.innerWidth);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);
  useEffect(() => {
    const checkData = async () => {
      let fetchedData = {};
      GETDOC("users", decrypt(user.id)).then((res) => {
        fetchedData = res;
        setUser(fetchedData);
      });
    };
    if (user) {
      checkData();
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    const FetchUsers = async () => {
      setUsers(await GETCOLLECTION("users"));
    };
    FetchUsers();
  }, []);
  return (
    <div className="App">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Loading loading={isLoading} />
      <Nav screenWidth={width} User={user} />

      <Routes>
        <Route
          path="/"
          element={user ? <Home User={user} /> : <Portal />}
        ></Route>
        <Route
          path="/Jobs"
          element={user ? <Jobs Users={users} user={user} /> : <Portal />}
        ></Route>
        <Route
          path="/Settings"
          element={user ? <Settings /> : <Portal />}
        ></Route>
        <Route
          path="/Profile"
          element={user ? <Profile User={user} /> : <Portal />}
        ></Route>
        <Route path="*" element={<NotFound />}></Route>
        <Route
          path="/JobsManager"
          element={user ? <JobManager User={user} /> : <Portal />}
        ></Route>
        <Route
          path="/Job/:ID"
          element={<Job user={user} users={users} />}
        ></Route>
        <Route path="/Profile/:ID" element={<Profile />}></Route>
        <Route
          path="/JobsManager/jobs/:ID"
          element={user ? <EditJob user={user} Users={users} /> : <Portal />}
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
