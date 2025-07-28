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
      brandingOff: false
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
    },
    settings: {
      nsfwWarning: false,
      preferredLink: 'primary',
      customDomain: '',
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
