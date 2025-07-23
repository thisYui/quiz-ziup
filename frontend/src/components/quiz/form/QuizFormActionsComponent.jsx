import React from 'react';
import { Button } from '../../ui/button.jsx';

export function QuizFormActionsComponent({ onCancel }) {
    return (
        <div className="flex gap-4 pt-4">
            <Button type="button" className="bg-red-500 hover:bg-red-600" onClick={onCancel}>
                Hủy
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Xác nhận
            </Button>
        </div>
    );
}