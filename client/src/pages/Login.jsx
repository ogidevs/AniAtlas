import React from 'react';
import Login from "../components/Login";
import Brand from "../components/Brand";
import LanguageToggle from "../components/LanguageToggle";
import ThemeToggle from "../components/ThemeToggle";
const LoginPage = () => {
  return (
    <>
        <Brand />
        <div className="fadeIn">
            <Login />
            <div className="flex justify-center m-4 space-x-4">
              <LanguageToggle color="text-white" />
              <ThemeToggle />
            </div>
        </div>
    </>
  );
};

export default LoginPage;
