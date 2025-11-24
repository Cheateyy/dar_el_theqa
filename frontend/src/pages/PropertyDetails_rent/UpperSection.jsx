export default function UpperSection({ address, region }) {
    return (
        <div className="rent-upper">
            <div className="rent-upperLeft">
                <button className="rent-likeButton">❤️</button>
            </div>

            <div className="rent-upperRight">
                <h2>Address : {address}</h2>
                <h3>{region}</h3>
            </div>
        </div>
    );
}
