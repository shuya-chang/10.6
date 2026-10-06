import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PaperList = () => {
    const { token } = useContext(AuthContext);
    const [papers, setPapers] = useState([]);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    useEffect(() => {
        fetchPapers();
    }, [token]);

    const fetchPapers = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/papers`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setPapers(await res.json());
            }
        } catch (error) {
            console.error("Failed to fetch papers", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this paper?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/papers/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchPapers();
            } else {
                alert("Failed to delete paper");
            }
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const filteredPapers = papers.filter(p => {
        const matchSearch = (p.title + p.authors).toLowerCase().includes(search.toLowerCase());
        const matchCat = categoryFilter ? p.category === categoryFilter : true;
        const matchStatus = statusFilter ? p.status === statusFilter : true;
        const matchPriority = priorityFilter ? p.priority === priorityFilter : true;
        return matchSearch && matchCat && matchStatus && matchPriority;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Your Papers</h1>
                <Link to="/papers/new" className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition">
                    + Add Paper
                </Link>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                    type="text" placeholder="Search title or authors..."
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={search} onChange={e => setSearch(e.target.value)}
                />
                <select className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Explainable AI">Explainable AI</option>
                    <option value="Computer Vision">Computer Vision</option>
                    <option value="NLP">NLP</option>
                    <option value="Data Mining">Data Mining</option>
                    <option value="Other">Other</option>
                </select>
                <select className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="To Read">To Read</option>
                    <option value="Reading">Reading</option>
                    <option value="Completed">Completed</option>
                </select>
                <select className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                    <option value="">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPapers.map(paper => (
                    <div key={paper.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                        <div className="p-6 flex-grow">
                            <div className="flex justify-between items-start mb-4">
                                <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                    {paper.category}
                                </span>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${paper.priority === 'High' ? 'bg-red-100 text-red-800' : paper.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {paper.priority}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{paper.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{paper.authors} ({paper.year})</p>
                            <p className="text-sm font-medium text-gray-500">Status: {paper.status}</p>
                        </div>
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                            <Link to={`/papers/${paper.id}`} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">View Details</Link>
                            <div className="flex space-x-3">
                                <Link to={`/papers/${paper.id}/edit`} className="text-gray-500 hover:text-gray-700 text-sm">Edit</Link>
                                <button onClick={() => handleDelete(paper.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredPapers.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
                        No papers match your filters.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaperList;
