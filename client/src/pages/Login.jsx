import React from 'react';
import Login from "../components/Login";
import Brand from "../components/Brand";
const LoginPage = () => {
  return (
    <>
        <Brand />
        <div className="fadeIn">
            <Login />
        </div>
    </>
  );
};

export default LoginPage;
