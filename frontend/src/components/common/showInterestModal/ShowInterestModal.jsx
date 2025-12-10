import { useState } from "react";

export default function ShowInterestModal({ onClose, onSend, isSending = false }) {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        const trimmed = message.trim();
        if (!trimmed) {
            window.alert("Please enter a message before sending.");
            return;
        }
        if (onSend) {
            onSend(trimmed);
        }
    };

    return (
        <div className="rent-modalOverlay">
            <div className="rent-modalContent">
                <h2>Show Interest</h2>
                <p>Your info and message will be received by the owner of this property. They will contact you as soon as possible.</p>

                <label htmlFor="interest-message">Message</label>
                <textarea
                    id="interest-message"
                    placeholder="Insert message here"
                    style={{ padding: "0.8rem", borderRadius: "10px", border: "1px solid #ccc", width: "100%", minHeight: "100px" }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSending}
                />

                <div className="rent-modalButtons">
                    <button className="rent-cancelButton" onClick={onClose} disabled={isSending}>Cancel</button>
                    <button className="rent-loginButton" onClick={handleSend} disabled={isSending}>
                        {isSending ? "Sending..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
}
