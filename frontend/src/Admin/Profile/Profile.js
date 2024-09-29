import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Alert } from "@mui/material";
import { useGetUserQuery, useUpdateMutation } from "../../slices/usersApiSlice";
import cancelIcon from "../../Assets/icons-cancel.svg";
import saveIcon from "../../Assets/save_icon.svg";
import editIcon from "../../Assets/edit.svg";
import "./Profile.css";

// Reusable EditableField component
const EditableField = ({
  label,
  name,
  value,
  editingField,
  setEditingField,
  handleChange,
  handleSubmit,
  handleCancel,
  type = "text",
  placeholder,
}) => {
  return (
    <div className="mb-5">
      <label
        htmlFor={name}
        className="mb-1 block text-lg font-semibold text-secondary"
      >
        {label}
      </label>
      {editingField === name ? (
        <div className="flex flex-row justify-between items-center">
          <input
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder || label}
            className="rounded-md border border-[#e0e0e0] py-3 px-4 text-base font-medium text-[#6B7280] focus:border-[#6A64F1] focus:shadow-md"
          />
          <div className="flex flex-row gap-2">
            <button type="button" onClick={() => handleSubmit(name)}>
              <img src={saveIcon} alt="save" />
            </button>
            <button type="button" onClick={handleCancel}>
              <img src={cancelIcon} alt="cancel" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between">
          <p className="text-base font-medium text-primary">
            {type === "password" ? "••••••" : value}
          </p>
          <button type="button" onClick={() => setEditingField(name)}>
            <div className="-mt-6">
              <img src={editIcon} alt="edit" />
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-secondary bg-white px-2 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Edit
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

const Profile = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [editingField, setEditingField] = useState(null);

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

    if (fieldName === "password") {
      if (!formData.password || formData.password.trim() === "") {
        setAlert({ type: "error", message: "Please enter a valid password." });
        return;
      }

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
        return;
      }
      updatedField.password = formData.password;
    } else {
      updatedField[fieldName] = formData[fieldName];
    }

    update({ userId: userInfo._id, ...updatedField })
      .unwrap()
      .then(() => {
        setAlert({
          type: "success",
          message: `${fieldName} updated successfully!`,
        });
      })
      .catch((error) => {
        setAlert({
          type: "error",
          message: error?.data?.message || "Update failed. Please try again.",
        });
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
        <div className="mx-auto max-w-[550px] bg-white p-4">
          <form>
            <EditableField
              label="First Name"
              name="firstname"
              value={formData.firstname}
              editingField={editingField}
              setEditingField={setEditingField}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleCancel={handleCancel}
            />
            <EditableField
              label="Last Name"
              name="lastname"
              value={formData.lastname}
              editingField={editingField}
              setEditingField={setEditingField}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleCancel={handleCancel}
            />
            <EditableField
              label="Email"
              name="email"
              value={formData.email}
              editingField={editingField}
              setEditingField={setEditingField}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleCancel={handleCancel}
              type="email"
            />
            <EditableField
              label="Password"
              name="password"
              value={formData.password}
              editingField={editingField}
              setEditingField={setEditingField}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleCancel={handleCancel}
              type="password"
            />
          </form>
          {alert.message && (
            <Alert severity={alert.type}>{alert.message}</Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
