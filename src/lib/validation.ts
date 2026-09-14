import { z } from "zod";

// Contact subjects must mirror the chips in ContactForm.tsx.
const contactSubjects = [
  "Guest pitch",
  "Press inquiry",
  "Partnership",
  "Just saying hi",
  "Something else",
] as const;

// Honeypot: a hidden field real users never fill. Bots do. It must pass validation
// when filled so the route can return a fake success instead of a telling 400.
const honeypot = z.string().max(500).optional();

export const newsletterSchema = z.object({
  email: z.string().trim().email().max(254),
  company: honeypot, // honeypot
});

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  subject: z.enum(contactSubjects),
  message: z.string().trim().min(1).max(5000),
  company: honeypot, // honeypot
});
