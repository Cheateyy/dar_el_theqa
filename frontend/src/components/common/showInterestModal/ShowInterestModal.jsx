import React from "react";

export default function ShowInterestModal({ onClose, onSend }) {
    return (
        <div className="rent-modalOverlay">
            <div className="rent-modalContent">
                <h2>Show Interest</h2>
                <p>Your info and message will be received by the owner of this property. They will contact you as soon as possible.</p>
                
                <label>Message</label>
                <textarea
                    placeholder="Insert message here"
                    style={{ padding: "0.8rem", borderRadius: "10px", border: "1px solid #ccc", width: "100%", minHeight: "100px" }}
                />

                <div className="rent-modalButtons">
                    <button className="rent-cancelButton" onClick={onClose}>Cancel</button>
                    <button className="rent-loginButton" onClick={onSend}>Send</button>
                </div>
            </div>
        </div>
    );
}
