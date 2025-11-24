
export default function DescriptionSection({ certifiedIcon }) {
    return (
        <div className="sell-ListingInfo">
            <h1>
                Property Title
                <span className="sell-certifiedWrapper">
                    <img src={certifiedIcon} alt="Certified" className="sell-certifiedIcon" />
                    <span className="sell-certifiedTooltip">All required paperwork is available</span>
                </span>
            </h1>

            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam volutpat, magna vitae
                feugiat convallis, purus sapien dapibus turpis, id pharetra velit justo a velit...
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam volutpat, magna vitae
                feugiat convallis, purus sapien dapibus turpis, id pharetra velit justo a velit...
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam volutpat, magna vitae
                feugiat convallis, purus sapien dapibus turpis, id pharetra velit justo a velit...
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam volutpat, magna vitae
                feugiat convallis, purus sapien dapibus turpis, id pharetra velit justo a velit...
            </p>
        </div>
    );
}
