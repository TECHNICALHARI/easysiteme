'use client';

import { useState, useEffect, useRef, FC } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ImagePlus, X, MapPin, Youtube, Instagram, Calendar, Facebook, Linkedin } from 'lucide-react';
import clsx from 'clsx';
import styles from '@/styles/admin.module.css';
import SortableLink from './SortableLink';
import LinkFormModal from './LinkFormModal';
import UploadModal from '../../../common/UploadModal';
import EmbedFormModal from './EmbedFormModal';
import RichTextEditor from '../../../common/RichTextEditor';
import SortableTestimonial from './SortableTestimonial';
import SortableFAQ from './SortableFAQ';
import ServiceFormModal from './ServiceFormModal';
import SortableService from './SortableService';
import { TestimonialFormModal } from './TestimonialFormModal';
import { FAQFormModal } from './FAQFormModal';
import { HeaderFormModal } from './HeaderFormModal';
import FeaturedMediaModal from './FeaturedMediaModal';
import SortableFeaturedMediaItem from './FeaturedMediaSection';
import ProfileTagsSection from './ProfileTagsSection';
import ResumeUpload, { ResumeUploadRef } from './ResumeUpload';
import LockedOverlay from '../../layout/LockedOverlay';
import ToggleSwitch from '../../../common/ToggleSwitch';
import { PLAN_FEATURES } from '@/config/PLAN_FEATURES';
import {
  ProfileTypeMap,
  ReorderableProfileKeys,
  FormData as AdminFormData,
  Link,
  Embed,
  Service,
  FeaturedMedia,
  Testimonial,
  FAQ,
} from '@/lib/frontend/types/form';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import { useToast } from '@/lib/frontend/common/ToastProvider';
import Loader from '@/lib/frontend/common/Loader';
import { isValidHttpUrl, normalizeHttpUrl } from '@/lib/frontend/utils/url';
import { handleDownloadResume, handleViewResume } from '@/lib/frontend/utils/common';

const Section: FC<{
  title?: string | React.ReactNode;
  sub?: string;
  right?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}> = ({ title, sub, right, className, children }) => (
  <div className={styles.sectionMain}>
    {(title || right) && (
      <div className={clsx(styles.SecHeadAndBtn, className)}>
        {title && <h4 className={styles.sectionLabel}>{title}</h4>}
        {right}
      </div>
    )}
    {sub && <p className="text-sm text-muted mb-2">{sub}</p>}
    {children}
  </div>
);

function clampLat(v: string) {
  const n = Number(v);
  if (Number.isNaN(n)) return null;
  if (n < -90 || n > 90) return null;
  return n.toString();
}

function clampLng(v: string) {
  const n = Number(v);
  if (Number.isNaN(n)) return null;
  if (n < -180 || n > 180) return null;
  return n.toString();
}

