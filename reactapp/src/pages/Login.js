import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import { validateEmail, validatePassword } from "../utils";

export default function Login({ setToken, setRole }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateEmail(email) || !validatePassword(password)) {
            setError("Please enter a valid email and password (min 6 characters).");
            return;
        }

        setLoading(true);
        try {
            const userData = await loginUser({ email, password });

            if (userData.token) {
                localStorage.setItem("token", userData.token);
                setToken(userData.token);
            }
            if (userData.role) {
                localStorage.setItem("role", userData.role.toUpperCase());
                setRole(userData.role.toUpperCase());
            }
            if (userData.id) localStorage.setItem("userId", userData.id);

            const roleUpper = (userData.role || "").toUpperCase();
            if (roleUpper === "ADMIN") navigate("/manage-users", { replace: true });
            else if (roleUpper === "CLIENT") navigate("/dashboard", { replace: true });
            else if (roleUpper === "FREELANCER") navigate("/freelancer-dashboard", { replace: true });
            else navigate("/login", { replace: true });

        } catch (err) {
            console.error("Login failed:", err);
            setError("Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form style={styles.form} onSubmit={handleLogin}>
                <h2 style={styles.title}>Welcome Back</h2>
                <p style={styles.subtitle}>Sign in to access your dashboard</p>
                {error && <p style={styles.error}>{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
                <p style={styles.registerText}>
                    No account?{" "}
                    <span
                        style={styles.registerLink}
                        onClick={() => navigate("/register")}
                    >
                        Register here
                    </span>
                </p>
            </form>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#eef2f7", // light professional background
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    form: {
        background: "#fff",
        padding: "40px 35px",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        width: "360px",
        textAlign: "center",
        transition: "transform 0.2s",
    },
    title: {
        marginBottom: "8px",
        color: "#333",
        fontSize: "26px",
        fontWeight: "600",
    },
    subtitle: {
        marginBottom: "20px",
        color: "#555",
        fontSize: "14px",
    },
    input: {
        width: "100%",
        padding: "12px",
        margin: "10px 0",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "14px",
        outline: "none",
        transition: "0.3s",
    },
    button: {
        width: "100%",
        padding: "12px",
        marginTop: "15px",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "500",
        transition: "0.3s",
    },
    error: { color: "red", fontSize: "14px", marginBottom: "10px" },
    registerText: { marginTop: "15px", fontSize: "14px", color: "#555" },
    registerLink: { color: "#007BFF", cursor: "pointer", textDecoration: "underline" },
};
