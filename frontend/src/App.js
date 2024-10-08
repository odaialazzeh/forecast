import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import SignIn from "./Pages/sign-in/SignIn";
import Profile from "./Admin/Profile/Profile";
import ActivityLog from "./Admin/ActivityLog/ActivityLog";
import AccountLog from "./Admin/AccountLog/AccountLog";
import NotFoundPage from "./Pages/NotFoundPage";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    if (!userInfo && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [userInfo, navigate, location.pathname]);

  const isLoginPage = location.pathname === "/login";

  // Define pages where you want to exclude the height style
  const excludeHeightStylePages = ["/profile", "/activityLog", "/accountLog"];
  const shouldApplyHeightStyle = !excludeHeightStylePages.includes(
    location.pathname
  );

  return (
    <div
      className={`max-w-[1440px] mx-auto flex flex-col ${
        shouldApplyHeightStyle
          ? "xl:h-[150rem] lg:h-[150rem] md:h-[130rem]"
          : ""
      } bg-white`}
    >
      {!isLoginPage && <Header />}
      <main className="flex-grow bg-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/activityLog" element={<ActivityLog />} />
          <Route path="/accountLog" element={<AccountLog />} />
          {/* Catch-all route for 404 - NotFoundPage */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isLoginPage && <Footer />}
    </div>
  );
};

export default App;
