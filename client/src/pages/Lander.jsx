import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';

const Lander = () => {
    const { t } = useTranslation();
    const navigateToLogin = () => {
        window.location.href = '/login';
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-white mb-4">{t('lander.welcome')}<span className="text-red-400">Ani</span><span className='text-white-500'>Atlas</span></h1>
                <p className="text-xl text-white mb-8">{t('lander.desc')}</p>
                <button className="btn btn-primary" onClick={navigateToLogin}>{t('lander.getStarted')}</button>
                <div className="flex justify-center m-4 space-x-4">
                    <LanguageToggle color="text-white" />
                    <ThemeToggle />
                </div>
            </div>
        </div>
    );
};

export default Lander;