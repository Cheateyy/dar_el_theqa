import partnerImg from "../assets/partner_card.jpg";

/**@type {import("@/types/PartnerModel")}*/

/**
 * @param {Object} props
 * @param {Partner} props.partner
 */
export function PartnerCard({ partner }) {
    return (
        <div className="rounded-2xl shadow-xl">
            <a href={partner.website} target="_blank"><img src={partnerImg} alt={partner.name} /></a>
        </div>
    )
}