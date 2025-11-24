export default function LoginModal({ show, onClose }) {
    if (!show) return null; 

    return (
        <div className="sell-modalOverlay">
            <div className="sell-modalContent">
                <h2>Welcome Back</h2>
                <p>You need to log in first</p>

                <label>Email</label>
                <input type="email" placeholder="user@mail.com" />

                <label>Password</label>
                <input type="password" placeholder="insert password" />

                <div className="sell-modalLinks">
                    <a href="#">Forgot Password?</a>
                    <p>Don’t have an account? <a href="#">Sign Up</a></p>
                </div>

                <div className="sell-modalButtons">
                    <button className="sell-cancelButton" onClick={onClose}>Cancel</button>
                    <button className="sell-loginButton">Log In</button>
                </div>
            </div>
        </div>
    );
}
