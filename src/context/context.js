import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();
const GithubProvider = ({ children }) => {
  const [gUser, setGuser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  const [request, setRequest] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: "" });

  const searchUser = async (user) => {
    toggleError();
    //setLoading(true)
    const resp = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );
    if (resp) {
      setGuser(resp.data);
      const { followers_url, repos_url } = resp.data;
      axios(`${followers_url}?per_page=100`).then((resp) =>
        setFollowers(resp.data)
      );

      axios(`${repos_url}?per_page=100`).then((resp) => setRepos(resp.data));
    } else {
      toggleError(true, "username can't be found, please try again");
    }
    checkRequests();
    setLoading(false);
  };
  // check remaining requests
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(
        ({
          data: {
            rate: { limit, remaining: left },
          },
        }) => {
          setRequest(left);
          if (left === 0) {
            //throw an error
            toggleError(true, "sorry, you reached your hourly request limit");
          }
        }
      )
      .catch((error) => console.log(error));
  };
  //error
  function toggleError(show = false, msg = "") {
    setError({ show, msg });
  }

  useEffect(checkRequests, []);

  return (
    <GithubContext.Provider
      value={{ gUser, repos, followers, request, error, searchUser, loading }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
