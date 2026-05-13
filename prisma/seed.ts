import "dotenv/config"
import { PrismaClient } from "../lib/generated/prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash("admin123!", 12)
  await prisma.adminUser.upsert({
    where: { email: "admin@gogmgo.com" },
    update: {},
    create: { email: "admin@gogmgo.com", passwordHash: hash },
  })

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  })

  await prisma.legalPage.upsert({
    where: { slug: "privacy-policy" },
    update: {},
    create: {
      slug: "privacy-policy",
      title: "Privacy Policy",
      seoTitle: "Privacy Policy — GoGMGo",
      seoDescription: "How GoGMGo collects, uses and protects your data.",
      content: "<h2>Introduction</h2><p>Your privacy is important to us. This policy explains how GoGMGo collects and uses your information.</p>",
    },
  })

  await prisma.legalPage.upsert({
    where: { slug: "terms-and-conditions" },
    update: {},
    create: {
      slug: "terms-and-conditions",
      title: "Terms & Conditions",
      seoTitle: "Terms & Conditions — GoGMGo",
      seoDescription: "The terms that govern your use of the GoGMGo platform and services.",
      content: "<h2>Acceptance of Terms</h2><p>By using GoGMGo you agree to these terms.</p>",
    },
  })

  console.log("Seed complete")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
