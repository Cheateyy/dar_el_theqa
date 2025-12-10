import { useState, useEffect } from "react";
import Heart from "react-heart";

export default function UpperSection({
    address,
    region,
    liked = false,
    onToggleLike
}) {

    const [active, setActive] = useState(liked);

    useEffect(() => {
        setActive(liked);
    }, [liked]);

    const toggle = () => {
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
