import React, { useState } from 'react';

export default function AddToDo({ onAdd, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.title.trim()) {
      nextErrors.title = 'Title is required';
    }
    if (!formData.dueDate) {
      nextErrors.dueDate = 'Due date is required';
    } else if (Number.isNaN(Date.parse(formData.dueDate))) {
      nextErrors.dueDate = 'Enter a valid date';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onAdd({
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate,
    });

    setFormData({ title: '', description: '', dueDate: '' });
    setErrors({});
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Add Todo</h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">Title *</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter todo title"
          />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Optional description"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="dueDate">Due Date *</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.dueDate ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.dueDate && <p className="text-red-600 text-sm mt-1">{errors.dueDate}</p>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Add Todo
          </button>
        </div>
      </form>
    </div>
  );
}
