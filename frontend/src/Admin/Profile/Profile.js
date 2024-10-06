import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Alert, TextField } from "@mui/material";
import { toast } from "react-toastify";
import {
  useGetUserQuery,
  useUpdateMutation,
  useUserImageMutation,
} from "../../slices/usersApiSlice";
import editIcon from "../../Assets/edit.svg";
import cancelIcon from "../../Assets/icons-cancel.svg";
import saveIcon from "../../Assets/save_icon.svg";

const UserProfile = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    whatsapp: "",
    image: "",
  });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [isEditing, setIsEditing] = useState(false); // Single state for edit mode

  const userInfo = useSelector((state) => state.auth.userInfo);
  const { data: user } = useGetUserQuery(userInfo?._id, {
    skip: !userInfo?._id,
  });
  const [update] = useUpdateMutation();
  const [userImage] = useUserImageMutation();

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.first_name,
        lastname: user.last_name,
        email: user.email,
        password: "",
        phone: user.phone || "",
        whatsapp: user.whatsapp || "",
        image: user.image || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const updatedFields = {};

    // Check each field to see if it has changed
    if (formData.password) {
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
        }, 5000);
        return;
      }
      updatedFields.password = formData.password;
    }
    if (formData.firstname !== user.first_name)
      updatedFields.first_name = formData.firstname;
    if (formData.lastname !== user.last_name)
      updatedFields.last_name = formData.lastname;
    if (formData.email !== user.email) updatedFields.email = formData.email;
    if (formData.phone !== user.phone) updatedFields.phone = formData.phone;
    if (formData.whatsapp !== user.whatsapp)
      updatedFields.whatsapp = formData.whatsapp;

    // Only update if there are changes
    if (Object.keys(updatedFields).length === 0) {
      setAlert({
        type: "info",
        message: "No changes to update.",
      });
      setTimeout(() => {
        setAlert({ type: "", message: "" });
      }, 3000);
      return;
    }

    update({ userId: userInfo._id, ...updatedFields })
      .unwrap()
      .then(() => {
        setAlert({
          type: "success",
          message: "Profile updated successfully!",
        });
        setTimeout(() => {
          setAlert({ type: "", message: "" });
        }, 3000);
        setIsEditing(false); // Turn off editing mode after successful update
      })
      .catch((error) => {
        setAlert({
          type: "error",
          message: error?.data?.message || "Update failed. Please try again.",
        });
      });
  };

  const handleCancel = () => {
    // Reset formData to the original user data
    setFormData({
      firstname: user.first_name,
      lastname: user.last_name,
      email: user.email,
      password: "",
      phone: user.phone || "",
      whatsapp: user.whatsapp || "",
      image: user.image || "",
    });
    setIsEditing(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Upload the file
      const uploadRes = await userImage(formData).unwrap();
      toast.success(uploadRes.message);

      const updatedFile = uploadRes.file;
      setFormData((prev) => ({ ...prev, image: updatedFile }));

      if (!userInfo._id) {
        throw new Error("userInfo ID is not available");
      }
      await update({ userId: userInfo._id, image: updatedFile }).unwrap();
      setFormData((prev) => ({ ...prev, image: updatedFile }));
      // Update local state
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="flex flex-grow items-start justify-center mb-10 ">
      <div className="bg-white w-full">
        <div className="container mx-auto my-2 p-2">
          <div className="md:flex no-wrap md:mx-2">
            <div className="w-full md:w-4/12 mr-6">
              <div className="flex flex-col justify-center items-center bg-white p-3 border-t-4 border-primary">
                <div className="image overflow-hidden w-full h-full">
                  <img
                    className="h-auto w-full mx-auto block rounded-full m-auto shadow"
                    src={formData.image}
                    alt=""
                  />
                </div>
                <h1 className="text-gray-900 font-bold text-xl leading-8 my-1 text-center">
                  {formData.firstname} {formData.lastname}
                </h1>

                <label
                  htmlFor="uploadFile1"
                  className="bg-primary hover:bg-secondary transition w-full py-1 mt-6 shadow-sm cursor-pointer lg:max-w-[162px] rounded-lg flex justify-center items-center text-white text-[16.5px]"
                >
                  Upload Photo
                  <input
                    type="file"
                    name={formData.image}
                    onChange={handleFileChange}
                    required
                    id="uploadFile1"
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="w-full md:w-9/12 h-full">
              <div className="bg-white p-3 shadow-sm rounded-sm">
                <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                  <span className="text-primary">
                    <svg
                      className="h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  <span className="tracking-wide text-lg">About</span>
                </div>
                <div className="text-gray-700">
                  <div className="grid md:grid-cols-1 text-[15px] relative">
                    <div className="grid grid-cols-2 my-2 items-center">
                      <div className="px-4 py-1 font-semibold">First Name</div>
                      <div className="px-4 py-1 -ml-4">
                        {isEditing ? (
                          <TextField
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            fullWidth
                          />
                        ) : (
                          formData.firstname
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 my-2 items-center">
                      <div className="px-4 py-1 font-semibold">Last Name</div>
                      <div className="px-4 py-1 -ml-4">
                        {isEditing ? (
                          <TextField
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            fullWidth
                          />
                        ) : (
                          formData.lastname
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 my-2 items-center">
                      <div className="px-4 py-1 font-semibold">Email</div>
                      <div className="px-4 py-1 -ml-4">
                        {isEditing ? (
                          <TextField
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                          />
                        ) : (
                          <a href={`mailto:${formData.email}`}>
                            {formData.email}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 my-2 items-center">
                      <div className="px-4 py-1 font-semibold">Phone</div>
                      <div className="px-4 py-1 -ml-4">
                        {isEditing ? (
                          <TextField
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            fullWidth
                          />
                        ) : (
                          formData.phone
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 my-2 items-center">
                      <div className="px-4 py-1 font-semibold">WhatsApp</div>
                      <div className="px-4 py-1 -ml-4">
                        {isEditing ? (
                          <TextField
                            name="whatsapp"
                            value={formData.whatsapp}
                            onChange={handleChange}
                            fullWidth
                          />
                        ) : (
                          formData.whatsapp
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 my-2 items-center mb-11">
                      <div className="px-4 py-1 font-semibold">Password</div>
                      <div className="px-4 py-1 -ml-4">
                        {isEditing ? (
                          <TextField
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                          />
                        ) : (
                          "********"
                        )}
                      </div>
                    </div>
                    {alert.message && (
                      <Alert severity={alert.type}>{alert.message}</Alert>
                    )}
                    {isEditing && (
                      <div className="flex flex-row gap-3 ml-4 mt-8 absolute bottom-0 right-0">
                        <button onClick={() => handleSubmit()}>
                          <div className="relative group">
                            <img src={saveIcon} alt="save" />
                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-gray-700 bg-white px-2 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              Save
                            </span>
                          </div>
                        </button>
                        <button onClick={handleCancel}>
                          <div className="relative group">
                            <img src={cancelIcon} alt="cancel" />
                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-gray-700 bg-white px-2 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              Cancel
                            </span>
                          </div>
                        </button>
                      </div>
                    )}
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="absolute bottom-0 right-0 ml-5 pt-1"
                      >
                        <div className="relative group ">
                          <img src={editIcon} alt="edit" />
                          <span className="absolute bottom-14 left-[12px] transform -translate-x-1/2 translate-y-full text-gray-700 bg-white px-2 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Edit
                          </span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
