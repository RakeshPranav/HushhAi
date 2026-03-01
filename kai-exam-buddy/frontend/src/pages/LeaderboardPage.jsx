import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Trophy, Medal, ArrowLeft, Loader2, Crown } from 'lucide-react';
import api from '../api';

function LeaderboardPage() {
    const location = useLocation();
    const quizId = new URLSearchParams(location.search).get('quizId');
    const [board, setBoard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await api.get(`/quiz/${quizId}/leaderboard`);
                setBoard(res.data);
            } catch (err) {
                console.error("Failed to load leaderboard");
            }
            setLoading(false);
        };
        if (quizId) fetchLeaderboard();
    }, [quizId]);

    if (loading) return (
        <div className="flex-1 flex justify-center items-center min-h-[50vh]">
            <img src="/logo.png" alt="Loading" className="w-16 h-16 animate-pulse object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto py-12 animate-in fade-in slide-up duration-500">

            <Link to={-1} className="inline-flex items-center px-4 py-2 bg-slate-900/5 border border-slate-900/10 rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-900/10 mb-8 font-medium transition-all text-sm">
                <ArrowLeft className="w-4 h-4 mr-2" /> Return to Arena
            </Link>

            <div className="text-center mb-16 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-500/20 blur-[60px] rounded-full pointer-events-none"></div>

                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-500/30 text-yellow-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                    <Trophy className="w-10 h-10" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight uppercase">Global Rankings</h1>
                <p className="text-slate-600 mt-3 text-lg">The absolute best of the best.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400"></div>

                {board.length === 0 ? (
                    <div className="p-20 text-center flex flex-col items-center">
                        <Trophy className="w-16 h-16 text-slate-700 mb-4" />
                        <h3 className="text-2xl font-bold text-slate-500 mb-2">Throne is empty</h3>
                        <p className="text-slate-600">No attempts yet. Be the first to claim the #1 spot!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5 bg-slate-50/40">
                        {board.map((entry, idx) => {
                            const isFirst = idx === 0;
                            const isSecond = idx === 1;
                            const isThird = idx === 2;

                            return (
                                <div
                                    key={idx}
                                    className={`p-6 md:p-8 flex items-center justify-between transition-colors hover:bg-slate-900/5 relative overflow-hidden group
                    ${isFirst ? 'bg-gradient-to-r from-yellow-500/10 to-transparent' : ''}
                  `}
                                >
                                    {isFirst && <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>}
                                    {isSecond && <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-300"></div>}
                                    {isThird && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-600"></div>}

                                    <div className="flex items-center gap-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold font-mono text-2xl shadow-inner
                      ${isFirst ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-slate-900 shadow-yellow-500/50' :
                                                isSecond ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900' :
                                                    isThird ? 'bg-gradient-to-br from-orange-300 to-amber-600 text-slate-900' :
                                                        'bg-white border border-slate-900/5 text-slate-500'}
                    `}>
                                            {isFirst ? <Crown className="w-7 h-7" /> : idx + 1}
                                        </div>

                                        <span className={`font-bold text-xl tracking-wide ${isFirst ? 'text-yellow-600' : 'text-slate-200 group-hover:text-slate-900 transition-colors'}`}>
                                            {entry.user_name}
                                            {isFirst && <span className="ml-3 text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-md font-medium uppercase tracking-widest border border-yellow-500/30">Champion</span>}
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <div className={`text-4xl font-extrabold font-mono tracking-tighter
                      ${isFirst ? 'text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600' : 'text-slate-900'}`}>
                                            {entry.score}
                                        </div>
                                        <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Points</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default LeaderboardPage;
