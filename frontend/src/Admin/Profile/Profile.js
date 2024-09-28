import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Alert, Tooltip } from "@mui/material";
import SaveTwoToneIcon from "@mui/icons-material/SaveTwoTone";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import { useGetUserQuery, useUpdateMutation } from "../../slices/usersApiSlice";
import "./Profile.css";

const AddProperty = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [isEditing, setIsEditing] = useState(false);

  const userInfo = useSelector((state) => state.auth.userInfo);
  const { data: user, error } = useGetUserQuery(userInfo?._id, {
    skip: !userInfo?._id,
  });
  const [update] = useUpdateMutation();

  useEffect(() => {
    if (user)
      setFormData({
        firstname: user.first_name,
        lastname: user.last_name,
        email: user.email,
        password: "",
      });
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    update({ userId: userInfo._id, ...formData })
      .unwrap()
      .then(() => {
        setAlert({ type: "success", message: "Profile updated successfully!" });

        // Remove alert after 5 seconds (5000ms)
        setTimeout(() => {
          setAlert({ type: "", message: "" });
        }, 2000);
      })
      .catch((error) => {
        setAlert({
          type: "error",
          message:
            error?.data?.message
              .replace("User validation failed: password:", "")
              .trim() || "Update failed. Please try again.",
        });

        // Remove alert after 5 seconds (5000ms)
        setTimeout(() => {
          setAlert({ type: "", message: "" });
        }, 4000);
      })
      .finally(() => setIsEditing(false));
  };

  const handleCancel = () => {
    setFormData({
      firstname: user.first_name,
      lastname: user.last_name,
      email: user.email,
      password: "",
    });
    setIsEditing(false);
  };

  const renderField = (label, name, type = "text", value, isEditable) => (
    <div className=" mb-5">
      <label
        htmlFor={name}
        className="mb-1 block text-lg font-semibold text-gray-700"
      >
        {label}
      </label>
      {isEditable ? (
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={handleChange}
          placeholder={label}
          className="w-full rounded-md border border-[#e0e0e0] py-3 px-6 text-base font-medium text-[#6B7280] focus:border-[#6A64F1] focus:shadow-md"
        />
      ) : (
        <p className="text-base font-medium text-gray-600">
          {type === "password" ? "••••••" : value}
        </p>
      )}
    </div>
  );

  return (
    <div>
      {error ? (
        <Alert severity="error">Error fetching data from API</Alert>
      ) : (
        <div className="mx-auto w-full max-w-[550px] bg-white p-4">
          <form onSubmit={handleSubmit}>
            {renderField(
              "First Name",
              "firstname",
              "text",
              formData.firstname,
              isEditing
            )}
            {renderField(
              "Last Name",
              "lastname",
              "text",
              formData.lastname,
              isEditing
            )}
            {renderField("Email", "email", "email", formData.email, isEditing)}
            {renderField(
              "Password",
              "password",
              "password",
              formData.password,
              isEditing
            )}

            <div className="px-0 py-2 space-x-2">
              {isEditing ? (
                <>
                  <Tooltip title="Update" arrow>
                    <Tooltip title="Update" arrow>
                      <button
                        type="submit"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <SaveTwoToneIcon variant="outlined" />
                      </button>
                    </Tooltip>
                  </Tooltip>
                  <Tooltip title="Cancel" arrow>
                    <CancelTwoToneIcon
                      variant="outlined"
                      onClick={() => handleCancel()}
                      sx={{ cursor: "pointer" }}
                    />
                  </Tooltip>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  class="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-lg font-medium px-4 py-2 inline-flex space-x-1 items-center"
                >
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </span>
                  <span class="hidden md:inline-block">Edit</span>
                </button>
              )}
              {alert.message && (
                <Alert severity={alert.type} className="mt-4">
                  {alert.message}
                </Alert>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddProperty;
