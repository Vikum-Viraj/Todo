import React, { useEffect, useState } from 'react';
import ViewTodo from '../components/ViewTodo';
import AddToDo from '../components/AddToDo';

export default function Home() {
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState('all');

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
                return 'bg-green-100 text-green-800';
            case 'uncompleted':
                return 'bg-red-100 text-red-800';
            case 'pending':
            default:
                return 'bg-blue-100 text-blue-800';
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Tasks</h1>
                        <p className="text-gray-600">Keep track of your todos and stay organized</p>
                    </div>
                    <div className="flex justify-start sm:justify-end">
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
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
                        <p className="text-3xl font-bold text-blue-600 mt-2">{todos.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Completed</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">
                            {todos.filter(todo => todo.status === 'completed').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Pending</p>
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
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                    >
                        Uncompleted ({todos.filter(t => t.status === 'uncompleted').length})
                    </button>
                </div>

                {/* Todos List */}
                <div className="space-y-4">
                    {filteredTodos.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <p className="text-gray-500 text-lg">
                                {todos.length === 0 
                                    ? 'No tasks yet. Create one to get started!' 
                                    : `No ${filter} tasks found.`}
                            </p>
                        </div>
                    ) : (
                        filteredTodos.map(todo => (
                            <div
                                key={todo.id}
                                className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 ${todo.status === 'completed' ? 'opacity-60' : ''}`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className={`text-lg font-semibold mb-1 ${todo.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                            {todo.title}
                                        </h3>
                                        {todo.description && (
                                            <p className={`text-sm mb-3 ${todo.status === 'completed' ? 'text-gray-400' : 'text-gray-600'}`}>{todo.description}</p>
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
                                    <div className="flex gap-2 items-center">
                                        <div className="relative">
                                            <select
                                                value={todo.status || 'pending'}
                                                onChange={(e) => handleStatusChange(todo.id, e.target.value)}
                                                className={`rounded-lg px-3 py-2 text-sm font-medium cursor-pointer border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${getStatusColor(todo.status || 'pending')}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="completed">Completed</option>
                                                <option value="uncompleted">Uncompleted</option>
                                            </select>
                                        </div>
                                        <button className="px-4 py-2 bg-indigo-600
                                         text-white rounded-lg hover:bg-indigo-700 
                                         transition-colors text-sm font-medium" 
                                         onClick={() => handleViewTodo(todo)}>
                                            View
                                        </button>
                                        <button className="px-4 py-2 bg-red-600
                                         text-white rounded-lg hover:bg-red-700 
                                         transition-colors text-sm font-medium"
                                         onClick={() => handleDeleteTodo(todo.id)}>
                                            Delete
                                        </button>
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
