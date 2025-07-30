import { FormData } from "@/lib/frontend/types/form";

const dummyFormData: FormData = {
  profile: {
    fullName: "Hariom Panday",
    username: "hariom",
    title: "Full Stack Developer",
    bio: "Building cool products with code!",
    avatar:
      "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    bannerImage:
      "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    about: `<p>Hello! 👋 I'm <strong>Hariom Panday</strong>, a full-stack developer passionate about building beautiful web experiences.</p>
            <p>I specialize in <em>Next.js</em>, <em>MongoDB</em>, and building clean, scalable SaaS products for creators, businesses, and startups.</p>
            <ul>
              <li>✅ Freelancer & indie hacker</li>
              <li>🚀 Building OnePage SaaS</li>
              <li>💡 Love UI/UX + animations</li>
            </ul>`,
    headers: [{ id: "1", title: "Connect with Me" }],
    links: [
      {
        id: "1",
        title: "GitHub",
        url: "https://github.com/hariompanday",
        highlighted: true,
        icon: null,
      },
      {
        id: "2",
        title: "Portfolio",
        url: "https://hariom.dev",
        highlighted: false,
      },
      {
        id: "3",
        title: "Cal.com Booking",
        url: "https://cal.com/hariom",
        highlighted: true,
      },
    ],
    embeds: [
      {
        id: "1",
        title: "Intro Demo",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        id: "2",
        title: "Builder Showcase",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ],
    testimonials: [
      {
        id: "1",
        name: "John Developer",
        message:
          "Working with Hariom has transformed my business. Great code + great vibes!",
        avatar:
          "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
      },
      {
        id: "2",
        name: "Sara Smith",
        message:
          "The OnePage setup saved me days of work — looks amazing on mobile!",
        avatar:
          "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
      },
      {
        id: "3",
        name: "Alex Patel",
        message:
          "10/10 would recommend Hariom’s work to anyone building a SaaS.",
        avatar:
          "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
      },
    ],
    faqs: [
      {
        id: "1",
        question: "Can I use my own domain?",
        answer: "Yes, with a Pro or Premium plan you can use a custom domain.",
      },
      {
        id: "2",
        question: "Do I need coding knowledge?",
        answer: "Nope. Just fill out the form — everything else is handled.",
      },
      {
        id: "3",
        question: "Is OnePage mobile optimized?",
        answer: "Absolutely. Your page looks amazing on every device.",
      },
      {
        id: "4",
        question: "How many pages can I create?",
        answer: "Unlimited on Pro and Premium. Free users get one.",
      },
    ],
    services: [
      {
        id: "1",
        title: "Personal Portfolio",
        description:
          "Next.js + Tailwind portfolio tailored for developers or designers.",
        price: "9999",
        ctaLabel: "Book Now",
        ctaLink: "https://cal.com/hariom/portfolio",
      },
      {
        id: "2",
        title: "Product Landing Page",
        description:
          "High-converting SaaS or product page with animations + SEO setup.",
        price: "14999",
        ctaLabel: "Schedule Call",
        ctaLink: "https://cal.com/hariom/landing",
      },
      {
        id: "3",
        title: "Custom API or Dashboard",
        description:
          "Build a RESTful or GraphQL API + admin panel (Next.js or Node.js).",
        price: "19999",
        ctaLabel: "Request Quote",
        ctaLink: "https://cal.com/hariom/api-dashboard",
      },
    ],

    featured: [
      {
        id: "1",
        title: "Demo Day Talk",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "My 5-min startup pitch for OnePage on IndieHackers.",
        ctaLabel: "Watch Now",
        ctaLink: "https://youtube.com",
      },
      {
        id: "2",
        title: "How I Built This",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "A breakdown of my design & development workflow.",
        ctaLabel: "Open Video",
        ctaLink: "https://youtube.com",
      },
    ],
    tags: ["developer", "saas", "nextjs", "freelancer"],
    fullAddress: "India",
    latitude: "",
    longitude: "",
    resumeUrl: "/resume.pdf",
  },
  design: {
    theme: "forest",
    emojiLink: "🚀",
    brandingOff: false,
    layoutType: "bio",
  },
  seo: {
    metaTitle: "Hariom Panday | Full Stack Dev",
    metaDescription:
      "Explore Hariom’s OnePage bio, portfolio, services and blog.",
  },
  settings: {
    nsfwWarning: false,
    preferredLink: "primary",
    customDomain: "hariom.dev",
    gaId: "G-ABC123XYZ",
  },
  socials: {
    youtube: "https://youtube.com/@hariom",
    instagram: "https://instagram.com/hariom.dev",
    calendly: "https://cal.com/hariom",
  },
  posts: {
    posts: [
      {
        id: "1",
        title: "Launching My OnePage SaaS",
        slug: "launching-onepage-saas",
        description: "Behind the scenes of building a micro-SaaS in public.",
        content: "",
        thumbnail:
          "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
        seoTitle: "Launching OnePage",
        seoDescription: "How I built and launched a full SaaS in weeks.",
        tags: ["launch", "saas", "buildinpublic"],
        published: true,
      },
      {
        id: "2",
        title: "Next.js vs Astro for Indie Products",
        slug: "nextjs-vs-astro",
        description: "Which frontend stack is better for shipping MVPs?",
        content: "",
        thumbnail: "",
        seoTitle: "Next.js or Astro?",
        seoDescription: "Comparing frontend tools for solo devs.",
        tags: ["nextjs", "astro", "frontend"],
        published: true,
      },
      {
        id: "3",
        title: "Freelance Tips for Developers",
        slug: "freelance-tips-devs",
        description: "How to land high-paying gigs as a solo dev.",
        content: "",
        thumbnail:
          "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
        seoTitle: "Freelancing for Devs",
        seoDescription: "Guide for making income as a coder.",
        tags: ["freelance", "developer"],
        published: true,
      },
    ],
  },
  subscriberSettings: {
    SubscriberList: {
      data: [
        {
          email: "jane@example.com",
          subscribedOn: "2024-12-01",
          status: "Active",
        },
        {
          email: "john@example.com",
          subscribedOn: "2025-01-10",
          status: "Unsubscribed",
        },
      ],
      total: 2,
      active: 1,
      unsubscribed: 1,
    },
    subscriberSettings: {
      subject: "Thanks for subscribing!",
      thankYouMessage: "Welcome to my world! Expect weekly updates. 🎉",
      hideSubscribeButton: false,
    },
  },
  plan: "free",
};

export default dummyFormData;
