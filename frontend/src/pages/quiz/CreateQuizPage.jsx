import React, { useState } from "react";
import { BGPattern } from "../../components/ui/BGPattern.jsx";
import { Navbar } from "../../components/home/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { quizApi } from "../../services/apiService.js";
import { QuizBasicInfoComponent, QuizPrivacySettingsComponent,
    QuizParticipantSettingsComponent, QuizTopicSelectorComponent,
    QuizFormActionsComponent } from "../../components/quiz/form/index.js";
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
    const navigator = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCodeExists(false);
        setCodeError('');

        if (code.length < 8) {
            setCodeError('Mã quiz phải có ít nhất 8 ký tự.');
            return;
        }

        const data = {
            user_id: sessionStorage.getItem('user_id'),
            code: code,
            description: description,
            title: title,
            is_private: isPrivate,
            max_participants: maxParticipants,
            topic: topic,
            key: isPrivate ? privateKey : null
        };

        const response = await quizApi.create(data);
        if (response.error) {
            setCodeExists(true);
            return;
        }

        const { quiz_id, quiz_slug } = response;
        sessionStorage.setItem('quiz_id', quiz_id);
        sessionStorage.setItem('quiz_slug', quiz_slug);
        navigator(`/quiz/${quiz_slug}/edit`);
    };

    const handleCancel = () => {
        navigator(`/user/${sessionStorage.getItem('user_id')}`);
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0D0D0D] text-white">
            <BGPattern variant="dots" mask="fade-edges" fill="#444444" size={32} />
            <Navbar />

            <form onSubmit={handleSubmit} className="pt-28 px-6 max-w-2xl mx-auto space-y-4">
                <h1 className="text-xl font-semibold mb-4">Tạo quiz</h1>

                <QuizBasicInfoComponent 
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    code={code}
                    setCode={setCode}
                    codeExists={codeExists}
                    codeError={codeError}
                    setCodeExists={setCodeExists}
                    setCodeError={setCodeError}
                />

                <QuizPrivacySettingsComponent 
                    isPrivate={isPrivate}
                    setIsPrivate={setIsPrivate}
                    privateKey={privateKey}
                    setPrivateKey={setPrivateKey}
                />

                <QuizParticipantSettingsComponent 
                    maxParticipants={maxParticipants}
                    setMaxParticipants={setMaxParticipants}
                />

                <QuizTopicSelectorComponent 
                    topic={topic}
                    setTopic={setTopic}
                />

                <QuizFormActionsComponent 
                    onCancel={handleCancel}
                />
            </form>
        </div>
    );
}
