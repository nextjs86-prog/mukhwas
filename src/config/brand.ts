/**
 * Central brand configuration. The brand name is TEMPORARY —
 * change it here and it updates across the whole site.
 */
export const brand = {
  name: "MUKHWAS",
  tagline: "The Art of the After-Meal",
  description:
    "Handcrafted Indian mukhwas — fennel, rose, paan and heirloom spice blends, made in small batches and packed for gifting.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  colors: {
    forest: "#9E1B1F",
    emerald: "#D7262E",
    cream: "#F7F2E8",
    ivory: "#FFFDF8",
    gold: "#E8B21E",
    brown: "#806347",
  },
  contact: {
    // PLACEHOLDERS — replace with real details
    email: "hello@example.com",
    phone: "+91 00000 00000",
    whatsapp: "910000000000",
    upiId: "yourbrand@upi",
    address: "Business address placeholder, City, State, India",
    hours: "Mon – Sat, 10:00 – 18:00 IST",
  },
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
  },
  commerce: {
    currency: "INR",
    freeShippingThreshold: 999,
    shippingFee: 79,
    codFee: 49,
  },
  announcement: [
    "Free shipping on orders above ₹999",
    "Festive gift hampers now available — order early",
    "Use code WELCOME10 for 10% off your first order",
  ],
};
export type Brand = typeof brand;
