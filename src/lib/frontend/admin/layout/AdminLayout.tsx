'use client';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { AdminFormContext } from '@/lib/frontend/admin/context/AdminFormContext';
import { FormData } from '@/lib/frontend/types/form';
import AdminHeader from '@/lib/frontend/admin/layout/Header';
import Container from '@/lib/frontend/admin/layout/Container';
import '@/styles/globals.css';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [form, setForm] = useState<FormData>({
    profile: {
      fullName: '',
      username: '',
      title: '',
      bio: '',
      avatar: '',
      bannerImage: '',
      about: '',
      headers: [],
      links: [],
      embeds: [],
      testimonials: [],
      faqs: [],
      services: [],
      featured: [],
      tags: [],
      fullAddress: '',
      latitude: '',
      longitude: '',
      resumeUrl: '',
    },
    design: {
      theme: 'brand',
      emojiLink: '',
      brandingOff: false,
      layoutType: 'bio'
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
    },
    settings: {
      nsfwWarning: false,
      preferredLink: 'primary',
      customDomain: 'hariom.com',
      gaId: '',
    },
    socials: {
      youtube: '',
      instagram: '',
      calendly: '',
    },
    posts: {
      posts: [],
    },
    subscriberSettings: {
      SubscriberList: {
        data: [],
        total: 0,
        active: 0,
        unsubscribed: 0
      },
      subscriberSettings: {
        hideSubscribeButton: false,
        subject: "",
        thankYouMessage: ""
      }
    },
    plan: "pro"
  });

  return (
    <AdminFormContext.Provider value={{ form, setForm }}>
      <AdminHeader />
      <Container>
        {children}
      </Container>
    </AdminFormContext.Provider>
  );
}
