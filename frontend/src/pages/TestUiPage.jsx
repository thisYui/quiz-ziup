import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

export default function TestUiPage() {
    const STORAGE_KEY = 'test-ui-done';
    const links = useMemo(() => ([
        { label: 'Home', to: '/' },
        { label: 'Auth / Login', to: '/auth/login' },
        { label: 'Auth / Register', to: '/auth/register' },
        { label: 'Account / Home', to: '/account/1/home' },
        { label: 'Account / Setting', to: '/account/1/setting' },
        { label: 'Account / Owner', to: '/account/1/owner' },
        { label: 'Quiz / Create', to: '/quiz/create' },
        { label: 'Quiz / Content', to: '/quiz/123/content' },
        { label: 'Quiz / Edit', to: '/quiz/123/edit' },
        { label: 'Quiz / Lobby', to: '/quiz/123/lobby' },
        { label: 'Quiz / Play', to: '/quiz/123/play' },
        { label: 'Quiz / Result', to: '/quiz/123/result' },
        { label: 'Quiz / Final', to: '/quiz/123/final' }
    ]), []);

    const [done, setDone] = useState(() => new Set());

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setDone(new Set(JSON.parse(raw)));
        } catch (_) {}
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(done)));
        } catch (_) {}
    }, [done]);
    const total = links.length;
    const doneCount = done.size;

    function toggle(id) {
        setDone(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    return (
        <div className="min-h-screen p-6 space-y-4">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Test UI (No Auth)</h1>
                    <p className="text-sm text-gray-600">Quick links to view current UI without authentication.</p>
                </div>
                <div className="text-sm">
                    <span className="font-semibold">Done:</span> {doneCount}/{total}
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {links.map((item, idx) => (
                    <label key={item.to} className="flex items-center gap-3 rounded border p-3">
                        <input
                            type="checkbox"
                            checked={done.has(idx)}
                            onChange={() => toggle(idx)}
                        />
                        <Link className="btn" to={item.to}>{item.label}</Link>
                    </label>
                ))}
            </div>
        </div>
    );
}


