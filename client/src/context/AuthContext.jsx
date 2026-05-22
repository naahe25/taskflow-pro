import {
    createContext,
    useEffect,
    useState
} from "react";

import { loginSuccess }
    from "../services/authService";

export const AuthContext =
    createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const tokenFromQuery = urlParams.get("token");

                // If token is provided by the callback redirect, trust it and skip /login/success.
                if (tokenFromQuery) {
                    localStorage.setItem("token", tokenFromQuery);

                    // Decode JWT to get avatar (and id if needed) so Navbar shows profile image.
                    // JWT payload is base64url-encoded.
                    try {
                        const payloadPart = tokenFromQuery.split(".")[1];
                        if (payloadPart) {
                            const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
                            const json = decodeURIComponent(
                                atob(base64)
                                    .split("")
                                    .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
                                    .join("")
                            );
                            const payload = JSON.parse(json);

                            setUser({
                                name: "",
                                role: "",
                                avatar: payload?.avatar,
                            });
                            return;
                        }
                    } catch (e) {
                        console.log(e);
                    }

                    setUser({
                        name: "",
                        role: "",
                        avatar: undefined,
                    });
                    return;
                }


                // Keep user as-is; avoid calling /auth/login/success.
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };


        fetchUser();
    }, []);



    return (

        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading
            }}
        >

            {children}

        </AuthContext.Provider>
    );
};

export default AuthProvider;