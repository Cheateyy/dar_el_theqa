import certifiedIcon from "../assets/icons/certified_button.png";
import partialIcon from "../assets/icons/partial_verified.png";

const VERIFIED_STATES = new Set(["VERIFIED", "FULLY_VERIFIED", "APPROVED"]);
const PARTIAL_STATES = new Set([
  "PARTIAL",
  "PARTIALLY VERIFIED",
  "PARTIALLY_VERIFIED",
  "PARTIAL_VERIFIED",
]);

export function getVerificationIcon(status) {
  const normalized = (status || "").toUpperCase();
  if (VERIFIED_STATES.has(normalized)) {
    return certifiedIcon;
  }
  if (!normalized) {
    return null;
  }
  if (PARTIAL_STATES.has(normalized)) {
    return partialIcon;
  }
  return partialIcon;
}
