import React from 'react';

const Lander = () => {
    const navigateToLogin = () => {
        window.location.href = '/login';
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-white mb-4">Welcome to <span className="text-red-400">Ani</span><span className='text-white-500'>Atlas</span></h1>
                <p className="text-xl text-white mb-8">Your ultimate anime guide</p>
                <button className="btn btn-primary" onClick={navigateToLogin}>Get Started</button>
            </div>
        </div>
    );
};

export default Lander;