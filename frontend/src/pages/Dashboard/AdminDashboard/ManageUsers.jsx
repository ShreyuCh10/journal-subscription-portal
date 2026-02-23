import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../../Service/UserApi";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) return <div className="text-lg">Loading users...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <span className="text-gray-500 text-sm">
          Total Users: {users.length}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">ID</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Subscribed</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Interested</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm">
                  {user.subscribed ? (
                    <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                      Yes
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">
                      No
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {user.interested ? (
                    <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                      Yes
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs bg-gray-200 text-gray-700">
                      No
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;