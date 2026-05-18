import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/site/Button";

export const metadata = {
  title: "Not Found",
  description: "The page you were looking for isn't here.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <section className="relative">
          <div className="mx-auto grid min-h-[70vh] max-w-content place-items-center px-8 py-32 lg:px-10">
            <div className="text-center">
              <p className="font-body text-[12px] uppercase tracking-[0.32em] text-gold">
                404
              </p>
              <h1 className="mt-6 font-display text-[64px] leading-[0.96] tracking-[-0.015em] lg:text-[112px]">
                Not <span className="italic font-light text-sub">here.</span>
              </h1>
              <p className="mx-auto mt-8 max-w-md font-body italic text-sub text-[18px] leading-[1.55]">
                This page either moved, never existed, or the link that brought you here is older
                than the conversation it was looking for.
              </p>
              <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                <Button variant="primary" href="/">
                  Back Home
                </Button>
                <Button variant="secondary" href="/episodes" showArrow={false}>
                  Browse Episodes
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
