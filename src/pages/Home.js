import React, { useEffect, useState } from 'react';
import ViewTodo from '../components/ViewTodo';
import AddToDo from '../components/AddToDo';
import UpdateTodo from '../components/UpdateTodo';

export default function Home() {
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [editTodo, setEditTodo] = useState(null);
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState('all');
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        const stored = localStorage.getItem('todos');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setTodos(parsed);
                    return;
                }
            } catch (err) {
                console.error('Failed to parse todos from localStorage', err);
            }
        }
        setTodos([]);
    }, []);

    useEffect(() => {
        if (todos.length > 0) {
            localStorage.setItem('todos', JSON.stringify(todos));
        }
    }, [todos]);

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800';
            case 'uncompleted':
                return darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800';
            case 'pending':
            default:
                return darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800';
        }
    };

    const getCardStyle = (status) => {
        if (darkMode) {
            switch (status) {
                case 'completed':
                    return 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-l-4 border-l-green-500';
                case 'uncompleted':
                    return 'bg-gradient-to-r from-red-900/50 to-rose-900/50 border-l-4 border-l-red-500';
                case 'pending':
                default:
                    return 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-l-4 border-l-blue-500';
            }
        }
        switch (status) {
            case 'completed':
                return 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500';
            case 'uncompleted':
                return 'bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-l-red-500';
            case 'pending':
            default:
                return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500';
        }
    };

    const handleViewTodo = (todo) => {
        setSelectedTodo(todo);
    };

    const handleBackToList = () => {
        setSelectedTodo(null);
    };

    const handleAddTodo = (newTodo) => {
        const todoToAdd = {
            ...newTodo,
            id: Date.now(),
            status: 'pending',
        };
        setTodos((prev) => [todoToAdd, ...prev])
        setShowAddModal(false);
    };

    const handleUpdateTodo = (updatedTodo) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === updatedTodo.id ? updatedTodo : todo
            )
        );
        setEditTodo(null);
    };

    const handleStatusChange = (todoId, newStatus) => {
       setTodos((prev) => 
            prev.map((todo) => (
                todo.id === todoId ? { ...todo, status: newStatus} : todo
            ))
        )
    };

    const handleToggleCompleted = (todoId) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const handleDeleteTodo = (todoId) => {
        setDeleteConfirm(todoId);
    };

    const confirmDelete = () => {
        if (deleteConfirm) {
            setTodos((prev) => prev.filter((todo) => todo.id !== deleteConfirm));
            setSelectedTodo(null);
            setDeleteConfirm(null);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm(null);
    };

    const filteredTodos = filter === 'all' 
        ? todos 
        : todos.filter(todo => todo.status === filter);

    return (
        <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>My Tasks</h1>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Keep track of your todos and stay organized</p>
                    </div>
                    <div className="flex items-center gap-3 justify-start sm:justify-end">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100 shadow'}`}
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>
                        <button
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow"
                            onClick={() => setShowAddModal(true)}
                        >
                            + Add Todo
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Tasks</p>
                        <p className="text-3xl font-bold text-blue-600 mt-2">{todos.length}</p>
                    </div>
                    <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completed</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">
                            {todos.filter(todo => todo.status === 'completed').length}
                        </p>
                    </div>
                    <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pending</p>
                        <p className="text-3xl font-bold text-orange-600 mt-2">
                            {todos.filter(todo => todo.status === 'pending').length}
                        </p>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === 'all'
                                ? 'bg-indigo-600 text-white'
                                : darkMode 
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                    >
                        All ({todos.length})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === 'pending'
                                ? 'bg-blue-600 text-white'
                                : darkMode 
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                    >
                        Pending ({todos.filter(t => t.status === 'pending').length})
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === 'completed'
                                ? 'bg-green-600 text-white'
                                : darkMode 
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                    >
                        Completed ({todos.filter(t => t.status === 'completed').length})
                    </button>
                    <button
                        onClick={() => setFilter('uncompleted')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === 'uncompleted'
                                ? 'bg-red-600 text-white'
                                : darkMode 
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                    >
                        Uncompleted ({todos.filter(t => t.status === 'uncompleted').length})
                    </button>
                </div>

                {/* Todos List */}
                <div className="space-y-4">
                    {filteredTodos.length === 0 ? (
                        <div className={`rounded-lg shadow p-8 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {todos.length === 0 
                                    ? 'No tasks yet. Create one to get started!' 
                                    : `No ${filter} tasks found.`}
                            </p>
                        </div>
                    ) : (
                        filteredTodos.map(todo => (
                            <div
                                key={todo.id}
                                className={`rounded-lg shadow hover:shadow-lg transition-all duration-300 p-4 sm:p-6 ${getCardStyle(todo.status)} ${todo.status === 'completed' ? 'opacity-75' : ''}`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`w-3 h-3 rounded-full flex-shrink-0 ${todo.status === 'completed' ? 'bg-green-500' : todo.status === 'uncompleted' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                                            <h3 className={`text-base sm:text-lg font-semibold ${todo.status === 'completed' ? 'line-through text-gray-500' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {todo.title}
                                        </h3>
                                        </div>
                                        {todo.description && (
                                            <p className={`text-sm mb-3 ${todo.status === 'completed' ? 'text-gray-500' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{todo.description}</p>
                                        )}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Due:</span>
                                            <span
                                                className={`text-xs sm:text-sm font-medium ${isOverdue(todo.dueDate)
                                                        ? darkMode ? 'text-red-400 bg-red-900/50 px-2 py-1 rounded' : 'text-red-600 bg-red-50 px-2 py-1 rounded'
                                                        : isToday(todo.dueDate)
                                                            ? darkMode ? 'text-orange-400 bg-orange-900/50 px-2 py-1 rounded' : 'text-orange-600 bg-orange-50 px-2 py-1 rounded'
                                                            : darkMode ? 'text-green-400 bg-green-900/50 px-2 py-1 rounded' : 'text-green-600 bg-green-50 px-2 py-1 rounded'
                                                    }`}
                                            >
                                                {formatDate(todo.dueDate)}
                                                {isOverdue(todo.dueDate) && ' (Overdue)'}
                                                {isToday(todo.dueDate) && ' (Today)'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                                        <div className="relative w-full sm:w-auto">
                                            <select
                                                value={todo.status || 'pending'}
                                                onChange={(e) => handleStatusChange(todo.id, e.target.value)}
                                                className={`w-full sm:w-auto rounded-lg px-3 py-2 text-sm font-medium cursor-pointer border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${getStatusColor(todo.status || 'pending')}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="completed">Completed</option>
                                                <option value="uncompleted">Uncompleted</option>
                                            </select>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-indigo-600
                                             text-white rounded-lg hover:bg-indigo-700 
                                             transition-colors text-sm font-medium" 
                                             onClick={() => handleViewTodo(todo)}>
                                                View
                                            </button>
                                            <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-amber-500
                                             text-white rounded-lg hover:bg-amber-600 
                                             transition-colors text-sm font-medium"
                                             onClick={() => setEditTodo(todo)}>
                                                Edit
                                            </button>
                                            <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-600
                                             text-white rounded-lg hover:bg-red-700 
                                             transition-colors text-sm font-medium"
                                             onClick={() => handleDeleteTodo(todo.id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
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
                            <ViewTodo todo={selectedTodo} onBack={handleBackToList} onToggleCompleted={handleToggleCompleted} onStatusChange={handleStatusChange} />
                        </div>
                    </div>
                )}

                {showAddModal && (
                    <div
                        className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm px-4 py-10"
                        onClick={() => setShowAddModal(false)}
                    >
                        <div
                            className="w-full max-w-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <AddToDo onAdd={handleAddTodo} onClose={() => setShowAddModal(false)} />
                        </div>
                    </div>
                )}

                {editTodo && (
                    <div
                        className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm px-4 py-10"
                        onClick={() => setEditTodo(null)}
                    >
                        <div
                            className="w-full max-w-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <UpdateTodo todo={editTodo} onUpdate={handleUpdateTodo} onClose={() => setEditTodo(null)} />
                        </div>
                    </div>
                )}

                {deleteConfirm && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
                        onClick={cancelDelete}
                    >
                        <div
                            className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                    <span className="text-red-600 text-2xl">!</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Todo</h3>
                                <p className="text-gray-600 mb-6">Are you sure you want to delete this todo? This action cannot be undone.</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={cancelDelete}
                                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
