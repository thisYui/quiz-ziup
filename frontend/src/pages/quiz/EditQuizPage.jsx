import React, { useState } from "react";
import { BGPattern } from "../../components/ui/BGPattern.jsx";
import { Navbar } from "../../components/home/Navbar.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { quizApi } from "../../services/apiService.js";
import { useQuizStore } from "../../hooks/useQuiz.js";
import { QuizForm } from "../../components/quiz/form/QuizForm";

export default function EditQuizPage() {
    const quizData = useQuizStore(state => state.quizData);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [title, setTitle] = useState(quizData.title || '');
    const [description, setDescription] = useState(quizData.description || '');
    const [code, setCode] = useState(quizData.code || '');
    const [codeExists, setCodeExists] = useState(false);
    const [codeError, setCodeError] = useState('');
    const [maxParticipants, setMaxParticipants] = useState(quizData.max_participants || 10);
    const [isPrivate, setIsPrivate] = useState(quizData.is_private || false);
    const [privateKey, setPrivateKey] = useState(quizData.key || '');
    const [topic, setTopic] = useState(quizData.topic || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCodeExists(false);
        setCodeError('');
        setIsSubmitting(true);

        if (code.length < 8) {
            setCodeError('Mã quiz phải có ít nhất 8 ký tự.');
            setIsSubmitting(false);
            return;
        }

        const promises = [];
        const quizId = quizData.id;
        const newQuizData = { ...quizData };

        if (title !== quizData.title) {
            promises.push(quizApi.update_title(quizId, title));
            newQuizData.title = title;
        }
        if (description !== quizData.description) {
            promises.push(quizApi.update_description(quizId, description));
            newQuizData.description = description;
        }
        if (code !== quizData.code) {
            promises.push(quizApi.update_code(quizId, code));
            newQuizData.code = code;
        }
        if (maxParticipants !== quizData.max_participants) {
            promises.push(quizApi.update_max_participants(quizId, maxParticipants));
            newQuizData.max_participants = maxParticipants;
        }
        if ((isPrivate && privateKey !== quizData.key) || (!isPrivate && quizData.key)) {
            promises.push(quizApi.update_key(quizId, isPrivate ? privateKey : ""));
            newQuizData.is_private = isPrivate;
            newQuizData.key = privateKey;
        }
        if (topic !== quizData.topic) {
            promises.push(quizApi.update_topic(quizId, topic));
            newQuizData.topic = topic;
        }

        try {
            await Promise.all(promises);
            useQuizStore.getState().setQuizData(newQuizData);
            navigate(`/quiz/${quizId}/content`);
        } catch (err) {
            if (err.response?.status === 409) {
                setCodeExists(true);
                setCodeError("Mã code đã tồn tại.");
            } else {
                console.error("Lỗi khi cập nhật quiz:", err);
                setCodeError("Đã xảy ra lỗi trong quá trình cập nhật.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0D0D0D] text-white">
            <BGPattern variant="dots" mask="fade-edges" fill="#444444" size={32} />
            <Navbar />

            <div className="pt-28 px-6 max-w-2xl mx-auto">
                <h1 className="text-xl font-semibold mb-4">Chỉnh sửa quiz</h1>

                <QuizForm
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    code={code}
                    setCode={setCode}
                    codeExists={codeExists}
                    setCodeExists={setCodeExists}
                    codeError={codeError}
                    setCodeError={setCodeError}
                    maxParticipants={maxParticipants}
                    setMaxParticipants={setMaxParticipants}
                    isPrivate={isPrivate}
                    setIsPrivate={setIsPrivate}
                    privateKey={privateKey}
                    setPrivateKey={setPrivateKey}
                    topic={topic}
                    setTopic={setTopic}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    submitButtonText="Cập nhật"
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
}
