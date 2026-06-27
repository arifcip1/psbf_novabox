import React from 'react';

const StatusBadge = ({ status }) => {
    let colorClasses = '';

    switch (status) {
        case 'Aman':
            colorClasses = 'bg-emerald-500 text-white border-2 border-emerald-700 shadow-[2px_2px_0px_0px_rgba(4,120,87,1)]';
            break;
        case 'Butuh Re-stock':
            colorClasses = 'bg-amber-400 text-slate-900 border-2 border-amber-600 shadow-[2px_2px_0px_0px_rgba(217,119,6,1)]';
            break;
        case 'Habis':
            colorClasses = 'bg-rose-500 text-white border-2 border-rose-700 shadow-[2px_2px_0px_0px_rgba(190,18,60,1)]';
            break;
        default:
            colorClasses = 'bg-slate-300 text-slate-900 border-2 border-slate-500 shadow-[2px_2px_0px_0px_rgba(100,116,139,1)]';
    }

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colorClasses}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
