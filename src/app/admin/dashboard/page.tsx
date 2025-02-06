"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/get-users", { method: "GET" });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUsers(data.users);
      } catch (error) {
        console.error("❌ Error fetching users:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Toggle Edit Mode
  const toggleEditUser = (user: User) => {
    setEditUserId(editUserId === user._id ? null : user._id);
    setEditData(user); // Populate fields with current data
  };

  // Handle Input Change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof User
  ) => {
    setEditData({ ...editData, [field]: e.target.value });
  };

  // Save Changes
  const handleSaveChanges = async () => {
    if (!editUserId) return;

    try {
      const res = await fetch(`/api/admin/update-user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: editUserId,
          firstName: editData.firstName,
          lastName: editData.lastName,
        }),
      });

      if (!res.ok) throw new Error("Failed to update user");

      alert("User information updated successfully!");
      setEditUserId(null);

      // Refresh Users
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === editUserId ? { ...user, ...editData } : user
        )
      );
    } catch (error) {
      console.error("❌ Error updating user:", error);
      alert("Failed to update user. Try again.");
    }
  };

  // Delete User
  const handleDeleteUser = async (email: string) => {
    try {
      const res = await fetch("/api/admin/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to delete user");

      setUsers((prevUsers) => prevUsers.filter((user) => user.email !== email));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting user:", error);
      alert("Failed to delete user. Try again.");
    }
  };

  // Logout Admin
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="screenMiddleDiv flex justify-center items-center min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Admin Dashboard
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Manage registered users
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow-lg bg-gray-50 rounded-lg">
            <thead className="bg-gray-200">
              <tr className="text-left">
                <th className="px-6 py-3 border text-gray-700">First Name</th>
                <th className="px-6 py-3 border text-gray-700">Last Name</th>
                <th className="px-6 py-3 border text-gray-700">Email</th>
                <th className="px-6 py-3 border text-center text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id || `user-${index + 10}`}
                  className={`border ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200 transition`}
                >
                  <td className="px-6 py-4 border text-gray-800">
                    {user.firstName}
                  </td>
                  <td className="px-6 py-4 border text-gray-800">
                    {user.lastName}
                  </td>
                  <td className="px-6 py-4 border text-gray-800">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 border text-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2"
                      onClick={() => toggleEditUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                      onClick={() => handleDeleteUser(user.email)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {editUserId && (
                <tr key={`edit-${editUserId || 10000}`}>
                  <td colSpan={4} className="p-4 bg-gray-100">
                    <div className="flex flex-col items-center">
                      <input
                        type="text"
                        value={editData.firstName || ""}
                        onChange={(e) => handleInputChange(e, "firstName")}
                        className="border p-2 rounded w-full mb-2"
                      />
                      <input
                        type="text"
                        value={editData.lastName || ""}
                        onChange={(e) => handleInputChange(e, "lastName")}
                        className="border p-2 rounded w-full mb-2"
                      />
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md mt-2"
                        onClick={handleSaveChanges}
                      >
                        Save
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleLogout}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded-md transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
