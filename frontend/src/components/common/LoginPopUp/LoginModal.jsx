export default function LoginModal({ show, onClose }) {
    if (!show) return null; 

    return (
        <div className="rent-modalOverlay">
            <div className="rent-modalContent">
                <h2>Welcome Back</h2>
                <p>You need to log in first</p>

                <label>Email</label>
                <input type="email" placeholder="user@mail.com" />

                <label>Password</label>
                <input type="password" placeholder="insert password" />

                <div className="rent-modalLinks">
                    <a href="#">Forgot Password?</a>
                    <p>Don’t have an account? <a href="#">Sign Up</a></p>
                </div>

                <div className="rent-modalButtons">
                    <button className="rent-cancelButton" onClick={onClose}>Cancel</button>
                    <button className="rent-loginButton">Log In</button>
                </div>
            </div>
        </div>
    );
}
