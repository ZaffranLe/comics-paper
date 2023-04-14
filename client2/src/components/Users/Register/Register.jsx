import React from "react";
import UserInput from "../UserInput";
import { HiUser, HiLockClosed, HiPencil, HiAtSymbol } from "react-icons/hi2";
import UserFormButton from "../UserFormButton";
import UserFormHr from "../UserFormHr";
import UserRequest from "./../../../request/UserRequest";

import { toast } from "react-toastify";
import { useInputValue } from "../../../hooks/useInputValue";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setToken } from "../../../utils/TokenManager";
import { setUserToken } from "../../../AppSlice";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername, isUsernameValid, usernameInvalidReason] =
    useInputValue(
      (x) => x.length > 4,
      "The username length must greater than 4"
    );

  const [password, setPassword, isPasswordValid, passwordInvalidReason] =
    useInputValue(
      (password) =>
        password.length >= 8 && new RegExp(/([A-Z])+/).test(password),
      `Password length must greater than 8 and contains one-uppercase letter`
    );

  const [email, setEmail, isEmailValid, emailInvalidReason] = useInputValue(
    (email) => new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).test(email),
    "The email is invalid format"
  );

  const handleOnSubmit = (e) => {
    e.preventDefault();

    UserRequest.postRegister({
      username,
      password,
      email,
    })
      .then((response) => {
        // Trying to signed in using this username and password
        // , and also get the token and put it back to localStorage

        if (response.status === 201) {
          toast.success(`Successfully registered your account.`);

          // Sign up again to get token
          UserRequest.postLogin({ username, password }).then((response) => {
            // Set the token into localStorage
            const { token } = response.data;
            setToken(token);

            dispatch(setUserToken(token));

            // Redirect home
            setTimeout(() => {
              navigate("/");
            }, 600);
          });
        }
      })
      .catch((error) => {
        toast.error(error.response.data.error.message);
      })
      .finally(() => {
        // clean up the form
        e.target.reset();
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
          Register
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

          {/* Re-Enter Password */}
          <div className="flex flex-col gap-2">
            <label htmlFor="repassword"></label>
            <UserInput
              icon={<HiPencil />}
              type="password"
              placeholder="Re-Enter Password"
              name="repassword"
              alt="Re-enter user password"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email"></label>
            <UserInput
              icon={<HiAtSymbol />}
              type="email"
              placeholder="Email"
              name="email"
              alt="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {email.length > 0 && !isEmailValid && (
              <small className="text-xs">{emailInvalidReason}</small>
            )}
          </div>

          <div className="mt-4">
            <UserFormButton
              text={"Create account"}
              type="submit"
              disabled={!(isUsernameValid && isPasswordValid && isEmailValid)}
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

export default Register;
