import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "react-email";

/**
 * Newsletter welcome email, sent once by the Resend Automation "Newsletter welcome"
 * when /api/newsletter emits `newsletter.subscribed` for a new contact.
 *
 * This file is the starting design. After `scripts/publish-welcome-email.mjs` uploads
 * it, Resend owns the template and copy edits happen in the Resend dashboard, so this
 * file can drift from what is live (specs/decisions/2026-09-14-newsletter-welcome-email.md).
 *
 * Email-client constraints behind the styling:
 * - Georgia stack instead of the site's web fonts: Gmail and Outlook ignore @font-face.
 * - Dark by design, declared with color-scheme meta, so clients don't recolor it.
 * - Inline styles only, no media queries: some Gmail apps strip <style>, and Section
 *   puts className on its table but style on the inner cell, so overrides stack.
 *   One padding value is used that reads well from 375px phones to desktop.
 * - Absolute HTTPS image URL, PNG not SVG, and the email still reads with images off.
 * - `{{{RESEND_UNSUBSCRIBE_URL}}}` is filled in and handled by Resend.
 */

const SITE = "https://deepdives237.com";
const SERIF = "Georgia, 'Times New Roman', Times, serif";

const INK = "#050505";
const SURFACE = "#0d0b08";
const PAPER = "#ffffff";
const GOLD = "#c8a25d";
const MUTED = "#a8a29a";
const RULE = "#4a3d26"; // gold at ~35% over SURFACE, as a solid color Outlook can render

export const WELCOME_SUBJECT = "Welcome to Deep Dives";
export const WELCOME_PREVIEW = "You're on the list. Here's what to expect, and where to start.";

export default function WelcomeEmail() {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <meta name="color-scheme" content="dark light" />
        <meta name="supported-color-schemes" content="dark light" />
        <style>{":root { color-scheme: dark light; supported-color-schemes: dark light; }"}</style>
      </Head>
      <Preview>{WELCOME_PREVIEW}</Preview>
      <Body style={{ backgroundColor: INK, margin: 0, padding: "24px 12px", fontFamily: SERIF }}>
        <Container style={{ maxWidth: 600, width: "100%", backgroundColor: SURFACE, borderTop: `3px solid ${GOLD}` }}>
          <Section style={{ padding: "44px 32px 36px" }}>
            <Img
              src={`${SITE}/brand/raissa-avatar.png`}
              width="64"
              height="64"
              alt="Deep Dives Podcast"
              style={{ display: "block", border: 0, borderRadius: "50%" }}
            />

            <Text style={eyebrow}>Deep Dives Podcast</Text>
            <Heading as="h1" style={title}>
              Welcome to Deep Dives.
            </Heading>

            <Text style={paragraph}>
              Thank you for joining. I&apos;m Raissa, and I&apos;m really glad you&apos;re here.
            </Text>
            <Text style={paragraph}>
              Here&apos;s what to expect: I&apos;ll send the new episode when it&apos;s out, plus
              the occasional note about who&apos;s coming on next. No spam, ever.
            </Text>
            <Text style={paragraph}>
              One favor: hit reply and tell me who you&apos;d love to hear on the show, or the
              question you want us to go deep on. I read every reply.
            </Text>

            <Text style={{ margin: "28px 0 0" }}>
              <Button href={`${SITE}/episodes`} style={button}>
                Watch the latest episode
              </Button>
            </Text>

            <Text style={{ ...paragraph, margin: "32px 0 0" }}>Talk soon,</Text>
            <Text style={signature}>Raissa</Text>
          </Section>

          <Section style={{ padding: "0 32px 36px" }}>
            <Hr style={{ border: "none", borderTop: `1px solid ${RULE}`, margin: "0 0 24px" }} />
            <Text style={footer}>
              You&apos;re receiving this because you joined the Deep Dives list at{" "}
              <Link href={SITE} style={footerLink}>
                deepdives237.com
              </Link>
              .
            </Text>
            <Text style={footer}>
              <Link href="https://www.youtube.com/@DeepDives237" style={footerLink}>
                YouTube
              </Link>
              {"  ·  "}
              <Link href="https://www.instagram.com/deepdives237" style={footerLink}>
                Instagram
              </Link>
              {"  ·  "}
              <Link href="https://www.tiktok.com/@deepdives237" style={footerLink}>
                TikTok
              </Link>
            </Text>
            <Text style={footer}>
              <Link href="{{{RESEND_UNSUBSCRIBE_URL}}}" style={footerLink}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const eyebrow = {
  margin: "32px 0 0",
  color: GOLD,
  fontFamily: SERIF,
  fontSize: "12px",
  lineHeight: "18px",
  letterSpacing: "0.28em",
  textTransform: "uppercase" as const,
};

const title = {
  margin: "10px 0 24px",
  color: PAPER,
  fontFamily: SERIF,
  fontSize: "32px",
  lineHeight: "38px",
  fontWeight: 400,
};

const paragraph = {
  margin: "0 0 18px",
  color: PAPER,
  fontFamily: SERIF,
  fontSize: "17px",
  lineHeight: "28px",
};

// 16px line + 15px padding top and bottom = 46px tap target, above the 44px minimum.
const button = {
  display: "inline-block",
  backgroundColor: GOLD,
  color: INK,
  fontFamily: SERIF,
  fontSize: "13px",
  lineHeight: "16px",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  textDecoration: "none",
  padding: "15px 24px",
};

const signature = {
  margin: "4px 0 0",
  color: GOLD,
  fontFamily: SERIF,
  fontSize: "26px",
  lineHeight: "32px",
  fontStyle: "italic",
};

const footer = {
  margin: "0 0 10px",
  color: MUTED,
  fontFamily: SERIF,
  fontSize: "13px",
  lineHeight: "20px",
};

const footerLink = { color: MUTED, textDecoration: "underline" };