export default function ProfileTab() {
  const ctx = useAdminForm() as {
    profileDesign: { profile: AdminFormData['profile']; design: AdminFormData['design'] };
    setProfileDesign: (next: any) => void;
    setSubscriberSettings?: (next: any) => void;
    subscriberSettings?: AdminFormData['subscriberSettings'];
    plan: keyof typeof PLAN_FEATURES;
    isLoading?: boolean;
    bootstrapped?: boolean;
  };

  const { profileDesign, setProfileDesign, plan, isLoading, bootstrapped } = ctx;
  const formProfile = profileDesign?.profile ?? ({} as AdminFormData['profile']);
  const formDesign = profileDesign?.design ?? ({} as AdminFormData['design']);
  const { showToast } = useToast();

  if (isLoading || !bootstrapped) {
    return (
      <div className="flex items-center justify-center min-h-[360px]">
        <Loader />
      </div>
    );
  }

  const limits = PLAN_FEATURES[plan];
  const isWebsite = (formDesign?.layoutType || 'bio') === 'website';
  const socialsDisabled = !limits.socials;
  const contactDisabled = !limits.contact;

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [editLinkIndex, setEditLinkIndex] = useState<number | null>(null);
  const [showHeaderModal, setShowHeaderModal] = useState(false);
  const [editHeaderIndex, setEditHeaderIndex] = useState<number | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(formProfile.avatar || null);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [editEmbedIndex, setEditEmbedIndex] = useState<number | null>(null);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editTestimonialIndex, setEditTestimonialIndex] = useState<number | null>(null);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [editFAQIndex, setEditFAQIndex] = useState<number | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editServiceIndex, setEditServiceIndex] = useState<number | null>(null);
  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [editFeaturedIndex, setEditFeaturedIndex] = useState<number | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(formProfile.bannerImage || null);
  const [showUploadBannerModal, setShowUploadBannerModal] = useState(false);
  const [resumePreviewUrl, setResumePreviewUrl] = useState<string | null>(null);
  const resumeRef = useRef<ResumeUploadRef>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const headersLimitReached = (formProfile.headers ?? []).length >= limits.headers;
  const linksLimitReached = (formProfile.links ?? []).length >= limits.links;
  const isServicesEnabled = limits.services > 0;
  const servicesLimitReached = (formProfile.services?.length || 0) >= limits.services;
  const isFaqsEnabled = limits.faqs > 0;
  const faqsLimitReached = (formProfile.faqs?.length || 0) >= limits.faqs;
  const isTestimonialsEnabled = limits.testimonials > 0;
  const testimonialsLimitReached = (formProfile.testimonials?.length || 0) >= limits.testimonials;
  const isFeaturedEnabled = limits.featured > 0;
  const featuredLimitReached = (formProfile.featured?.length || 0) >= limits.featured;
  const isEmbedEnabled = limits.embeds > 0;
  const embedsLimitReached = (formProfile.embeds ?? []).length >= limits.embeds;
  const aboutDisabled = !limits.about;
  const bannerImageDisabled = !limits.bannerImage;
  const mapDisabled = !limits.map;
  const resumeDisabled = !limits.resume;

  const handleDragEnd = <T extends ReorderableProfileKeys>(type: T) => (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active?.id || !over?.id || active.id === over.id) return;
    const sectionItems = (formProfile[type] as ProfileTypeMap[T]) ?? [];
    const oldIndex = sectionItems.findIndex((i) => i.id === active.id);
    const newIndex = sectionItems.findIndex((i) => i.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove([...sectionItems], oldIndex, newIndex);
      setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, [type]: reordered } }));
      showToast('Reordered successfully', 'success');
    }
  };

  useEffect(() => { if (formProfile.avatar) setUploadPreview(formProfile.avatar); }, [formProfile.avatar]);
  useEffect(() => { if (formProfile.bannerImage) setBannerPreview(formProfile.bannerImage); }, [formProfile.bannerImage]);

  const handleImageRemove = () => {
    setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, avatar: '' } }));
    setUploadPreview(null);
    showToast('Profile image removed', 'success');
  };

  const handleAddLink = (data: Link) => {
    if (!data?.title?.trim() || !isValidHttpUrl(normalizeHttpUrl(data?.url || ''))) {
      showToast('Enter a title and a valid URL (http/https).', 'error');
      return;
    }
    const updated = [...(formProfile.links || [])];
    if (editLinkIndex !== null) updated[editLinkIndex] = { ...updated[editLinkIndex], ...data };
    else {
      if (linksLimitReached) {
        showToast(`Link limit reached (${limits.links}). Upgrade to add more.`, 'error');
        return;
      }
      updated.push({ ...data, id: data.id || `link-${Date.now()}` });
    }
    setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, links: updated } }));
    setShowLinkModal(false);
    setEditLinkIndex(null);
    showToast('Link saved', 'success');
  };

  const handleSaveEmbed = (data: Pick<Embed, 'title' | 'url'>) => {
    if (!data.title?.trim() || !isValidHttpUrl(normalizeHttpUrl(data.url))) {
      showToast('Enter a title and a valid embed URL.', 'error');
      return;
    }
    const updated = [...(formProfile.embeds || [])];
    if (editEmbedIndex !== null) updated[editEmbedIndex] = { ...updated[editEmbedIndex], ...data };
    else {
      if (embedsLimitReached) {
        showToast(`Embed limit reached (${limits.embeds}).`, 'error');
        return;
      }
      updated.push({ id: `embed-${Date.now()}`, ...data });
    }
    setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, embeds: updated } }));
    setShowEmbedModal(false);
    setEditEmbedIndex(null);
    showToast('Embed saved', 'success');
  };

  const handleSaveService = (data: Service) => {
    if (!data.title?.trim() || !data.description?.trim()) {
      showToast('Service title and description are required.', 'error');
      return;
    }
    const normalizeAmount = (v?: string) => {
      if (!v) return '';
      const x = v.replace(',', '.').trim();
      return /^\d{1,9}(\.\d{1,2})?$/.test(x) ? x : '';
    };
    const normalized: Service = { ...data, amount: normalizeAmount(data.amount) };
    const list = [...(formProfile.services || [])];
    if (editServiceIndex !== null) {
      const id = list[editServiceIndex]?.id;
      list[editServiceIndex] = { ...normalized, id };
    } else {
      if (servicesLimitReached) {
        showToast(`Services limit reached (${limits.services}).`, 'error');
        return;
      }
      list.push({ ...normalized, id: `service-${Date.now()}` });
    }
    setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, services: list } }));
    setShowServiceModal(false);
    setEditServiceIndex(null);
    showToast('Service saved', 'success');
  };

  const handleSaveFeatured = (newFeatured: FeaturedMedia) => {
    if (!newFeatured.title?.trim() || !isValidHttpUrl(normalizeHttpUrl(newFeatured.url))) {
      showToast('Featured item needs a title and a valid URL.', 'error');
      return;
    }
    const updated = [...(formProfile.featured || [])];
    if (editFeaturedIndex !== null && updated[editFeaturedIndex]) {
      const id = updated[editFeaturedIndex].id;
      updated[editFeaturedIndex] = { ...updated[editFeaturedIndex], ...newFeatured, id };
    } else {
      if (featuredLimitReached) {
        showToast(`Featured limit reached (${limits.featured}).`, 'error');
        return;
      }
      updated.push({ ...newFeatured, id: `featured-${Date.now() + Math.random()}` });
    }
    setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, featured: updated } }));
    setShowFeaturedModal(false);
    setEditFeaturedIndex(null);
    showToast('Featured media saved', 'success');
  };

  const isAvatarSet = Boolean(formProfile.avatar);
  const hasLink = (formProfile.links?.length || 0) > 0;

  const buildNavigateUrl = () => {
    const lat = formProfile.latitude?.trim();
    const lng = formProfile.longitude?.trim();
    if (lat && lng) return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(lat)},${encodeURIComponent(lng)}`;
    const addr = formProfile.fullAddress?.trim();
    if (addr) return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`;
    return `https://www.google.com/maps`;
  };

  const BasicsBlock = (
    <div className="grid md:grid-cols-[1fr_240px] gap-6">
      <div>
        <input
          className="input"
          type="text"
          placeholder="Full Name"
          value={formProfile.fullName || ''}
          onChange={(e) => setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, fullName: e.target.value } }))}
          onBlur={() => { if (!formProfile.fullName?.trim()) showToast('Full name is required.', 'error'); }}
        />
        <textarea
          className="input my-4"
          rows={3}
          placeholder="Short Bio"
          value={formProfile.bio || ''}
          onChange={(e) => setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, bio: e.target.value } }))}
        />
        <div className="flex flex-col gap-2 mt-4">
          <label className="font-medium">Cover Banner / Hero Image</label>
          <LockedOverlay enabled={!bannerImageDisabled} mode="overlay">
            {bannerPreview ? (
              <div className="relative w-full">
                <img src={bannerPreview!} alt="Cover Banner" className="w-full h-40 object-cover rounded-lg border" />
                <button
                  onClick={() => { setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, bannerImage: '' } })); setBannerPreview(null); showToast('Cover image removed', 'success'); }}
                  className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className={styles.SecHeadAndBtn}>
                <button className="btn-primary" onClick={() => setShowUploadBannerModal(true)}>Upload Cover Image</button>
              </div>
            )}
          </LockedOverlay>
        </div>
      </div>

      <div className="flex flex-col items-center justify-start gap-2">
        <div className={styles.previewCircle} onClick={() => setShowUploadModal(true)}>
          {uploadPreview ? (
            <>
              <button className={styles.removeBtn} onClick={(e) => { e.stopPropagation(); handleImageRemove(); }}>
                <X size={14} />
              </button>
              <img src={uploadPreview} alt="Avatar" className={styles.previewImage} />
            </>
          ) : (
            <div className={styles.previewPlaceholder}>
              <ImagePlus size={24} />
              <span className="text-xs text-gray-500 mt-1">Upload Image</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const bioOrder = [
    'links',
    'headers',
    'about',
    'contact',
    'location',
    'resume',
    'featured',
    'embeds',
    'services',
    'testimonials',
    'faqs',
  ] as const;

  const websiteOrder = [
    'about',
    'featured',
    'services',
    'testimonials',
    'faqs',
    'embeds',
    'contact',
    'location',
    'links',
    'headers',
    'resume',
  ] as const;

  const sequence = isWebsite ? websiteOrder : bioOrder;

  type SocialKey = 'youtube' | 'instagram' | 'calendly' | 'facebook' | 'LinkedIn';

  const initialSocials = () => ({
    youtube: (formProfile?.socials as any)?.youtube || '',
    instagram: (formProfile?.socials as any)?.instagram || '',
    calendly: (formProfile?.socials as any)?.calendly || '',
    facebook: (formProfile?.socials as any)?.facebook || '',
    LinkedIn: (formProfile?.socials as any)?.LinkedIn || '',
  });

  const [socialsLocal, setSocialsLocal] = useState(initialSocials);
  const [socialsErrors, setSocialsErrors] = useState<Record<string, string | undefined>>({});
  const socialsSerializedRef = useRef(JSON.stringify(initialSocials()));

  useEffect(() => {
    const next = initialSocials();
    const serialized = JSON.stringify(next);
    if (serialized !== socialsSerializedRef.current) {
      socialsSerializedRef.current = serialized;
      setSocialsLocal(next);
      setSocialsErrors({});
    }
  }, [formProfile.socials]);

  const handleSocialChange = (key: SocialKey, value: string) => {
    setSocialsLocal((s) => ({ ...(s || {}), [key]: value }));
    setSocialsErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSocialBlur = (key: SocialKey) => {
    const raw = (socialsLocal as any)[key] || '';
    const trimmed = raw.trim();
    if (!trimmed) {
      setSocialsErrors((p) => ({ ...p, [key]: undefined }));
      setProfileDesign((prev: any) => ({
        ...prev,
        profile: { ...prev.profile, socials: { ...(prev.profile.socials || {}), [key]: '' } },
      }));
      return;
    }
    const normalized = normalizeHttpUrl(trimmed);
    if (!isValidHttpUrl(normalized)) {
      setSocialsErrors((p) => ({ ...p, [key]: 'Enter a valid URL starting with http:// or https://' }));
      return;
    }
    setSocialsErrors((p) => ({ ...p, [key]: undefined }));
    setSocialsLocal((s) => ({ ...(s || {}), [key]: normalized }));
    setProfileDesign((prev: any) => ({
      ...prev,
      profile: { ...prev.profile, socials: { ...(prev.profile.socials || {}), [key]: normalized } },
    }));
  };

  const [websiteLocal, setWebsiteLocal] = useState(formProfile.website || '');
  const [websiteError, setWebsiteError] = useState<string | undefined>();
  const websiteSerializedRef = useRef<string>(formProfile.website || '');

  useEffect(() => {
    const next = formProfile.website || '';
    if (next !== websiteSerializedRef.current) {
      websiteSerializedRef.current = next;
      setWebsiteLocal(next);
      setWebsiteError(undefined);
    }
  }, [formProfile.website]);

  const handleWebsiteChange = (val: string) => {
    setWebsiteLocal(val);
    setWebsiteError(undefined);
  };

  const handleWebsiteBlur = () => {
    const trimmed = (websiteLocal || '').trim();
    if (!trimmed) {
      setWebsiteError(undefined);
      setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, website: '' } }));
      return;
    }
    const normalized = normalizeHttpUrl(trimmed);
    if (!isValidHttpUrl(normalized)) {
      setWebsiteError('Enter a valid URL starting with http:// or https://');
      return;
    }
    setWebsiteError(undefined);
    setWebsiteLocal(normalized);
    setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, website: normalized } }));
  };


  useEffect(() => {
    let toRevoke: string | null = null;

    async function syncPreview() {
      const src = formProfile.resumeUrl || '';
      if (!src) { setResumePreviewUrl(null); return; }

      if (src.startsWith('data:application/pdf')) {
        const blob = await (await fetch(src)).blob();
        const url = URL.createObjectURL(blob);
        toRevoke = url;
        setResumePreviewUrl(url);
      } else {
        setResumePreviewUrl(src);
      }
    }

    syncPreview();
    return () => { if (toRevoke) URL.revokeObjectURL(toRevoke); };
  }, [formProfile.resumeUrl]);





  return (
    <div className={styles.TabPageMain}>
      <div className={styles.sectionHead}>
        <h3>Set Up Your Profile</h3>
        <p>Make a strong first impression. Add a photo, a short bio and your best links. Everything here adapts to both Bio and Website layouts.</p>
      </div>

      <Section title="Publish checklist" sub="Two quick wins that make your page feel complete.">
        <div className="flex flex-wrap gap-2">
          <span className={clsx('px-3 py-1 rounded-full text-sm border', isAvatarSet ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700')}>Avatar {isAvatarSet ? 'added' : 'missing'}</span>
          <span className={clsx('px-3 py-1 rounded-full text-sm border', hasLink ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700')}>{hasLink ? '1+ link added' : 'add at least 1 link'}</span>
        </div>
      </Section>

      <Section title="Profile Basics" sub="Name, bio, avatar and optional hero image.">
        {BasicsBlock}
      </Section>

      {sequence.map((key) => {
        switch (key) {
          case 'links':
            return (
              <Section key={key} title="Links" right={<button className="btn-primary" onClick={() => {
                if (linksLimitReached) { showToast(`Link limit reached (${limits.links}).`, 'error'); return; }
                setShowLinkModal(true);
              }} disabled={linksLimitReached}>+ Add Link</button>}>
                <LockedOverlay mode="notice" enabled={!linksLimitReached} limitReached={linksLimitReached}>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd('links')}>
                    <SortableContext items={(formProfile.links || []).map((l: Link) => l.id)} strategy={verticalListSortingStrategy}>
                      <div className="grid gap-4">
                        {(formProfile.links || []).map((link: Link, i: number) => (
                          <SortableLink
                            key={link.id}
                            id={link.id}
                            link={link}
                            onEdit={() => { setEditLinkIndex(i); setShowLinkModal(true); }}
                            onDelete={() => {
                              setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, links: (prev.profile.links || []).filter((_: Link, j: number) => j !== i) } }));
                              showToast('Link removed', 'success');
                            }}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </LockedOverlay>
              </Section>
            );
          case 'headers':
            return (
              <Section key={key} title="Headers" right={<button className="btn-primary" onClick={() => setShowHeaderModal(true)} disabled={headersLimitReached}>+ Add Header</button>}>
                <LockedOverlay mode="notice" enabled={!headersLimitReached} limitReached={headersLimitReached}>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd('headers')}>
                    <SortableContext items={(formProfile.headers || []).map((h) => h.id)} strategy={verticalListSortingStrategy}>
                      <div className="grid gap-3">
                        {(formProfile.headers || []).map((header, i: number) => (
                          <SortableLink
                            key={header.id}
                            id={header.id}
                            link={{ ...(header as any), type: 'header' }}
                            onEdit={() => { setEditHeaderIndex(i); setShowHeaderModal(true); }}
                            onDelete={() => {
                              setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, headers: (prev.profile.headers || []).filter((_: any, j: number) => j !== i) } }));
                              showToast('Header removed', 'success');
                            }}
                            isHeader
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </LockedOverlay>
              </Section>
            );
          case 'about':
            return (
              <Section key={key} title={<span>About <span className="badge-pro">Pro</span></span>}>
                <LockedOverlay enabled={!aboutDisabled} mode="notice">
                  <RichTextEditor
                    value={formProfile.about || ''}
                    onChange={(val) => setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, about: val } }))}
                    placeholder="Tell your story, skills, mission..."
                    disable={aboutDisabled}
                  />
                </LockedOverlay>
              </Section>
            );
          case 'contact':
            return (
              <Section key={key} title="Contact">
                <LockedOverlay enabled={!contactDisabled} mode="notice">
                  <div className="grid gap-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        className="input"
                        placeholder="Email"
                        value={formProfile.email || ''}
                        disabled={contactDisabled}
                        onChange={(e) => setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, email: e.target.value } }))}
                      />
                      <input
                        className="input"
                        placeholder="Phone"
                        value={formProfile.phone || ''}
                        disabled={contactDisabled}
                        onChange={(e) => setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, phone: e.target.value } }))}
                      />
                    </div>

                    <div>
                      <input
                        className="input"
                        placeholder="Website (https://example.com)"
                        value={websiteLocal || ''}
                        disabled={contactDisabled}
                        onChange={(e) => handleWebsiteChange(e.target.value)}
                        onBlur={handleWebsiteBlur}
                      />
                      {websiteError && <div className="text-red-600 text-sm mt-1">{websiteError}</div>}
                    </div>

                    <div>
                      <input
                        className="input"
                        placeholder="WhatsApp (with country code)"
                        value={formProfile.whatsapp || ''}
                        disabled={contactDisabled}
                        onChange={(e) => setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, whatsapp: e.target.value } }))}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={!!formProfile.showContactForm}
                          disabled={contactDisabled}
                          onChange={() => setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, showContactForm: !prev.profile.showContactForm } }))}
                        />
                        <span>Show contact form on public page</span>
                      </label>
                    </div>
                  </div>
                </LockedOverlay>
              </Section>
            );
          case 'location':
            return (
              <Section key={key} title={<span>Business Location <span className="badge-pro">Pro</span></span>}>
                <LockedOverlay enabled={!mapDisabled} mode="notice">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input className="input" placeholder="Full address" value={formProfile.fullAddress || ''} disabled={mapDisabled}
                      onChange={(e) => setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, fullAddress: e.target.value } }))} />
                    <input className="input" placeholder="Latitude (-90 to 90)" value={formProfile.latitude || ''} disabled={mapDisabled}
                      onChange={(e) => setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, latitude: e.target.value } }))}
                      onBlur={(e) => {
                        const v = clampLat(e.target.value);
                        if (v === null) showToast('Latitude must be a number between -90 and 90.', 'error');
                        else setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, latitude: v } }));
                      }}
                    />
                    <input className="input" placeholder="Longitude (-180 to 180)" value={formProfile.longitude || ''} disabled={mapDisabled}
                      onChange={(e) => setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, longitude: e.target.value } }))}
                      onBlur={(e) => {
                        const v = clampLng(e.target.value);
                        if (v === null) showToast('Longitude must be a number between -180 and 180.', 'error');
                        else setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, longitude: v } }));
                      }}
                    />
                  </div>
                  <div className="mt-4">
                    <iframe
                      className="rounded-xl w-full h-64 border"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={
                        formProfile.latitude && formProfile.longitude
                          ? `https://www.google.com/maps?q=${formProfile.latitude},${formProfile.longitude}&output=embed`
                          : formProfile.fullAddress
                            ? `https://www.google.com/maps?q=${encodeURIComponent(formProfile.fullAddress)}&output=embed`
                            : `https://www.google.com/maps?q=28.6139,77.2090&output=embed`
                      }
                      title="Business Location"
                    />
                  </div>
                  <div className="mt-4">
                    <a className="btn-primary inline-flex items-center gap-2" href={buildNavigateUrl()} target="_blank" rel="noopener">
                      <MapPin size={16} /> Navigate Here
                    </a>
                  </div>
                </LockedOverlay>
              </Section>
            );
          case 'resume':
            return (
              <Section key={key} title={<span>Upload Resume <span className="badge-pro">Pro</span></span>}>
                <LockedOverlay enabled={!resumeDisabled}>
                  <div className={styles.resumeUploadBox}>
                    <ResumeUpload
                      ref={resumeRef}
                      onSelectFile={(file) => {
                        (async () => {
                          const isPdfType = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
                          if (!isPdfType) { showToast('Please upload a PDF resume.', 'error'); return; }
                          const max = 5 * 1024 * 1024;
                          if (file.size > max) { showToast('File must be less than 5MB.', 'error'); return; }
                          const sig = new Uint8Array(await file.slice(0, 5).arrayBuffer());
                          const isPdfMagic = sig[0] === 0x25 && sig[1] === 0x50 && sig[2] === 0x44 && sig[3] === 0x46 && sig[4] === 0x2D;
                          if (!isPdfMagic) { showToast('Corrupted PDF file. Please re-export the PDF.', 'error'); return; }

                          const objectUrl = URL.createObjectURL(file);
                          setResumePreviewUrl(prev => {
                            if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
                            return objectUrl;
                          });

                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const result = reader.result;
                            if (typeof result === 'string' && result.startsWith('data:application/pdf;base64,')) {
                              setProfileDesign((prev: any) => ({
                                ...prev,
                                profile: { ...prev.profile, resumeUrl: result }
                              }));
                              showToast('Resume added', 'success');
                            } else {
                              showToast('Failed to read PDF file.', 'error');
                            }
                          };
                          reader.readAsDataURL(file);
                        })();
                      }}
                    />

                    {!!formProfile.resumeUrl && (
                      <div className={styles.resumeActions}>
                        <button type="button" className="btn-secondary" onClick={() => handleViewResume(resumePreviewUrl!)}>
                          View
                        </button>
                        <button type="button" className="btn-primary" onClick={() => handleDownloadResume((formProfile.resumeUrl || ""), resumePreviewUrl)}>
                          Download
                        </button>
                        <button
                          className="btn-destructive"
                          onClick={() => {
                            if (resumePreviewUrl && resumePreviewUrl.startsWith('blob:')) URL.revokeObjectURL(resumePreviewUrl);
                            setResumePreviewUrl(null);
                            setProfileDesign((prev: any) => ({
                              ...prev,
                              profile: { ...prev.profile, resumeUrl: '' }
                            }));
                            resumeRef.current?.reset();
                            showToast('Resume removed', 'success');
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </LockedOverlay>
              </Section>
            );


          case 'featured':
            return (
              <Section key={key} title="Featured Media" right={<button className="btn-primary" onClick={() => {
                if (featuredLimitReached) { showToast(`Featured limit reached (${limits.featured}).`, 'error'); return; }
                setEditFeaturedIndex(null); setShowFeaturedModal(true);
              }} disabled={featuredLimitReached}>+ Add Media</button>}>
                <LockedOverlay enabled={isFeaturedEnabled && !featuredLimitReached} limitReached={featuredLimitReached} mode="notice">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd('featured')}>
                    <SortableContext items={(formProfile.featured || []).map((f: FeaturedMedia) => f.id)} strategy={verticalListSortingStrategy}>
                      <div className="grid gap-3">
                        {(formProfile.featured || []).map((featured: FeaturedMedia, i: number) => (
                          <SortableFeaturedMediaItem
                            key={featured.id}
                            id={featured.id}
                            media={featured}
                            onEdit={() => { setEditFeaturedIndex(i); setShowFeaturedModal(true); }}
                            onDelete={() => {
                              setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, featured: (prev.profile.featured || []).filter((_: any, j: number) => j !== i) } }));
                              showToast('Featured item removed', 'success');
                            }}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </LockedOverlay>
              </Section>
            );
          case 'embeds':
            return (
              <Section key={key} title={<span>Embed Widgets <span className="badge-pro">Pro</span></span>} right={<button className="btn-primary" onClick={() => {
                if (embedsLimitReached) { showToast(`Embed limit reached (${limits.embeds}).`, 'error'); return; }
                setShowEmbedModal(true);
              }} disabled={embedsLimitReached}>+ Add Embed</button>}>
                <LockedOverlay enabled={isEmbedEnabled && !embedsLimitReached} limitReached={embedsLimitReached} mode="notice">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd('embeds')}>
                    <SortableContext items={(formProfile.embeds || []).map((e: Embed) => e.id)} strategy={verticalListSortingStrategy}>
                      <div className="grid gap-3">
                        {(formProfile.embeds || []).map((embed: Embed, i: number) => (
                          <SortableLink
                            key={embed.id}
                            id={embed.id}
                            link={{ ...embed, type: 'embed' }}
                            onEdit={() => { setEditEmbedIndex(i); setShowEmbedModal(true); }}
                            onDelete={() => {
                              setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, embeds: (prev.profile.embeds || []).filter((_: any, j: number) => j !== i) } }));
                              showToast('Embed removed', 'success');
                            }}
                            isEmbed
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </LockedOverlay>
              </Section>
            );
          case 'services':
            return (
              <Section key={key} title={<span>Services <span className="badge-pro">Pro</span></span>} right={<button className="btn-primary" onClick={() => {
                if (servicesLimitReached) { showToast(`Services limit reached (${limits.services}).`, 'error'); return; }
                setEditServiceIndex(null); setShowServiceModal(true);
              }} disabled={servicesLimitReached}>+ Add Service</button>}>
                <LockedOverlay enabled={isServicesEnabled && !servicesLimitReached} limitReached={servicesLimitReached} mode="notice">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd('services')}>
                    <SortableContext items={(formProfile.services || []).map((s: Service) => s.id)} strategy={verticalListSortingStrategy}>
                      <div className="grid gap-3">
                        {(formProfile.services || []).map((service: Service, i: number) => (
                          <SortableService
                            key={service.id}
                            id={service.id}
                            service={service}
                            onEdit={() => { setEditServiceIndex(i); setShowServiceModal(true); }}
                            onDelete={() => {
                              setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, services: (prev.profile.services || []).filter((_: any, j: number) => j !== i) } }));
                              showToast('Service removed', 'success');
                            }}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </LockedOverlay>
              </Section>
            );
          case 'testimonials':
            return (
              <Section key={key} title={<span>Testimonials <span className="badge-pro">Pro</span></span>} right={<button className="btn-primary" onClick={() => {
                if (testimonialsLimitReached) { showToast(`Testimonials limit reached (${limits.testimonials}).`, 'error'); return; }
                setEditTestimonialIndex(null); setShowTestimonialModal(true);
              }} disabled={testimonialsLimitReached}>+ Add Testimonial</button>}>
                <LockedOverlay enabled={isTestimonialsEnabled && !testimonialsLimitReached} limitReached={testimonialsLimitReached} mode="notice">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd('testimonials')}>
                    <SortableContext items={(formProfile.testimonials || []).map((t: Testimonial) => t.id)} strategy={verticalListSortingStrategy}>
                      <div className="grid gap-3">
                        {(formProfile.testimonials || []).map((t: Testimonial, i: number) => (
                          <SortableTestimonial
                            key={t.id}
                            id={t.id}
                            testimonial={t}
                            onEdit={() => { setEditTestimonialIndex(i); setShowTestimonialModal(true); }}
                            onDelete={() => {
                              setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, testimonials: (prev.profile.testimonials || []).filter((_: any, j: number) => j !== i) } }));
                              showToast('Testimonial removed', 'success');
                            }}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </LockedOverlay>
              </Section>
            );
          case 'faqs':
            return (
              <Section key={key} title={<span>FAQs <span className="badge-pro">Pro</span></span>} right={<button className="btn-primary" onClick={() => {
                if (faqsLimitReached) { showToast(`FAQ limit reached (${limits.faqs}).`, 'error'); return; }
                setEditFAQIndex(null); setShowFAQModal(true);
              }} disabled={faqsLimitReached}>+ Add FAQ</button>}>
                <LockedOverlay enabled={isFaqsEnabled && !faqsLimitReached} limitReached={faqsLimitReached} mode="notice">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd('faqs')}>
                    <SortableContext items={(formProfile.faqs || []).map((f: FAQ) => f.id)} strategy={verticalListSortingStrategy}>
                      <div className="grid gap-3">
                        {(formProfile.faqs || []).map((faq: FAQ, i: number) => (
                          <SortableFAQ
                            key={faq.id}
                            id={faq.id}
                            faq={faq}
                            onEdit={() => { setEditFAQIndex(i); setShowFAQModal(true); }}
                            onDelete={() => {
                              setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, faqs: (prev.profile.faqs || []).filter((_: any, j: number) => j !== i) } }));
                              showToast('FAQ removed', 'success');
                            }}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </LockedOverlay>
              </Section>
            );
          default:
            return null;
        }
      })}

      <Section title={<span>Subscribe <span className="badge-pro">Pro</span></span>} sub="Turn on a clean email opt-in below your content. The subscribe box will appear on your public page.">
        <LockedOverlay enabled={!!limits.showSubscribers} mode="overlay">
          <ToggleSwitch
            label="Show Subscribe Section"
            checked={!(ctx.subscriberSettings?.subscriberSettings?.hideSubscribeButton === true)}
            onChange={(checked) => {
              if (typeof ctx.setSubscriberSettings === 'function') {
                ctx.setSubscriberSettings((prev: any) => {
                  const currentInner = (prev && prev.subscriberSettings) ? prev.subscriberSettings : { subject: '', thankYouMessage: '', hideSubscribeButton: false };
                  return {
                    ...prev,
                    subscriberSettings: {
                      ...currentInner,
                      hideSubscribeButton: !checked,
                    },
                  };
                });
              } else {
                showToast('Unable to update subscribe settings (missing setter).', 'error');
              }
            }}
            isPro={plan !== 'free'}
            description="Collect emails for launches, offers and updates."
          />
        </LockedOverlay>
      </Section>

      <Section title={<span>Socials <span className="badge-pro">Pro</span></span>} sub="Add links to your social profiles. Icons are shown on your public page.">
        <LockedOverlay enabled={!socialsDisabled} mode="notice">
          <div className="grid gap-3">
            <div className="grid grid-cols-[40px_1fr] gap-2 items-center">
              <div className="flex items-center justify-center"><Youtube size={18} /></div>
              <div>
                <input
                  className="input"
                  placeholder="YouTube URL"
                  value={socialsLocal.youtube || ''}
                  onChange={(e) => handleSocialChange('youtube', e.target.value)}
                  onBlur={() => handleSocialBlur('youtube')}
                  disabled={socialsDisabled}
                />
                {socialsErrors.youtube && <div className="text-red-600 text-sm mt-1">{socialsErrors.youtube}</div>}
              </div>
            </div>

            <div className="grid grid-cols-[40px_1fr] gap-2 items-center">
              <div className="flex items-center justify-center"><Instagram size={18} /></div>
              <div>
                <input
                  className="input"
                  placeholder="Instagram URL"
                  value={socialsLocal.instagram || ''}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  onBlur={() => handleSocialBlur('instagram')}
                  disabled={socialsDisabled}
                />
                {socialsErrors.instagram && <div className="text-red-600 text-sm mt-1">{socialsErrors.instagram}</div>}
              </div>
            </div>

            <div className="grid grid-cols-[40px_1fr] gap-2 items-center">
              <div className="flex items-center justify-center"><Calendar size={18} /></div>
              <div>
                <input
                  className="input"
                  placeholder="Calendly URL"
                  value={(socialsLocal as any).calendly || ''}
                  onChange={(e) => handleSocialChange('calendly', e.target.value)}
                  onBlur={() => handleSocialBlur('calendly')}
                  disabled={socialsDisabled}
                />
                {socialsErrors.calendly && <div className="text-red-600 text-sm mt-1">{socialsErrors.calendly}</div>}
              </div>
            </div>

            <div className="grid grid-cols-[40px_1fr] gap-2 items-center">
              <div className="flex items-center justify-center"><Facebook size={18} /></div>
              <div>
                <input
                  className="input"
                  placeholder="Facebook URL"
                  value={(socialsLocal as any).facebook || ''}
                  onChange={(e) => handleSocialChange('facebook', e.target.value)}
                  onBlur={() => handleSocialBlur('facebook')}
                  disabled={socialsDisabled}
                />
                {socialsErrors.facebook && <div className="text-red-600 text-sm mt-1">{socialsErrors.facebook}</div>}
              </div>
            </div>

            <div className="grid grid-cols-[40px_1fr] gap-2 items-center">
              <div className="flex items-center justify-center"><Linkedin size={18} /></div>
              <div>
                <input
                  className="input"
                  placeholder="LinkedIn URL"
                  value={(socialsLocal as any).LinkedIn || ''}
                  onChange={(e) => handleSocialChange('LinkedIn', e.target.value)}
                  onBlur={() => handleSocialBlur('LinkedIn')}
                  disabled={socialsDisabled}
                />
                {socialsErrors.LinkedIn && <div className="text-red-600 text-sm mt-1">{socialsErrors.LinkedIn}</div>}
              </div>
            </div>
          </div>
        </LockedOverlay>
      </Section>

      <ProfileTagsSection
        profile={profileDesign.profile as any}
        setProfile={(up) =>
          setProfileDesign((prev: any) => ({
            ...prev,
            profile: typeof up === 'function' ? (up as any)(prev.profile) : up,
          }))
        }
        limit={limits.tags}
      />

      {showLinkModal && (
        <LinkFormModal
          onSave={handleAddLink}
          onClose={() => { setShowLinkModal(false); setEditLinkIndex(null); }}
          initialData={editLinkIndex !== null ? (formProfile.links || [])[editLinkIndex] : undefined}
        />
      )}

      {showHeaderModal && (
        <HeaderFormModal
          initialData={editHeaderIndex !== null ? (formProfile.headers || [])[editHeaderIndex] : undefined}
          onClose={() => setShowHeaderModal(false)}
          onSave={(newHeader) => {
            if (!newHeader?.title?.trim()) { showToast('Header title is required.', 'error'); return; }
            const updated = [...(formProfile.headers || [])];
            if (editHeaderIndex !== null) updated[editHeaderIndex] = { ...updated[editHeaderIndex], ...newHeader };
            else updated.push({ ...newHeader, id: `header-${Date.now() + Math.random()}` });
            setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, headers: updated } }));
            setShowHeaderModal(false);
            showToast('Header saved', 'success');
          }}
        />
      )}

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSelectImage={(val) => {
            if (typeof val === 'string') {
              setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, avatar: val } }));
              setUploadPreview(val);
              showToast('Profile image updated', 'success');
            } else {
              const reader = new FileReader();
              reader.onload = () => {
                setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, avatar: reader.result as string } }));
                setUploadPreview(reader.result as string);
                showToast('Profile image updated', 'success');
              };
              reader.readAsDataURL(val);
            }
            setShowUploadModal(false);
          }}
          showTabs={false}
        />
      )}

      {showEmbedModal && (
        <EmbedFormModal
          onSave={handleSaveEmbed}
          onClose={() => { setShowEmbedModal(false); setEditEmbedIndex(null); }}
          initialData={editEmbedIndex !== null ? (formProfile.embeds || [])[editEmbedIndex] : undefined}
        />
      )}

      {showTestimonialModal && (
        <TestimonialFormModal
          onClose={() => setShowTestimonialModal(false)}
          initialData={editTestimonialIndex !== null ? (formProfile.testimonials || [])[editTestimonialIndex] : undefined}
          onSave={(newTestimonial) => {
            if (!newTestimonial?.name?.trim() || !newTestimonial?.message?.trim()) {
              showToast('Testimonial name and message are required.', 'error');
              return;
            }
            if (editTestimonialIndex !== null) {
              const updated = [...(formProfile.testimonials || [])];
              updated[editTestimonialIndex] = { ...updated[editTestimonialIndex], ...newTestimonial };
              setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, testimonials: updated } }));
            } else {
              if (testimonialsLimitReached) { showToast(`Testimonials limit reached (${limits.testimonials}).`, 'error'); return; }
              const id = `testimonial-${Date.now() + Math.random()}`;
              setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, testimonials: [...(prev.profile.testimonials || []), { ...newTestimonial, id }] } }));
            }
            setShowTestimonialModal(false);
            showToast('Testimonial saved', 'success');
          }}
        />
      )}

      {showFAQModal && (
        <FAQFormModal
          onClose={() => setShowFAQModal(false)}
          initialData={editFAQIndex !== null ? (formProfile.faqs || [])[editFAQIndex] : undefined}
          onSave={(newFaq) => {
            if (!newFaq?.question?.trim() || !newFaq?.answer?.trim()) {
              showToast('FAQ question and answer are required.', 'error');
              return;
            }
            if (editFAQIndex !== null) {
              const updated = [...(formProfile.faqs || [])];
              updated[editFAQIndex] = { ...updated[editFAQIndex], ...newFaq };
              setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, faqs: updated } }));
            } else {
              if (faqsLimitReached) { showToast(`FAQ limit reached (${limits.faqs}).`, 'error'); return; }
              const id = `faq-${Date.now() + Math.random()}`;
              setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, faqs: [...(prev.profile.faqs || []), { ...newFaq, id }] } }));
            }
            setShowFAQModal(false);
            showToast('FAQ saved', 'success');
          }}
        />
      )}

      {showServiceModal && (
        <ServiceFormModal
          onClose={() => setShowServiceModal(false)}
          onSave={handleSaveService}
          initialData={editServiceIndex !== null ? (formProfile.services || [])[editServiceIndex] : undefined}
        />
      )}

      {showFeaturedModal && (
        <FeaturedMediaModal
          onClose={() => setShowFeaturedModal(false)}
          onSave={handleSaveFeatured}
          initialData={editFeaturedIndex !== null ? (formProfile.featured || [])[editFeaturedIndex] : undefined}
        />
      )}

      {showUploadBannerModal && (
        <UploadModal
          onClose={() => setShowUploadBannerModal(false)}
          onSelectImage={(val) => {
            if (typeof val === 'string') {
              setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, bannerImage: val } }));
              setBannerPreview(val);
              setShowUploadBannerModal(false);
              showToast('Cover image updated', 'success');
            } else if (val instanceof File) {
              const reader = new FileReader();
              reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                  setProfileDesign((prev: any) => ({ ...prev, profile: { ...prev.profile, bannerImage: reader.result } }));
                  setBannerPreview(reader.result);
                  showToast('Cover image updated', 'success');
                }
                setShowUploadBannerModal(false);
              };
              reader.readAsDataURL(val);
            }
          }}
          showTabs={false}
        />
      )}
    </div>
  );
}
