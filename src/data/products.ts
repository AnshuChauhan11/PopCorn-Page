import butter from "@/assets/butter.jpg";
import caramel from "@/assets/caramel.jpg";
import cheese from "@/assets/cheese.jpg";
import chocolate from "@/assets/chocolate.jpg";
import masala from "@/assets/masala.jpg";
import seasalt from "@/assets/seasalt.jpg";
import combo from "@/assets/combo.jpg";
import story from "@/assets/story.jpg";

// DEMO PRICING — replace with real prices before launch.
export type Category = "Sweet" | "Savoury" | "Classic";
export type Product = {
  id: string; name: string; description: string; price: number; category: Category; image: string;
};

export const products: Product[] = [
  { id: "butter", name: "Classic Butter", description: "Light, fluffy and generously buttered.", price: 199, category: "Classic", image: butter },
  { id: "caramel", name: "Golden Caramel", description: "Slow-cooked caramel with a glossy crunch.", price: 249, category: "Sweet", image: caramel },
  { id: "cheese", name: "Cheesy Blast", description: "Bold cheddar coating in every handful.", price: 249, category: "Savoury", image: cheese },
  { id: "chocolate", name: "Chocolate Crunch", description: "Caramel corn drizzled with dark chocolate.", price: 279, category: "Sweet", image: chocolate },
  { id: "masala", name: "Spicy Masala", description: "A warm, tangy desi spice kick.", price: 219, category: "Savoury", image: masala },
  { id: "seasalt", name: "Sea Salt Delight", description: "Simple, crisp and perfectly salted.", price: 199, category: "Classic", image: seasalt },
];

export type Combo = {
  id: string; name: string; includes: string[]; price: number; original: number; image: string; bestSeller?: boolean;
};

export const combos: Combo[] = [
  { id: "movie-night", name: "Movie Night Combo", includes: ["Classic Butter", "Golden Caramel", "2 sharing tubs"], price: 399, original: 448, image: story, bestSeller: true },
  { id: "party-box", name: "Party Popcorn Box", includes: ["Cheesy Blast", "Spicy Masala", "Sea Salt Delight"], price: 599, original: 667, image: masala },
  { id: "ultimate-pack", name: "Ultimate Flavour Pack", includes: ["All 6 flavours", "Gift box packaging"], price: 1199, original: 1394, image: combo },
];

export type Review = { name: string; rating: number; text: string; product: string };

// SAMPLE TESTIMONIALS — placeholders, not real customer feedback.
export const reviews: Review[] = [
  { name: "Sample Customer A", rating: 5, text: "The caramel crunch disappeared before the movie even started.", product: "Golden Caramel" },
  { name: "Sample Customer B", rating: 5, text: "Spicy Masala is exactly the kind of kick I want on a Friday night.", product: "Spicy Masala" },
  { name: "Sample Customer C", rating: 4, text: "Ordered the party box — everyone had a different favourite.", product: "Party Popcorn Box" },
  { name: "Sample Customer D", rating: 5, text: "Chocolate Crunch is dangerously good. Buying two next time.", product: "Chocolate Crunch" },
];

export const contact = { email: "hello@yourdomain.com", phone: "+91 00000 00000" };
export const socials = [
  { name: "Instagram", url: "" }, { name: "Facebook", url: "" }, { name: "YouTube", url: "" }, { name: "Pinterest", url: "" },
];

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
export const findItem = (id: string) =>
  products.find((p) => p.id === id) ?? combos.find((c) => c.id === id);
