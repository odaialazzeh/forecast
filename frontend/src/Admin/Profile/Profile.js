import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Alert } from "@mui/material";
import { useGetUserQuery, useUpdateMutation } from "../../slices/usersApiSlice";
import "./Profile.css";
import cancelIcon from "../../Assets/icons-cancel.svg";
import saveIcon from "../../Assets/save_icon.svg";
import editIcon from "../../Assets/edit.svg";

const Profile = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [editingField, setEditingField] = useState(null); // Tracks the field currently being edited

  const userInfo = useSelector((state) => state.auth.userInfo);
  const { data: user, error } = useGetUserQuery(userInfo?._id, {
    skip: !userInfo?._id,
  });
  const [update] = useUpdateMutation();

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.first_name,
        lastname: user.last_name,
        email: user.email,
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (fieldName) => {
    const updatedField = {};

    // Only add the field being edited to the update payload
    if (fieldName === "password") {
      if (!formData.password || formData.password.trim() === "") {
        setAlert({
          type: "error",
          message: "Please enter a valid password.",
        });
        return;
      }

      // Password-specific validation
      const specialCharRegex = /[+\-*/]/;
      const letterRegex = /[a-zA-Z]/;
      if (
        formData.password.length < 8 ||
        !specialCharRegex.test(formData.password) ||
        !letterRegex.test(formData.password)
      ) {
        setAlert({
          type: "error",
          message:
            "Password must be at least 8 characters long and contain at least one letter and one special character (+, -, *, /).",
        });
        setTimeout(() => {
          setAlert({ type: "", message: "" });
        }, 2000);
        return;
      }
      updatedField.password = formData.password; // Add password only if it's being edited
    } else {
      updatedField[fieldName] = formData[fieldName]; // Add other fields if they are being edited
    }

    // Proceed with update if there is a valid field to update
    update({ userId: userInfo._id, ...updatedField })
      .unwrap()
      .then(() => {
        setAlert({
          type: "success",
          message: `${fieldName} updated successfully!`,
        });

        setTimeout(() => {
          setAlert({ type: "", message: "" });
        }, 3000);
      })
      .catch((error) => {
        setAlert({
          type: "error",
          message: error?.data?.message || "Update failed. Please try again.",
        });

        setTimeout(() => {
          setAlert({ type: "", message: "" });
        }, 4000);
      })
      .finally(() => setEditingField(null));
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  return (
    <div>
      {error ? (
        <Alert severity="error">Error fetching data from API</Alert>
      ) : (
        <div className="mx-auto  max-w-[550px] bg-white p-4">
          <form>
            {/* First Name Field */}
            <div className="mb-5">
              <label
                htmlFor="firstname"
                className="mb-1 block text-lg font-semibold text-secondary"
              >
                First Name
              </label>
              {editingField === "firstname" ? (
                <div className=" flex flex-row justify-between items-center">
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    placeholder="First Name"
                    className=" rounded-md border border-[#e0e0e0] py-3 px-6 text-base font-medium text-[#6B7280] focus:border-[#6A64F1] focus:shadow-md"
                  />
                  <div className="px-0 py-2 space-x-2">
                    <button
                      type="button"
                      onClick={() => handleSubmit("firstname")}
                    >
                      <img src={saveIcon} alt="save" />
                    </button>
                    <button type="button" onClick={() => handleCancel()}>
                      <img src={cancelIcon} alt="cancel" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between">
                  <p className="text-base font-medium text-primary">
                    {formData.firstname}
                  </p>
                  <button
                    type="button"
                    onClick={() => setEditingField("firstname")}
                  >
                    <div className="relative group">
                      <img src={editIcon} alt="edit" />
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-secondary bg-white px-2 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Edit
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Last Name Field */}
            <div className="mb-5">
              <label
                htmlFor="lastname"
                className="mb-1 block text-lg font-semibold text-secondary"
              >
                Last Name
              </label>
              {editingField === "lastname" ? (
                <div className=" flex flex-row justify-between items-center">
                  <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className=" rounded-md border border-[#e0e0e0] py-3 px-6 text-base font-medium text-[#6B7280] focus:border-[#6A64F1] focus:shadow-md"
                  />
                  <div className="px-0 py-2 space-x-2">
                    <button
                      type="button"
                      onClick={() => handleSubmit("lastname")}
                    >
                      <img src={saveIcon} alt="save" />
                    </button>
                    <button type="button" onClick={() => handleCancel()}>
                      <img src={cancelIcon} alt="cancel" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-row justify-between items-center">
                  <p className="text-base font-medium text-primary">
                    {formData.lastname}
                  </p>
                  <button
                    type="button"
                    onClick={() => setEditingField("lastname")}
                  >
                    <div className="relative group">
                      <img src={editIcon} alt="edit" />
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-secondary bg-white px-2 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Edit
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-1 block text-lg font-semibold text-secondary"
              >
                Email
              </label>
              {editingField === "email" ? (
                <div className=" flex flex-row justify-between items-center">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className=" w-72 rounded-md border border-[#e0e0e0] py-3 px-6 text-base font-medium text-[#6B7280] focus:border-[#6A64F1] focus:shadow-md"
                  />
                  <div className="px-0 py-2 space-x-2">
                    <button type="button" onClick={() => handleSubmit("email")}>
                      <img src={saveIcon} alt="save" />
                    </button>
                    <button type="button" onClick={() => handleCancel()}>
                      <img src={cancelIcon} alt="cancel" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between">
                  <p className="text-base font-medium text-primary">
                    {formData.email}
                  </p>
                  <button
                    type="button"
                    onClick={() => setEditingField("email")}
                  >
                    <div className="relative group">
                      <img src={editIcon} alt="edit" />
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-secondary bg-white px-2 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Edit
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-5">
              <label
                htmlFor="password"
                className="mb-1 block text-lg font-semibold text-secondary"
              >
                Password
              </label>
              {editingField === "password" ? (
                <div className=" flex flex-row justify-between items-center">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="rounded-md border border-[#e0e0e0] py-3 px-6 text-base font-medium text-[#6B7280] focus:border-[#6A64F1] focus:shadow-md"
                  />
                  <div className="px-0 py-2 space-x-2">
                    <button
                      type="button"
                      onClick={() => handleSubmit("password")}
                    >
                      <img src={saveIcon} alt="save" />
                    </button>
                    <button type="button" onClick={() => handleCancel()}>
                      <img src={cancelIcon} alt="cancel" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between">
                  <p className="text-base font-medium text-primary">••••••</p>
                  <button
                    type="button"
                    onClick={() => setEditingField("password")}
                  >
                    <div className="relative group">
                      <img src={editIcon} alt="edit" />
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-secondary bg-white px-2 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Edit
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </form>

          {alert.message && (
            <Alert severity={alert.type} className="mt-4">
              {alert.message}
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
