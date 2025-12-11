import React from 'react';

const ViewTodo = ({ todo, onBack, onStatusChange }) => {

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const isToday = (dueDate) => {
    return new Date(dueDate).toDateString() === new Date().toDateString();
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'uncompleted':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const currentTodo = todo;

  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(currentTodo.id, newStatus);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
      <div className="px-6 pt-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500 mb-2">Task Detail</p>
          <h1 className="text-2xl font-bold text-gray-900">{currentTodo.title}</h1>
        </div>
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 transition-colors text-2xl leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 mt-4">
        <div className="flex items-center gap-3">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(currentTodo.status || 'pending')}`}
          >
            {currentTodo.status === 'completed'
              ? '✓ Completed'
              : currentTodo.status === 'uncompleted'
              ? '✗ Uncompleted'
              : 'Pending'}
          </span>
          <span className="text-white/80 text-sm">Task ID: #{currentTodo.id}</span>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Description
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            {currentTodo.description || (
              <span className="text-gray-400 italic">No description provided</span>
            )}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Due Date
          </h2>
          <div className={`p-4 rounded-lg ${
            currentTodo.status === 'completed'
              ? 'bg-green-50 border border-green-200'
              : isOverdue(currentTodo.dueDate)
              ? 'bg-red-50 border border-red-200'
              : isToday(currentTodo.dueDate)
              ? 'bg-orange-50 border border-orange-200'
              : 'bg-blue-50 border border-blue-200'
          }`}>
            <p className={`text-lg font-semibold ${
              currentTodo.status === 'completed'
                ? 'text-green-900'
                : isOverdue(currentTodo.dueDate)
                ? 'text-red-900'
                : isToday(currentTodo.dueDate)
                ? 'text-orange-900'
                : 'text-blue-900'
            }`}>
              {formatDate(currentTodo.dueDate)}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Status
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <select
                value={currentTodo.status || 'pending'}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${getStatusBadgeColor(currentTodo.status || 'pending')}`}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="uncompleted">Uncompleted</option>
              </select>
            </div>
            <p className="text-xs text-gray-600">Current Status: <span className="font-semibold">{currentTodo.status === 'completed' ? 'Completed' : currentTodo.status === 'uncompleted' ? 'Uncompleted' : 'Pending'}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTodo;
