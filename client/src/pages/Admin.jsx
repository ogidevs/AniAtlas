import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import { API_URL } from "../config";

const Admin = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const [userData, setUserData] = useState(null);
    const [commentData, setCommentData] = useState(null);
    
    useEffect(() => {
        if (!user) return;
        if (!user.admin) {
            navigate('/home');
        }
    }
    , [user]);

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}/user/all`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.status === 200) {
                setUserData(response.data.data);
                toast.success(t("admin.fetchUsersSuccess"));
            } else {
                throw response;
            }
        } catch (error) {
            toast.error(t("admin.fetchUsersError"));
            console.error(error);
        }
    }

    const disableUser = async (id) => {
        try {
            const response = await axios.put(`${API_URL}/user/${id}/disable`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.status === 200) {
                fetchAllUsers();
                toast.success(t("admin.disableUserSuccess"));
            } else {
                throw response;
            }
        } catch (error) {
            toast.error(t("admin.disableUserError"));
            console.error(error);
        }
    }

    const enableUser = async (id) => {
        try {
            const response = await axios.put(`${API_URL}/user/${id}/enable`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.status === 200) {
                fetchAllUsers();
                toast.success(t("admin.enableUserSuccess"));
            } else {
                throw response;
            }
        } catch (error) {
            console.error(error);
            toast.error(t("admin.enableUserError"));
        }
    }

    const fetchUserComments = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/comment/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.status === 200) {
                setCommentData(response.data.data);
                toast.success(t("admin.fetchCommentsSuccess"));
            } else {
                throw response;
            }
        } catch (error) {
            console.error(error);
            toast.error(t("admin.fetchCommentsError"));
        }
    }

    const deleteUserComment = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/comment/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.status === 200) {
                fetchUserComments(user.id);
                toast.success(t("admin.deleteCommentSuccess"));
            } else {
                throw response;
            }
        } catch (error) {
            console.error(error);
            toast.error(t("admin.deleteCommentError"));
        }
    }

    return (
        <div className="container mx-auto px-4">
            <Header logout={logout} isAuthenticated={isAuthenticated} />
            <div className="container mx-auto py-8">
                <a href="/home" className="text-blue-500 hover:underline">{t("brand")}</a>
                <h1 className="text-3xl font-bold mb-4">{t("admin.title")}</h1>
                {user && user.admin && (
                    <>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out transform hover:scale-105" onClick={fetchAllUsers}>
                            {t("admin.fetchUsers")}
                        </button>
                        {userData && (
                            <div className="mt-6">
                                <h2 className="text-2xl font-semibold mb-4">{t("admin.users")}</h2>
                                <ul className="space-y-4">
                                    {userData.map((user) => (
                                        <li key={user.id} className="p-4 rounded-lg shadow-md">
                                            <p className="text-lg font-medium"><strong>{t("admin.user.username")}:</strong> {user.username}</p>
                                            <p className="text-lg font-medium"><strong>{t("admin.user.email")}:</strong> {user.email}</p>
                                            <p className="text-lg font-medium"><strong>{t("admin.user.admin")}:</strong> {user.admin ? t('yes') : t('no')}</p>
                                            <p className="text-lg font-medium"><strong>{t("admin.user.disabled")}:</strong> {user.disabled ? t('yes') : t('no')}</p>
                                            <p className="text-lg font-medium"><strong>{t("admin.user.createdAt")}:</strong> {new Intl.DateTimeFormat("en-GB").format(new Date(user.created_at))}</p>
                                            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow-md m-4 transition duration-300 ease-in-out transform hover:scale-105" onClick={() => disableUser(user.id)}>{t("admin.user.disable")}</button>
                                            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow-md m-4 transition duration-300 ease-in-out transform hover:scale-105" onClick={() => enableUser(user.id)}>{t("admin.user.enable")}</button>
                                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow-md m-4 transition duration-300 ease-in-out transform hover:scale-105" onClick={() => {fetchUserComments(user.id); document.getElementById('user_comments_modal').showModal();}}>{t("admin.fetchComments")}</button>
                                        </li>
                                    ))}
                                </ul>
                                <dialog id="user_comments_modal" className="modal">
                                    <div className="modal-box">
                                        <h2 className="text-2xl font-semibold mb-4">{t("admin.fetchComments")}</h2>
                                        <ul className="space-y-4">
                                            {commentData && commentData.map((comment) => (
                                                <li key={comment.id} className="p-4 rounded-lg shadow-md">
                                                    <p className="text-lg font-medium"><strong>{t("admin.comment.content")}:</strong> {comment.content}</p>
                                                    <p className="text-lg font-medium"><strong>{t("admin.comment.user")}:</strong> {comment.username}</p>
                                                    <p className="text-lg font-medium"><strong>{t("admin.comment.anime")}:</strong> <a className="text-lg font-medium text-blue-500 hover:underline" href={`/anime/${comment.anime_id}`} target="_blank">{comment.anime_id}</a></p>
                                                    
                                                    <p className="text-lg font-medium"><strong>{t("admin.comment.createdAt")}:</strong> {new Intl.DateTimeFormat("en-GB").format(new Date(comment.created_at))}</p>
                                                    <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow-md m-4 transition duration-300 ease-in-out transform hover:scale-105" onClick={() => deleteUserComment(comment.id)}>{t("admin.comment.delete")}</button>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="modal-action">
                                            <form method="dialog">
                                                <button className="btn">{t("admin.closeModal")}</button>
                                            </form>
                                        </div>
                                    </div>
                                </dialog>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Admin;
