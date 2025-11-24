import partnerImg from "../assets/partner_card.jpg";

export function PartnerCard() {
    return (
        <div className="rounded-2xl shadow-xl">
            <img src={partnerImg} alt="partner card" />
        </div>
    )
}