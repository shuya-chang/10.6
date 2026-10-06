import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { token, user } = useContext(AuthContext);
    const [papers, setPapers] = useState([]);
    const [stats, setStats] = useState({ total: 0, reading: 0, completed: 0, important: 0 });

    useEffect(() => {
        const fetchPapers = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/papers`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setPapers(data);
                    setStats({
                        total: data.length,
                        reading: data.filter(p => p.status === 'Reading').length,
                        completed: data.filter(p => p.status === 'Completed').length,
                        important: data.filter(p => p.priority === 'High').length
                    });
                }
            } catch (error) {
                console.error("Failed to fetch papers", error);
            }
        };
        fetchPapers();
    }, [token]);

    const StatCard = ({ title, value, color }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">{title}</h3>
            <span className={`text-4xl font-bold ${color}`}>{value}</span>
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
                <p className="mt-2 text-gray-600">Here's a quick overview of your reading progress.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Papers" value={stats.total} color="text-indigo-600" />
                <StatCard title="Reading" value={stats.reading} color="text-yellow-500" />
                <StatCard title="Completed" value={stats.completed} color="text-green-500" />
                <StatCard title="Important" value={stats.important} color="text-red-500" />
            </div>

            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Recent Papers</h2>
                    <Link to="/papers" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">View All &rarr;</Link>
                </div>
                
                <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
                    <ul className="divide-y divide-gray-200">
                        {papers.slice(0, 5).map((paper) => (
                            <li key={paper.id}>
                                <Link to={`/papers/${paper.id}`} className="block hover:bg-gray-50 transition-colors">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-indigo-600 truncate">{paper.title}</p>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {paper.status}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    {paper.authors}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                <p>{paper.category}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                        {papers.length === 0 && (
                            <li className="px-4 py-8 text-center text-gray-500">
                                No papers added yet. <Link to="/papers/new" className="text-indigo-600 hover:underline">Add your first paper</Link>.
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
