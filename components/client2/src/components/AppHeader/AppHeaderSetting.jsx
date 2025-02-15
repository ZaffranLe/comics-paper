import React, { useEffect, useState } from "react";
import { FiSun, FiMoon, FiSettings } from "react-icons/fi";
import { Link } from "react-router-dom";
import useTheme from "../../hooks/useTheme";
import { useDispatch, useSelector } from "react-redux";
import { getToken, hasToken } from "../../utils/TokenManager";
import { setProfile } from "../../AppSlice";
import UserRequest from "../../request/UserRequest";

function AppHeaderSetting() {
  const { dark, light, system, theme } = useTheme();
  const userToken = useSelector((app) => app.App.userToken);
  const dispatch = useDispatch();

  const profile = useSelector((app) => app.App.profile);
  useEffect(() => {
    if (hasToken()) {
      UserRequest.postProfile()
        .then((response) => {
          const profile = response.data;
          dispatch(setProfile(profile));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [hasToken]);

  const handleSwitchTheme = () => {
    if (theme === "light") {
      dark();
    } else if (theme === "dark") {
      system();
    } else if (theme === "system") {
      light();
    }
  };

  return (
    <div className="flex flex-row gap-4">
      <button onClick={handleSwitchTheme}>
        {theme === "dark" ? (
          <FiMoon />
        ) : theme === "light" ? (
          <FiSun />
        ) : (
          <FiSettings />
        )}
      </button>
      <button className="bg-neutral-600 px-4 py-2 rounded text-neutral-50 relative">
        {profile === null ? "Account" : profile.username}
        <div
          className="absolute w-[120px] left-[calc(-120px/6)] 
          top-full z-50 bg-neutral-100 dark:bg-neutral-700
          text-neutral-800 dark:text-neutral-100
          shadow-md rounded-sm mt-1 px-4 py-2 flex flex-col"
        >
          {profile === null ? (
            <>
              <Link to="/users/register">Sign up</Link>
              <Link to="/users/login">Sign in</Link>
            </>
          ) : (
            <>
              <Link to="/">Profile</Link>
              <Link to="/users/logout">Sign out</Link>
            </>
          )}
        </div>
      </button>
    </div>
  );
}

export default AppHeaderSetting;
