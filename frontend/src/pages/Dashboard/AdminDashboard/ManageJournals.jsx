import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const ManageJournals = () => {
  const [journals, setJournals] = useState([
    {
      id: 1,
      title: "Science Today",
      category: "Science",
      price: 499,
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      title: "Tech World",
      category: "Technology",
      price: 599,
      createdAt: "2024-02-15",
    },
  ]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this journal?");
    if (confirmDelete) {
      setJournals(journals.filter((journal) => journal.id !== id));
    }
  };

  return (
    <div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Journals</h1>

        <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
          <FaPlus />
          Add Journal
        </button>
      </div>

 
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price (₹)</th>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {journals.map((journal) => (
              <tr key={journal.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 font-medium">{journal.title}</td>
                <td className="px-6 py-3">{journal.category}</td>
                <td className="px-6 py-3">₹{journal.price}</td>
                <td className="px-6 py-3">{journal.createdAt}</td>

                <td className="px-6 py-3 flex justify-center gap-4">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => handleDelete(journal.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {journals.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No journals available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageJournals;