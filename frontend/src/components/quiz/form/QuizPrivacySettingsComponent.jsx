import React from 'react';
import { InputField } from '../../ui/InputField.jsx';

export function QuizPrivacySettingsComponent({ isPrivate, setIsPrivate, privateKey, setPrivateKey }) {
    return (
        <>
            <div className="flex items-center gap-4">
                <label>Public</label>
                <input
                    type="checkbox"
                    checked={!isPrivate}
                    onChange={() => setIsPrivate(prev => !prev)}
                    className="w-5 h-5 accent-purple-500"
                />
            </div>

            {isPrivate && (
                <InputField
                    placeholder="Private key"
                    value={privateKey}
                    onChange={e => setPrivateKey(e.target.value)}
                    required
                />
            )}
        </>
    );
}