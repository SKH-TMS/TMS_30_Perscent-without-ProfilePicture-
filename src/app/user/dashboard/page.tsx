"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updatedFirstName, setUpdatedFirstName] = useState("");
  const [updatedLastName, setUpdatedLastName] = useState("");
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const data = await res.json();
        setUser(data.user);
        setUpdatedFirstName(data.user.firstName);
        setUpdatedLastName(data.user.lastName);
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
        router.push("/login"); // Redirect to login if unauthorized
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/auth/update-user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          firstName: updatedFirstName,
          lastName: updatedLastName,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update user");
      }

      const data = await res.json();
      setUser(data.user);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("❌ Error updating user:", error);
      alert("Failed to update profile. Try again.");
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match!");
      return;
    }
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          currentPassword,
          newPassword,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to change password");
      }

      alert("Password updated successfully!");
      setEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      console.error("❌ Error changing password:", error);
      alert("Failed to change password. Try again.");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
      } else {
        alert("Logged out successfully!");
        router.push("/login"); // Redirect to login
      }
    } catch (error) {
      console.error("❌ Error logging out:", error);
      alert("Failed to logout. Try again.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>Redirecting to login...</p>;
  }

  return (
    <div className="screenMiddleDiv">
      <div className="formDiv text-center">
        <h2 className="text-2xl font-bold">
          Welcome, {user.firstName} {user.lastName}!
        </h2>
        <p className="text-gray-600 mt-2">Email: {user.email}</p>
        <p className="text-gray-600 mt-2">Contact: {user.contact}</p>

        {editing ? (
          <div className="mt-4">
            <input
              type="text"
              value={updatedFirstName}
              onChange={(e) => setUpdatedFirstName(e.target.value)}
              className="formInput"
            />
            <input
              type="text"
              value={updatedLastName}
              onChange={(e) => setUpdatedLastName(e.target.value)}
              className="formInput mt-2"
            />
            <button onClick={handleUpdate} className="formButton mt-2">
              Save Changes
            </button>
            <button
              onClick={() => setEditing(false)}
              className="formButton mt-2"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <button onClick={() => setEditing(true)} className="formButton">
              Edit Profile
            </button>
          </div>
        )}

        {editingPassword ? (
          <div className="mt-4">
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="formInput"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="formInput mt-2"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="formInput mt-2"
            />
            <button onClick={handleChangePassword} className="formButton mt-2">
              Change Password
            </button>
            <button
              onClick={() => setEditingPassword(false)}
              className="formButton mt-2"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <button
              onClick={() => setEditingPassword(true)}
              className="formButton"
            >
              Change Password
            </button>
          </div>
        )}

        <div className="mt-4">
          <button onClick={handleLogout} className="formButton">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
