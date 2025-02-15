import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hasToken, setToken } from "../../../utils/TokenManager";
import UserInput from "../UserInput";
import { HiLockClosed, HiUser } from "react-icons/hi2";
import { useInputValue } from "../../../hooks/useInputValue";
import UserFormButton from "../UserFormButton";
import UserFormHr from "../UserFormHr";
import UserRequest from "../../../request/UserRequest";
import { useDispatch } from "react-redux";
import { setProfile, setUserToken } from "../../../AppSlice";
import { toast } from "react-toastify";

export default function Login() {
  const dispatch = useDispatch();
  const [username, setUsername, isUsernameValid, usernameInvalidReason] =
    useInputValue(
      (x) => x.length > 4,
      "The username length must greater than 4"
    );

  const [password, setPassword, isPasswordValid, passwordInvalidReason] =
    useInputValue(
      (password) => password.length >= 8,
      `Password length must greater than 8 and contains one-uppercase letter`
    );
  const navigate = useNavigate();
  /**
   * Check if the token is exists. If true, return home.
   */
  useEffect(() => {
    if (hasToken()) {
      navigate("/");
    }
  }, []);

  const handleOnSubmit = (e) => {
    // Stop the form to navigate somewhere
    e.preventDefault();

    UserRequest.postLogin({ username, password })
      .then((response) => {
        const { token } = response.data;
        // Set the token into localStorage
        setToken(token);
        dispatch(setUserToken(token));
      })
      .then(async () => {
        // Set the profile after signed in
        const profile = await (await UserRequest.postProfile()).data;
        dispatch(setProfile(profile));

        return profile;
      })
      .then(() => {
        // Notify that the user is logged in successfully
        toast.success(`Successfully logged into application`);
        navigate(`/`);
      })
      .catch((err) => {
        if (err.response !== undefined) {
          toast.error(err.response.data.error.message);
        } else {
          console.error(err);
        }
      });
  };

  const handleOnUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  return (
    <div className="mx-auto lg:w-1/4 md:w-2/4 w-3/4 py-6">
      <div
        className="px-10 py-8 dark:bg-neutral-800 rounded-md 
        mt-12 flex flex-col gap-4 shadow-sm border border-neutral-300 
        text-neutral-400 "
      >
        <h1 className="text-3xl font-bold text-center text-neutral-800">
          Sign in
        </h1>

        {/* Content */}
        <form className="flex flex-col gap-1" onSubmit={handleOnSubmit}>
          {/* Username */}
          <div className="flex flex-col gap-2">
            <label htmlFor="username"></label>
            <UserInput
              icon={<HiUser />}
              type="text"
              placeholder="Username"
              name="username"
              alt="Username of the user to register"
              required
              value={username}
              onChange={handleOnUsernameChange}
            />
            {username.length > 0 && !isUsernameValid && (
              <small className="text-xs">{usernameInvalidReason}</small>
            )}
          </div>
          {/* Password */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password"></label>
            <UserInput
              icon={<HiLockClosed />}
              type="password"
              placeholder="Password"
              name="password"
              alt="Password of the user"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {password.length > 0 && !isPasswordValid && (
              <small className="text-xs">{passwordInvalidReason}</small>
            )}
          </div>

          <div className="mt-4">
            <UserFormButton
              text={"Sign in"}
              type="submit"
              disabled={!(isUsernameValid && isPasswordValid)}
            />
          </div>
        </form>

        {/* Or sign in  */}

        <UserFormHr text="OR" />

        <UserFormButton href="/users/login" text={"Sign in"} />
      </div>
    </div>
  );
}
