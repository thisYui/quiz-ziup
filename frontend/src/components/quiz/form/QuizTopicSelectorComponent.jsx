import React from 'react';
import { TOPIC } from '../../../constants/index.js';

export function QuizTopicSelectorComponent({ topic, setTopic }) {
    return (
        <div>
            <label className="block mb-1">Topic</label>
            <select
                className="bg-black text-white border border-white p-2 rounded"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                required
            >
                <option value="">-- chọn chủ đề --</option>
                {Object.entries(TOPIC).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>
        </div>
    );
}