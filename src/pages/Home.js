import React, { useState } from 'react';
import ViewTodo from '../components/ViewTodo';

export default function Home() {
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [todos, setTodos] = useState([
        {
            id: 1,
            title: 'Complete project proposal',
            description: 'Finish writing the project proposal document and submit for review',
            dueDate: '2025-12-15'
        },
        {
            id: 2,
            title: 'Review pull requests',
            description: 'Check and approve pending pull requests from the team',
            dueDate: '2025-12-12'
        },
        {
            id: 3,
            title: 'Update documentation',
            description: '',
            dueDate: '2025-12-20'
        },
        {
            id: 4,
            title: 'Fix bug in login page',
            description: 'Users are reporting issues with password reset functionality',
            dueDate: '2025-12-13'
        },
        {
            id: 5,
            title: 'Schedule team meeting',
            description: '',
            dueDate: '2025-12-14'
        }
    ]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
    };

    const isToday = (dueDate) => {
        return new Date(dueDate).toDateString() === new Date().toDateString();
    };

    const handleViewTodo = (todo) => {
        setSelectedTodo(todo);
    };

    const handleBackToList = () => {
        setSelectedTodo(null);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Tasks</h1>
                    <p className="text-gray-600">Keep track of your todos and stay organized</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
                        <p className="text-3xl font-bold text-blue-600 mt-2">{todos.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Overdue</p>
                        <p className="text-3xl font-bold text-red-600 mt-2">
                            {todos.filter(todo => isOverdue(todo.dueDate)).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Due Today</p>
                        <p className="text-3xl font-bold text-orange-600 mt-2">
                            {todos.filter(todo => isToday(todo.dueDate)).length}
                        </p>
                    </div>
                </div>

                {/* Todos List */}
                <div className="space-y-4">
                    {todos.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <p className="text-gray-500 text-lg">No tasks yet. Create one to get started!</p>
                        </div>
                    ) : (
                        todos.map(todo => (
                            <div
                                key={todo.id}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                            {todo.title}
                                        </h3>
                                        {todo.description && (
                                            <p className="text-gray-600 text-sm mb-3">{todo.description}</p>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-gray-500">Due:</span>
                                            <span
                                                className={`text-sm font-medium ${isOverdue(todo.dueDate)
                                                        ? 'text-red-600 bg-red-50 px-2 py-1 rounded'
                                                        : isToday(todo.dueDate)
                                                            ? 'text-orange-600 bg-orange-50 px-2 py-1 rounded'
                                                            : 'text-green-600 bg-green-50 px-2 py-1 rounded'
                                                    }`}
                                            >
                                                {formatDate(todo.dueDate)}
                                                {isOverdue(todo.dueDate) && ' (Overdue)'}
                                                {isToday(todo.dueDate) && ' (Today)'}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 bg-indigo-600
                                     text-white rounded-lg hover:bg-indigo-700 
                                     transition-colors text-sm font-medium" 
                                     onClick={() => handleViewTodo(todo)}>
                                        View
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {selectedTodo && (
                    <div
                        className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm px-4 py-10"
                        onClick={handleBackToList}
                    >
                        <div
                            className="w-full max-w-3xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ViewTodo todo={selectedTodo} onBack={handleBackToList} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
