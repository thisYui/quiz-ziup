import React from 'react';
import { InputField } from '../../ui/InputField.jsx';
import { ErrorMessage } from '../../ui/ErrorMessage.jsx';

export function QuizBasicInfoComponent({
                                           title,
                                           setTitle,
                                           description,
                                           setDescription,
                                           code,
                                           setCode,
                                           codeExists,
                                           codeError,
                                           setCodeExists,
                                           setCodeError
                                       }) {
    const handleCodeChange = (e) => {
        const newCode = e.target.value;
        setCode(newCode);
        setCodeExists(false);
        if (newCode.length > 0 && newCode.length < 8) {
            setCodeError('Mã quiz phải có ít nhất 8 ký tự.');
        } else {
            setCodeError('');
        }
    };

    return (
        <>
            <InputField
                placeholder="Quiz title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
            />

            <InputField
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
            />

            <InputField
                placeholder="Code (ít nhất 8 ký tự)"
                value={code}
                onChange={handleCodeChange}
                required
            />

            {codeExists && <ErrorMessage message="Mã quiz đã tồn tại. Vui lòng chọn mã khác." />}
            {codeError && <ErrorMessage message={codeError} />}
        </>
    );
}