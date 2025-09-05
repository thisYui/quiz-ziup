import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import App from "../../App.jsx";
import { authApi } from '../../services/apiService.js';

export default function AuthLoader() {
    const navigate = useNavigate();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        (async () => {
            const res = await authApi.login();

            if (res && res.user_id) {
                const user_id = res.user_id;
                sessionStorage.setItem('user_id', user_id);
                navigate(`/user/${user_id}/home`);
            }

            setReady(true);
        })();
    }, []);

    if (!ready) return <div>Loading...</div>;
    return <App />;
}
