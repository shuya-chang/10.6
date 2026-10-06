import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PaperDetail = () => {
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [paper, setPaper] = useState(null);

    useEffect(() => {
        const fetchPaper = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/papers/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    setPaper(await res.json());
                } else {
                    navigate('/papers');
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchPaper();
    }, [id, token, navigate]);

    if (!paper) return <div className="text-center py-12 text-gray-500">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex space-x-2 mb-3">
                        <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-800">{paper.category}</span>
                        <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${paper.priority === 'High' ? 'bg-red-100 text-red-800' : paper.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{paper.priority}</span>
                        <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">{paper.status}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{paper.title}</h1>
                    <p className="text-lg text-gray-600">{paper.authors} ({paper.year})</p>
                </div>
                <div className="flex space-x-3">
                    <Link to={`/papers/${id}/edit`} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition">Edit</Link>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Reading Notes</h3>
                {paper.notes ? (
                    <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                        {paper.notes}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No notes added yet.</p>
                )}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 text-sm text-gray-400">
                Added on: {new Date(paper.created_at).toLocaleString()}
            </div>
        </div>
    );
};
export default PaperDetail;
