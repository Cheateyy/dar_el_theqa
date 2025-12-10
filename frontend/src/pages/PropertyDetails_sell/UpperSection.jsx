import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Heart from "react-heart";
import { useAuth } from "../../contexts/AuthContext.jsx"; // adjust path if needed

export default function UpperSection({
    address,
    region,
    liked = false,
    onToggleLike
}) {
    const [active, setActive] = useState(liked);
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        setActive(liked);
    }, [liked]);

    const toggle = () => {
        // If not logged in, send to /login and don't toggle the like
        if (!isAuthenticated) {
            navigate("/login", {
                state: {
                    from: location.pathname, // so you can redirect back after login if you want
                },
            });
            return;
        }

        // Normal like/unlike behavior if logged in
        const next = !active;
        setActive(next);
        if (onToggleLike) onToggleLike(next);
    };

    return (
        <div className="rent-upper">
            <div className="rent-upperLeft">
                <div style={{ width: "2rem" }}>
                    <Heart isActive={active} onClick={toggle} animationScale={1.2} />
                </div>
            </div>

            <div className="rent-upperRight">
                <h2>Address : {address}</h2>
                <h3>{region}</h3>
            </div>
        </div>
    );
}
