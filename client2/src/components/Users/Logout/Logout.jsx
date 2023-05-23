import React, { useEffect } from "react";
import { deleteToken } from "../../../utils/TokenManager";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProfile, setUserToken } from "../../../AppSlice";

export default function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Clean up token
    deleteToken();

    dispatch(setProfile(null));
    dispatch(setUserToken(null));

    navigate("/");
  }, []);

  return <div>Logging out</div>;
}
