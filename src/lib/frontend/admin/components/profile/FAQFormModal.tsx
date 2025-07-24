import { useEffect, useState } from "react";
import styles from "@/styles/admin.module.css"
import Modal from "../../../common/Modal";
export function FAQFormModal({
    onSave,
    onClose,
    initialData,
}: {
    onSave: (data: any) => void;
    onClose: () => void;
    initialData?: {
        question: string;
        answer: string;
    };
}) {
    const [question, setQuestion] = useState(initialData?.question || '');
    const [answer, setAnswer] = useState(initialData?.answer || '');
    const [errors, setErrors] = useState<{ question?: string; answer?: string }>({});
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const newErrors: typeof errors = {};
        if (!question.trim()) newErrors.question = 'Question is required.';
        if (!answer.trim()) newErrors.answer = 'Answer is required.';
        setErrors(newErrors);
        setIsValid(Object.keys(newErrors).length === 0);
    }, [question, answer]);

    const handleSave = () => {
        if (!isValid) return;
        onSave({ question: question.trim(), answer: answer.trim() });
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
                    />
                    {errors.question && <span className="errorText">{errors.question}</span>}
                </div>

                <div>
                    <textarea
                        className="input"
                        rows={3}
                        placeholder="Answer"
                        name="answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    />
                    {errors.answer && <span className="errorText">{errors.answer}</span>}
                </div>

                <div className={styles.saveButtonMain}>
                    <button className={`btn-primary ${styles.saveButton}`} onClick={handleSave} disabled={!isValid}>Save</button>
                </div>
            </div>
        </Modal>
    );
}
