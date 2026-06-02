export const INQUIRY_STATUS_OPTIONS = [
  {
    value: "new",
    label: "New",
    description: "New order request, not reviewed yet.",
    badgeClass: "border-slate-200 bg-slate-50 text-slate-700",
  },
  {
    value: "contacted",
    label: "Replied",
    description: "Customer has been replied to.",
    badgeClass: "border-blue-200 bg-blue-50 text-blue-700",
  },
  {
    value: "qualified",
    label: "Valid Request",
    description: "Valid request worth following up.",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  {
    value: "quoted",
    label: "Quoted",
    description: "Final cost or price reference has been sent.",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
  },
  {
    value: "won",
    label: "Confirmed",
    description: "Customer confirmed to proceed.",
    badgeClass: "border-green-200 bg-green-50 text-green-700",
  },
  {
    value: "lost",
    label: "Closed",
    description: "Request closed or customer did not proceed.",
    badgeClass: "border-slate-300 bg-slate-100 text-slate-600",
  },
  {
    value: "spam",
    label: "Spam",
    description: "Spam or invalid request.",
    badgeClass: "border-red-200 bg-red-50 text-red-700",
  },
] as const;

export type InquiryStatus = (typeof INQUIRY_STATUS_OPTIONS)[number]["value"];

export const INQUIRY_STATUS_VALUES = INQUIRY_STATUS_OPTIONS.map(
  (status) => status.value,
);

const fallbackStatus = INQUIRY_STATUS_OPTIONS[0];

export function isInquiryStatus(value: unknown): value is InquiryStatus {
  return (
    typeof value === "string" &&
    INQUIRY_STATUS_VALUES.includes(value as InquiryStatus)
  );
}

export function getInquiryStatusOption(value: unknown) {
  if (!isInquiryStatus(value)) {
    return null;
  }

  return (
    INQUIRY_STATUS_OPTIONS.find((status) => status.value === value) ||
    fallbackStatus
  );
}

export function getInquiryStatusSelectValue(value: unknown): InquiryStatus {
  return isInquiryStatus(value) ? value : fallbackStatus.value;
}

export function getInquiryStatusLabel(value: unknown) {
  const status = getInquiryStatusOption(value);

  if (status) {
    return status.label;
  }

  if (typeof value === "string" && value.trim()) {
    return `Unknown: ${value}`;
  }

  return fallbackStatus.label;
}

export function getInquiryStatusBadgeClass(value: unknown) {
  if (
    value === null ||
    value === undefined ||
    (typeof value === "string" && !value.trim())
  ) {
    return fallbackStatus.badgeClass;
  }

  return (
    getInquiryStatusOption(value)?.badgeClass ||
    "border-slate-300 bg-white text-slate-600"
  );
}
