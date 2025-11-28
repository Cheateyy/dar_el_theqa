export default function UpperSection({ address, region }) {
    return (
        <div className="sell-upper">
            <div className="sell-upperLeft">
                <button className="sell-likeButton">❤️</button>
            </div>

            <div className="sell-upperRight">
                <h2>Address : {address}</h2>
                <h3>{region}</h3>
            </div>
        </div>
    );
}
