'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/admin.module.css';
import Modal from '../../../common/Modal';
import type { FAQ } from '@/lib/frontend/types/form';
import { useToast } from '@/lib/frontend/common/ToastProvider';

type Props = {
    onSave: (data: FAQ) => void;
    onClose: () => void;
    initialData?: FAQ;
};

export function FAQFormModal({ onSave, onClose, initialData }: Props) {
    const { showToast } = useToast();

    const [question, setQuestion] = useState<string>(initialData?.question ?? '');
    const [answer, setAnswer] = useState<string>(initialData?.answer ?? '');
    const [errors, setErrors] = useState<{ question?: string; answer?: string }>({});
    const [isValid, setIsValid] = useState<boolean>(false);

    useEffect(() => {
        const next: { question?: string; answer?: string } = {};
        const q = question.trim();
        const a = answer.trim();

        if (!q) next.question = 'Question is required.';
        else if (q.length < 4) next.question = 'Question must be at least 4 characters.';
        else if (q.length > 120) next.question = 'Question must be 120 characters or less.';

        if (!a) next.answer = 'Answer is required.';
        else if (a.length < 8) next.answer = 'Answer must be at least 8 characters.';
        else if (a.length > 600) next.answer = 'Answer must be 600 characters or less.';

        setErrors(next);
        setIsValid(Object.keys(next).length === 0);
    }, [question, answer]);

    const handleSave = () => {
        if (!isValid) {
            showToast('Please fix the errors before saving.', 'error');
            return;
        }
        const data: FAQ = {
            id: initialData?.id ?? `faq-${Date.now()}`,
            question: question.trim(),
            answer: answer.trim(),
        };
        onSave(data);
        showToast(initialData ? 'FAQ updated' : 'FAQ added', 'success');
    };

    return (
        <Modal title={initialData ? 'Edit FAQ' : 'Add FAQ'} onClose={onClose} width="500px">
            <div className="flex flex-col gap-4">
                <div>
                    <input
                        className="input"
                        placeholder="Question"
                        name="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onBlur={(e) => setQuestion(e.target.value.trim())}
                        maxLength={120}
                    />
                    {errors.question && <span className="errorText">{errors.question}</span>}
                </div>

                <div>
                    <textarea
                        className="input"
                        rows={4}
                        placeholder="Answer"
                        name="answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        onBlur={(e) => setAnswer(e.target.value.trim())}
                        maxLength={600}
                    />
                    {errors.answer && <span className="errorText">{errors.answer}</span>}
                </div>

                <div className={styles.saveButtonMain}>
                    <button className={`btn-primary ${styles.saveButton}`} onClick={handleSave} disabled={!isValid}>
                        Save
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default FAQFormModal;
