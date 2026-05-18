import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { DropCap } from "@/components/site/DropCap";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbSchema, siteUrl } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that govern your use of the Deep Dives website and content.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "May 16, 2026";

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: siteUrl() },
          { name: "Terms", url: `${siteUrl()}/terms` },
        ])}
      />
      <Header />
      <main>
        <section className="relative">
          <div className="mx-auto max-w-content px-8 py-32 lg:px-10 lg:py-40">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-7">
                <h1 className="break-words font-display text-[44px] leading-[1.0] tracking-[-0.015em] sm:text-[64px] sm:leading-[0.96] lg:text-[96px]">
                  <DropCap letter="T" />erms
                  <span className="italic font-light text-sub"> of Use.</span>
                  <span className="clear-both block" />
                </h1>
                <p className="mt-6 font-body italic text-sub text-[14px]">
                  Last updated {LAST_UPDATED}
                </p>
              </Reveal>
              <Reveal delay={0.1} className="self-end lg:col-span-5 lg:col-start-8">
                <p className="max-w-md font-body italic text-sub text-[18px] leading-[1.55]">
                  Short version: enjoy the show, don't repost the episodes as your own, and don't
                  break the site on purpose.
                </p>
              </Reveal>
            </div>
          </div>
          <div aria-hidden className="mx-auto h-px max-w-content bg-rule" />
        </section>

        <section className="relative">
          <div className="mx-auto max-w-content px-8 py-20 lg:px-10 lg:py-28">
            <Reveal className="mx-auto max-w-3xl space-y-14">
              <div>
                <h2 className="font-display text-[28px] leading-[1.15] text-paper lg:text-[36px]">
                  Acceptance
                </h2>
                <p className="mt-5 font-body text-paper text-[18px] leading-[1.7]">
                  By using deepdives237.com you agree to these terms. If you don't agree, please
                  don't use the site.
                </p>
              </div>

              <div>
                <h2 className="font-display text-[28px] leading-[1.15] text-paper lg:text-[36px]">
                  Content
                </h2>
                <p className="mt-5 font-body text-paper text-[18px] leading-[1.7]">
                  All episodes, audio, video, written content, images, and design on this site are
                  the property of Deep Dives Podcast and its hosts, unless attributed otherwise.
                  You may share links to episodes freely. You may not reupload, redistribute, or
                  monetize the content without our written permission.
                </p>
                <p className="mt-4 font-body text-sub text-[18px] leading-[1.7]">
                  Embedded YouTube videos remain the property of their respective rights holders
                  under YouTube's terms.
                </p>
              </div>

              <div>
                <h2 className="font-display text-[28px] leading-[1.15] text-paper lg:text-[36px]">
                  Acceptable use
                </h2>
                <p className="mt-5 font-body text-paper text-[18px] leading-[1.7]">
                  Don't use the site to violate any law. Don't attempt to access non-public areas
                  of the site, interfere with how it works, or scrape content at a scale that
                  burdens our infrastructure. We reserve the right to block users who do.
                </p>
              </div>

              <div>
                <h2 className="font-display text-[28px] leading-[1.15] text-paper lg:text-[36px]">
                  Disclaimers
                </h2>
                <p className="mt-5 font-body text-paper text-[18px] leading-[1.7]">
                  The site and its content are provided "as is" without warranties of any kind.
                  Conversations on Deep Dives reflect the views of the host and guests in the
                  moment they were recorded. They are not professional advice (legal, medical,
                  financial, or otherwise). Use your own judgment.
                </p>
              </div>

              <div>
                <h2 className="font-display text-[28px] leading-[1.15] text-paper lg:text-[36px]">
                  Limitation of liability
                </h2>
                <p className="mt-5 font-body text-paper text-[18px] leading-[1.7]">
                  To the maximum extent allowed by law, Deep Dives and its hosts are not liable for
                  any indirect, incidental, or consequential damages arising from your use of the
                  site.
                </p>
              </div>

              <div>
                <h2 className="font-display text-[28px] leading-[1.15] text-paper lg:text-[36px]">
                  Changes
                </h2>
                <p className="mt-5 font-body text-paper text-[18px] leading-[1.7]">
                  We may update these terms. Material changes will be reflected in the "Last
                  updated" date above. Continued use of the site after a change means you accept
                  the updated terms.
                </p>
              </div>

              <div>
                <h2 className="font-display text-[28px] leading-[1.15] text-paper lg:text-[36px]">
                  Contact
                </h2>
                <p className="mt-5 font-body text-paper text-[18px] leading-[1.7]">
                  Questions about these terms? Write to us via the{" "}
                  <a href="/contact" className="text-gold underline-offset-4 hover:underline">
                    contact form
                  </a>
                  .
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
