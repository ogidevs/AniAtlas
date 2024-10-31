import React from 'react';
import { useAuth } from '../AuthContext';


const ProfileHeader = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        isAuthenticated && user && (
            <div className="bg-base-200 p-4 rounded-lg shadow-md w-3/4 flex flex-col text-center justify-center items-center">
                <figure className="flex items-center">
                      <img
                        src={`https://ui-avatars.com/api/?name=${user.username}`}
                        alt={user.username}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <fiurecaption className="text-2xl font-bold">{user.username}</fiurecaption>
                </figure>
                <p className="text-sm text-gray-600">{user.email}</p>
            </div>
        )
    );
};

export default ProfileHeader;
