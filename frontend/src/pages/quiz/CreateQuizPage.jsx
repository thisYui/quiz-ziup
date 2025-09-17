import React, { useState } from "react";
import { BGPattern } from "../../components/ui/BGPattern.jsx";
import { Navbar } from "../../components/home/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { useQuizStore } from "../../hooks/useQuiz.js";
import { quizApi } from "../../services/apiService.js";
import { FancyInput } from "../../components/modal/inputText.jsx";
import { GlowEffect } from "../../components/ui/GlowEffect.jsx";

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

            <div className="pt-24 px-4 sm:px-6 max-w-3xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight">Tạo quiz</h1>
                    <p className="text-sm text-zinc-400 mt-1">Thiết lập thông tin cơ bản cho quiz của bạn.</p>
                </div>

                <div className="relative rounded-xl">
                    <div className="pointer-events-none absolute inset-0 rounded-xl">
                        <GlowEffect className="rounded-xl opacity-40" mode="rotate" blur="strong" scale={1.05} />
                        <div className="absolute inset-[2px] rounded-[0.75rem] bg-[#0D0D0D]" />
                    </div>
                    <form onSubmit={handleSubmit} className="relative z-10 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 sm:p-6 shadow-xl shadow-black/30 backdrop-blur">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-300">Tiêu đề</label>
                            <FancyInput name="title" label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tên quiz" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-300">Mã quiz</label>
                            <FancyInput name="code" label="Code" value={code} onChange={(e) => { setCode(e.target.value); setCodeExists(false); setCodeError(""); }} placeholder="Ít nhất 8 ký tự" />
                            {(codeError || codeExists) && (
                                <div className="text-xs mt-1 {codeExists ? 'text-amber-400' : 'text-red-400'}">
                                    {codeError || "Mã quiz đã tồn tại. Chọn mã khác."}
                                </div>
                            )}
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-sm text-zinc-300">Mô tả</label>
                            <textarea
                                className="input w-full min-h-[96px]"
                                placeholder="Mô tả ngắn về quiz"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-300">Chủ đề</label>
                            <FancyInput name="topic" label="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="VD: Lịch sử, Toán..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-300">Số người tham gia tối đa</label>
                            <FancyInput name="max" type="number" label="Max participants" value={maxParticipants} onChange={(e) => setMaxParticipants(Number(e.target.value))} />
                        </div>
                        <div className="sm:col-span-2 flex items-center justify-between rounded-lg border border-zinc-800 px-3 py-2">
                            <div>
                                <div className="text-sm text-zinc-200">Bảo mật bằng khóa riêng</div>
                                <div className="text-xs text-zinc-400">Chỉ ai có khóa mới có thể tham gia</div>
                            </div>
                            <label className="inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
                                <div className="w-10 h-6 bg-zinc-700 peer-checked:bg-purple-600 rounded-full relative transition">
                                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition peer-checked:translate-x-4" />
                                </div>
                            </label>
                        </div>
                        {isPrivate && (
                            <div className="space-y-2 sm:col-span-2">
                                <label className="text-sm text-zinc-300">Khóa riêng</label>
                                <FancyInput name="privateKey" label="Private key" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} placeholder="Nhập khóa để bảo vệ quiz" />
                            </div>
                        )}
                        </div>

                        <div className="mt-6 flex gap-3 justify-end">
                            <button type="button" onClick={handleCancel} className="px-4 py-2 rounded-lg text-sm bg-zinc-800 hover:bg-zinc-700 border border-zinc-700">Hủy</button>
                            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg text-sm bg-purple-600 hover:bg-purple-700 disabled:opacity-60">
                                {isSubmitting ? "Đang tạo..." : "Tạo"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
