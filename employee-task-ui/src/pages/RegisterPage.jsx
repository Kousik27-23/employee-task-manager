import { useState } from "react";
import { authApi } from "../api";

export default function RegisterPage() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(0);

  const handleRegister = async () => {

    try {

      await authApi.register({
        username,
        email,
        password,
        role: Number(role)
      });

      alert("Registered Successfully ✅");

      window.location.href = "/login";

    } catch (err) {

      console.log(err);
      alert("Registration Failed ❌");

    }

  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #4facfe, #00f2fe)"
      }}
    >

      <div
        style={{
          width: "300px",
          padding: "25px",
          background: "white",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.2)"
        }}
      >

        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Register
        </h2>

        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "12px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "12px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "12px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />

        <select
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "12px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        >
          <option value="0">Admin</option>
          <option value="1">Manager</option>
          <option value="2">Employee</option>
        </select>

        <button
          onClick={handleRegister}
          style={{
            width: "100%",
            padding: "10px",
            background: "#4facfe",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Register
        </button>

      </div>

    </div>
  );
}