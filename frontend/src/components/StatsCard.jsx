import React from 'react';

const StatsCard = ({ title, value, icon: Icon, colorClass }) => {
    return (
        <div className={`overflow-hidden border-2 border-slate-900 rounded-2xl transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-1 hover:shadow-none ${colorClass}`}>
            <div className="p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                        <Icon className="h-8 w-8 text-white" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-bold text-white/90 uppercase tracking-wider truncate">{title}</dt>
                            <dd>
                                <div className="text-3xl font-black text-white tracking-tight mt-1">{value}</div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
