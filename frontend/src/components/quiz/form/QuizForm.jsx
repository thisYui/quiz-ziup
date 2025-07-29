import React from "react";
import {
    QuizBasicInfoComponent,
    QuizPrivacySettingsComponent,
    QuizParticipantSettingsComponent,
    QuizTopicSelectorComponent,
    QuizFormActionsComponent
} from "./index.js";

export function QuizForm({
    title,
    setTitle,
    description,
    setDescription,
    code,
    setCode,
    codeExists,
    setCodeExists,
    codeError,
    setCodeError,
    maxParticipants,
    setMaxParticipants,
    isPrivate,
    setIsPrivate,
    privateKey,
    setPrivateKey,
    topic,
    setTopic,
    onSubmit,
    onCancel,
    submitButtonText = "Tạo",
    isSubmitting = false
}) {
    return (
        <form onSubmit={onSubmit} className="px-6 max-w-2xl mx-auto space-y-4">
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
                onCancel={onCancel}
                submitButtonText={submitButtonText}
                isSubmitting={isSubmitting}
            />
        </form>
    );
}
