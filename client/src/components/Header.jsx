import React from 'react';
import ThemeToggle from './ThemeToggle';
import ProfileHeader from './ProfileHeader';
import LanguageToggle from './LanguageToggle';
import { CiLogout } from 'react-icons/ci';

const Header = ({ logout, isAuthenticated }) => {
    return (
        <div className="flex justify-between space-x-4 my-2">
            <div className="flex flex-start flex-wrap text-center justify-center items-center">
                <ThemeToggle />
            </div>
            <ProfileHeader />
            <div className="flex flex-end flex-wrap text-center justify-center items-center">
                <LanguageToggle />
                <CiLogout
                    onClick={logout}
                    className="text-lg cursor-pointer m-2 transition duration-300 ease-in-out transform hover:scale-110 self-center text-red-500 text-center"
                    hidden={!isAuthenticated}
                />
            </div>
        </div>
    );
};

export default Header;