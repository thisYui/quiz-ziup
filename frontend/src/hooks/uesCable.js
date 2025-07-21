import { useEffect, useRef, useState } from 'react';
import * as ActionCable from '@rails/actioncable';

function useCable(participantionId, quizId) {
    const [message, setMessages] = useState([]);
    const subscriptionRef = useRef(null);

    useEffect(() => {
        const cable = ActionCable.createConsumer(`ws://localhost:3000/cable?participantion_id=${participantionId}&quiz_id=${quizId}`);

        const subscription = cable.subscriptions.create(
            { channel: 'QuizChannel', participantion_id: participantionId, quiz_id: quizId },
            {
                connected() {
                    console.log('connected to QuizChannel');
                },
                disconnected() {
                    console.log('disconnected from QuizChannel');
                },
                received(data) {
                    setMessages(prev => [...prev, data]);
                },
            }
        );

        subscriptionRef.current = subscription;

        return () => {
            subscription.unsubscribe();
        };
    }, [participantionId, quizId]);

    return { subscriptionRef, message };
}

export default useCable;
