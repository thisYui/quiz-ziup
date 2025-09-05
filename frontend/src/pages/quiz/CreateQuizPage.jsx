import React, { useState } from "react";
import { BGPattern } from "../../components/ui/BGPattern.jsx";
import { Navbar } from "../../components/home/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { useQuizStore } from "../../hooks/useQuiz.js";
import { quizApi } from "../../services/apiService.js";
import { QuizForm } from "../../components/quiz/form/QuizForm";

export default function CreateQuizPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [code, setCode] = useState('');
    const [codeExists, setCodeExists] = useState(false);
    const [codeError, setCodeError] = useState('');
    const [maxParticipants, setMaxParticipants] = useState(10);
    const [isPrivate, setIsPrivate] = useState(false);
    const [privateKey, setPrivateKey] = useState('');
    const [topic, setTopic] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigator = useNavigate();
    const { setQuizData, setNeverStarted } = useQuizStore();

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

        const data = {
            owner_user_id: sessionStorage.getItem('user_id'),
            code: code,
            description: description,
            title: title,
            is_private: isPrivate,
            max_participants: maxParticipants,
            topic: topic,
            key: isPrivate ? privateKey : null
        };

        try {
            const response = await quizApi.create(data);
            if (response.error) {
                setCodeExists(true);
                setIsSubmitting(false);
                return;
            }

            const { quiz_id, quiz_slug } = response;
            sessionStorage.setItem('quiz_id', quiz_id);
            sessionStorage.setItem('quiz_slug', quiz_slug);

            data.quiz_id = quiz_id;
            data.quiz_slug = quiz_slug;

            setQuizData(data);
            setNeverStarted(true);

            navigator(`/quiz/${quiz_slug}/content`);
        } catch (error) {
            console.error('Error creating quiz:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigator(`/user/${sessionStorage.getItem('user_id')}/home`);
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0D0D0D] text-white">
            <BGPattern variant="dots" mask="fade-edges" fill="#444444" size={32} />
            <Navbar />

            <div className="pt-28 px-6 max-w-2xl mx-auto">
                <h1 className="text-xl font-semibold mb-4">Tạo quiz</h1>

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
                    submitButtonText="Tạo"
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
}
