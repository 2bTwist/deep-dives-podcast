import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { DropCap } from "@/components/site/DropCap";
import { ContactForm } from "@/components/site/ContactForm";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbSchema, siteUrl } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Write to Deep Dives. Guest pitches, press inquiries, partnerships, or just hello.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: siteUrl() },
          { name: "Contact", url: `${siteUrl()}/contact` },
        ])}
      />
      <Header />
      <main>
        <section className="relative">
          <div className="mx-auto max-w-content px-8 pb-12 pt-20 lg:px-10 lg:pb-16 lg:pt-28">
            {/* Masthead */}
            <Reveal className="mb-16 text-center lg:mb-20">
              <h1 className="inline-block text-left font-display text-[44px] leading-[1.0] tracking-[-0.015em] text-paper sm:text-[64px] sm:leading-[0.96] lg:text-[96px]">
                <DropCap letter="W" />rite to
                <span className="block whitespace-nowrap italic font-light text-sub">Deep Dives.</span>
                <span className="clear-both block" />
              </h1>
            </Reveal>

            {/* Two-column body */}
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Left — context column */}
              <Reveal className="lg:col-span-5">
                <div className="border-t border-rule pt-10">
                  <p className="font-body text-[12px] uppercase tracking-[0.32em] text-gold">
                    Pitching a guest?
                  </p>
                  <p className="mt-5 font-body text-paper text-[18px] leading-[1.6]">
                    Deep Dives runs long-form interviews with people whose stories don't fit a
                    tweet. Founders past the pitch deck, planners past the photo shoot, clergy past
                    the Sunday cadence. If that sounds like you, tell us the story you'd tell on
                    mic.
                  </p>
                </div>

                <div className="mt-12 border-t border-rule pt-10">
                  <p className="font-body text-[12px] uppercase tracking-[0.32em] text-gold">
                    Press &amp; partnerships
                  </p>
                  <p className="mt-5 font-body text-paper text-[18px] leading-[1.6]">
                    Working on a piece about the show or interested in collaborating? Drop a line
                    and we'll route it to the right inbox.
                  </p>
                </div>

                <div className="mt-12 border-t border-rule pt-10">
                  <p className="font-body text-[12px] uppercase tracking-[0.32em] text-gold">
                    Or just say hi
                  </p>
                  <p className="mt-5 font-body text-paper text-[18px] leading-[1.6]">
                    The best notes start with which episode pulled you in.
                  </p>
                </div>
              </Reveal>

              {/* Right — form */}
              <Reveal delay={0.12} className="lg:col-span-7">
                <ContactForm />
              </Reveal>
            </div>
          </div>

          <div aria-hidden className="mx-auto h-px max-w-content bg-rule" />
        </section>
      </main>
      <Footer />
    </>
  );
}
