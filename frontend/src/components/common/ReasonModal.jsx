import { useEffect, useState } from "react";
import "./ReasonModal.css";

export default function ReasonModal({
    open,
    title = "Provide Details",
    description = "Please share a short note so we can keep the record clear.",
    label = "Reason (optional)",
    placeholder = "Write a short note...",
    confirmLabel = "Submit",
    cancelLabel = "Cancel",
    isSubmitting = false,
    requireReason = false,
    initialValue = "",
    onSubmit,
    onClose,
}) {
    const [reason, setReason] = useState(initialValue);
    const [error, setError] = useState("");

    useEffect(() => {
        if (open) {
            setReason(initialValue || "");
            setError("");
        }
    }, [open, initialValue]);

    if (!open) {
        return null;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const trimmed = reason.trim();
        if (requireReason && !trimmed) {
            setError("Please provide a reason before continuing.");
            return;
        }
        onSubmit?.(trimmed);
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose?.();
        }
    };

    return (
        <div className="reason-modal__backdrop" role="dialog" aria-modal="true">
            <div className="reason-modal__panel">
                <div className="reason-modal__header">
                    <h2>{title}</h2>
                    <button
                        type="button"
                        className="reason-modal__close"
                        aria-label="Close"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        X
                    </button>
                </div>
                {description && (
                    <p className="reason-modal__subtitle">{description}</p>
                )}
                <form onSubmit={handleSubmit}>
                    <label className="reason-modal__label" htmlFor="reason-modal-input">
                        {label}
                    </label>
                    <textarea
                        id="reason-modal-input"
                        className="reason-modal__textarea"
                        placeholder={placeholder}
                        value={reason}
                        onChange={(event) => {
                            setReason(event.target.value);
                            if (error) {
                                setError("");
                            }
                        }}
                        rows={5}
                        disabled={isSubmitting}
                    />
                    {error && <p className="reason-modal__error">{error}</p>}
                    <div className="reason-modal__actions">
                        <button
                            type="button"
                            className="reason-modal__button reason-modal__button--secondary"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            {cancelLabel}
                        </button>
                        <button
                            type="submit"
                            className="reason-modal__button reason-modal__button--primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? `${confirmLabel}...` : confirmLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
