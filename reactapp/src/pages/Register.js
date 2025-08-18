import React, { useState } from "react";
import { registerUser } from "../api";
import { validateEmail, validatePassword } from "../utils";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("CLIENT");

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateEmail(email) || !validatePassword(password)) {
            alert("Invalid email or password (min 6 characters).");
            return;
        }

        try {
            const newUser = await registerUser({ name, email, password, role });
            alert("Registration successful! Please login.");
            window.location.href = "/login";
        } catch (err) {
            if (err.response && err.response.data) {
                alert(err.response.data.message || "Registration failed.");
            } else {
                alert("Server not reachable.");
            }
        }
    };

    return (
        <div style={styles.container}>
            <form style={styles.form} onSubmit={handleRegister}>
                <h2 style={styles.title}>Create Account</h2>
                <p style={styles.subtitle}>Sign up to start hiring or freelancing</p>
                
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={styles.input}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password (min 6 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={styles.input}
                >
                    <option value="CLIENT">Client</option>
                    <option value="FREELANCER">Freelancer</option>
                </select>

                <button type="submit" style={styles.button}>
                    Register
                </button>

                <p style={styles.loginText}>
                    Already have an account?{" "}
                    <a href="/login" style={styles.loginLink}>
                        Login
                    </a>
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
        background: "#eef2f7",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    form: {
        background: "#fff",
        padding: "40px 35px",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        width: "360px",
        textAlign: "center",
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
    loginText: {
        marginTop: "15px",
        fontSize: "14px",
        color: "#555",
    },
    loginLink: {
        color: "#007BFF",
        textDecoration: "underline",
    },
};
