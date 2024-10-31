import React from 'react';
import { useAuth } from '../AuthContext';


const ProfileHeader = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        isAuthenticated && user && (
            <div className="bg-base-200 p-4 rounded-lg shadow-md w-3/4 flex flex-col text-center justify-center items-center">
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <p className="text-sm text-gray-600">{user.email}</p>
            </div>
        )
    );
};

export default ProfileHeader;
