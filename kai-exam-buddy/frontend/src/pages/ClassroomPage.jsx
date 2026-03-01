import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Users, Plus, LogIn, Loader2, Play, Trophy, Copy, Check } from 'lucide-react';
import api from '../api';

function ClassroomPage() {
    const [createName, setCreateName] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const docId = new URLSearchParams(location.search).get('docId');

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!createName) return;
        setLoading(true);

        try {
            const classRes = await api.post('/classroom/', { name: createName });
            const classroomData = classRes.data;

            if (docId) {
                await api.post(`/ai/${docId}/generate-quiz`, null, {
                    params: { classroom_code: classroomData.code }
                });
            }

            navigate(`/classroom/${classroomData.code}`);
        } catch (err) {
            console.error(err);
            setError("Failed to create classroom.");
            setLoading(false);
        }
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        if (!joinCode) return;
        setLoading(true);
        try {
            await api.get(`/classroom/${joinCode}`);
            navigate(`/classroom/${joinCode}`);
        } catch (err) {
            setError("Classroom not found. Check the code.");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-12 animate-in fade-in slide-up duration-500">

            {/* Dynamic Header */}
            {!location.pathname.includes('/classroom/') && (
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-4 bg-purple-500/20 rounded-3xl mb-6 shadow-[0_0_30px_rgba(168,85,247,0.3)] border border-purple-500/30">
                        <Users className="w-10 h-10 text-purple-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Multiplayer Study Space</h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">Create a room to battle your friends in AI-generated quizzes, or join a professor's live session.</p>
                </div>
            )}

            {!location.pathname.includes('/classroom/') && (
                <div className="grid md:grid-cols-2 gap-10">

                    {/* Create Card */}
                    <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden group hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] transition-shadow">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/20 blur-[60px] rounded-full -mr-10 -mt-10"></div>

                        <div className="w-16 h-16 bg-primary-500/20 border border-primary-500/30 text-primary-600 rounded-2xl flex items-center justify-center mb-8">
                            <Plus className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">Create Arena</h2>
                        <p className="text-slate-600 mb-8">{docId ? "A test will be dynamically generated from your active document." : "Start a fresh room for your study group."}</p>

                        <form onSubmit={handleCreate} className="space-y-6 relative z-10">
                            <div>
                                <input
                                    type="text"
                                    value={createName}
                                    onChange={(e) => setCreateName(e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50/50 rounded-2xl border border-slate-900/10 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-slate-900 placeholder-slate-500 outline-none transition-all text-lg"
                                    placeholder="e.g. Bio 101 Midterm"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-primary-600 text-slate-900 font-bold rounded-xl hover:bg-primary-500 transition-colors flex justify-center items-center gap-3 text-lg"
                            >
                                {loading ? <img src="/logo.png" alt="Loading" className="w-6 h-6 animate-spin object-contain" /> : (docId ? "Deploy Arena & Quiz" : "Deploy Arena")}
                            </button>
                        </form>
                    </div>

                    {/* Join Card */}
                    <div className="glass-card rounded-[2.5rem] p-10 border-t-2 border-t-accent-500 relative overflow-hidden group hover:shadow-[0_0_40px_rgba(16,185,129,0.2)] transition-shadow">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-accent-500/20 blur-[60px] rounded-full -mr-10 -mt-10"></div>

                        <div className="w-16 h-16 bg-accent-500/20 border border-accent-500/30 text-accent-600 rounded-2xl flex items-center justify-center mb-8">
                            <LogIn className="w-8 h-8 ml-1" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">Join Arena</h2>
                        <p className="text-slate-600 mb-8">Enter a 6-character access code provided by the host.</p>

                        <form onSubmit={handleJoin} className="space-y-6 relative z-10">
                            <div>
                                <input
                                    type="text"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                    className="w-full px-6 py-4 bg-slate-50/50 rounded-2xl border border-slate-900/10 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 text-slate-900 placeholder-slate-600 outline-none transition-all text-center text-3xl font-mono tracking-[0.5em] uppercase"
                                    placeholder="CODE"
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-slate-900/5 border-2 border-slate-900/10 text-slate-900 hover:border-accent-500/50 hover:bg-accent-500/20 font-bold rounded-xl transition-all text-lg"
                            >
                                Enter Arena
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {error && (
                <div className="text-center mt-10 p-4 bg-red-900/40 border border-red-500/50 text-red-200 rounded-2xl max-w-lg mx-auto">
                    {error}
                </div>
            )}

            {location.pathname.split('/').length > 2 && <ClassroomDetails />}
        </div>
    );
}

function ClassroomDetails() {
    const { code } = useParams();
    const [classroom, setClassroom] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchClassroom = async () => {
            if (!code) return;
            try {
                const res = await api.get(`/classroom/${code}`);
                setClassroom(res.data);

                const qRes = await api.get(`/classroom/${code}/quizzes`);
                setQuizzes(qRes.data.quizzes);
            } catch (err) {
                console.error(err);
            }
        };
        fetchClassroom();
    }, [code]);

    const copyCode = () => {
        navigator.clipboard.writeText(classroom.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    if (!classroom) return (
        <div className="flex justify-center py-20">
            <img src="/logo.png" alt="Loading" className="w-16 h-16 animate-pulse object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
        </div>
    );

    return (
        <div className="animate-in fade-in zoom-in duration-500">

            {/* Classroom Hero */}
            <div className="glass-card rounded-[3rem] p-10 md:p-14 mb-12 relative overflow-hidden border border-slate-900/10 bg-white/50">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-slate-900 pointer-events-none"></div>
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/20 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="p-4 bg-slate-900/5 border border-slate-900/10 rounded-3xl mb-6 backdrop-blur-md">
                        <Users className="w-12 h-12 text-primary-600" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 uppercase tracking-wider">{classroom.name}</h2>

                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/40 p-2 pl-6 rounded-full border border-slate-900/10">
                        <span className="text-slate-600 font-medium">Invite Code:</span>
                        <span className="font-mono text-3xl font-bold text-accent-600 tracking-widest px-4">{classroom.code}</span>
                        <button
                            onClick={copyCode}
                            className={`p-3 rounded-full transition-colors flex items-center justify-center ${copied ? 'bg-green-500 text-slate-900' : 'bg-slate-900/10 hover:bg-slate-100/20 text-slate-900'}`}
                        >
                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Quizzes Section */}
            <div className="flex items-center justify-between mb-8 px-4">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-yellow-600" /> Live Exams
                </h3>
                <span className="px-4 py-1.5 bg-slate-900/5 rounded-full text-sm font-medium text-slate-700 border border-slate-900/10">
                    {quizzes.length} Available
                </span>
            </div>

            {quizzes.length === 0 ? (
                <div className="glass-card p-16 text-center rounded-[2.5rem] border border-slate-900/5 border-dashed">
                    <Trophy className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h4 className="text-2xl font-bold text-slate-500 mb-2">No active exams</h4>
                    <p className="text-slate-600">The host hasn't deployed any quizzes to this arena yet.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {quizzes.map((quiz, i) => (
                        <div key={quiz.id} className="glass-card rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-primary-500/50 transition-colors">

                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-900/10 flex items-center justify-center shadow-inner">
                                    <span className="text-2xl font-bold text-slate-700 group-hover:text-primary-600 transition-colors">#{i + 1}</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">Master Challenge #{i + 1}</h4>
                                    <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                        <span className="bg-slate-900/5 px-2.5 py-1 rounded-md">20 Questions</span>
                                        <span className="bg-slate-900/5 px-2.5 py-1 rounded-md">MCQ + Written</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-full md:w-auto gap-3">
                                <button
                                    onClick={() => navigate(`/classroom/${code}/leaderboard?quizId=${quiz.id}`)}
                                    className="flex-1 md:flex-none px-6 py-3.5 bg-slate-900/5 border border-slate-900/10 text-slate-900 rounded-xl hover:bg-slate-900/10 font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trophy className="w-4 h-4 text-yellow-500" /> Ranks
                                </button>
                                <button
                                    onClick={() => navigate(`/classroom/${code}/quiz/${quiz.id}`)}
                                    className="flex-1 md:flex-none px-8 py-3.5 bg-primary-600 text-slate-900 rounded-xl hover:bg-primary-500 font-bold shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2"
                                >
                                    <Play className="w-4 h-4 fill-current" /> Start
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ClassroomPage;
