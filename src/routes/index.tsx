import { createFileRoute } from "@tanstack/react-router";
import { CartProvider } from "@/hooks/use-cart";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { CartDrawer } from "@/components/CartDrawer";
import { About, BestSellers, Experience, Flavours, Footer, Hero, Newsletter, Reviews, Why } from "@/components/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "POPCORN — Pop Beyond Ordinary | Gourmet Popcorn" },
      { name: "description", content: "Gourmet popcorn in six flavours — butter, caramel, cheese, chocolate, masala and sea salt. Combos for movie nights and parties." },
      { property: "og:title", content: "POPCORN — Pop Beyond Ordinary" },
      { property: "og:description", content: "Not just a snack. It's a whole experience. Explore six gourmet popcorn flavours and combo boxes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <CartProvider>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Flavours />
        <Experience />
        <Why />
        <BestSellers />
        <Reviews />
        <Newsletter />
      </main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
