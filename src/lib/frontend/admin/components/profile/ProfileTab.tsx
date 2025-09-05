'use client';

import { useState, useEffect, FC, useRef } from 'react';
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
import { ImagePlus, X, MapPin } from 'lucide-react';
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
import ContactInfoSection from './ContactInfoSection';
import FeaturedMediaModal from './FeaturedMediaModal';
import SortableFeaturedMediaItem from './FeaturedMediaSection';
import ProfileTagsSection from './ProfileTagsSection';
import ResumeUpload, { ResumeUploadRef } from './ResumeUpload';
import LockedOverlay from '../../layout/LockedOverlay';
import ToggleSwitch from '../../../common/ToggleSwitch';

import { PLAN_FEATURES } from '@/config/PLAN_FEATURES';
import { ProfileTypeMap, ReorderableProfileKeys, FormData as AdminFormData, Link, Embed, Service, FeaturedMedia, Testimonial, FAQ } from '@/lib/frontend/types/form';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import { useToast } from '@/lib/frontend/common/ToastProvider';

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

function isValidUrl(u?: string) {
  if (!u) return false;
  try {
    const url = new URL(u);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

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

function sanitizePrice(v?: string) {
  if (!v) return '';
  const n = Number(String(v).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) && n >= 0 ? n.toString() : '';
}

export default function ProfileTab() {
  const { form, setForm, plan } = useAdminForm() as { form: AdminFormData; setForm: (f: AdminFormData | ((p: AdminFormData) => AdminFormData)) => void; plan: keyof typeof PLAN_FEATURES };
  const { showToast } = useToast();

  const limits = PLAN_FEATURES[plan];
  const isWebsite = (form.design?.layoutType || 'bio') === 'website';

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [editLinkIndex, setEditLinkIndex] = useState<number | null>(null);
  const [showHeaderModal, setShowHeaderModal] = useState(false);
  const [editHeaderIndex, setEditHeaderIndex] = useState<number | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(form.profile.avatar || null);
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
  const [bannerPreview, setBannerPreview] = useState<string | null>(form.profile.bannerImage || null);
  const [showUploadBannerModal, setShowUploadBannerModal] = useState(false);
  const resumeRef = useRef<ResumeUploadRef>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const headersLimitReached = (form.profile.headers ?? []).length >= limits.headers;
  const linksLimitReached = (form.profile.links ?? []).length >= limits.links;
  const isServicesEnabled = limits.services > 0;
  const servicesLimitReached = (form.profile.services?.length || 0) >= limits.services;
  const isFaqsEnabled = limits.faqs > 0;
  const faqsLimitReached = (form.profile.faqs?.length || 0) >= limits.faqs;
  const isTestimonialsEnabled = limits.testimonials > 0;
  const testimonialsLimitReached = (form.profile.testimonials?.length || 0) >= limits.testimonials;
  const isFeaturedEnabled = limits.featured > 0;
  const featuredLimitReached = (form.profile.featured?.length || 0) >= limits.featured;
  const isEmbedEnabled = limits.embeds > 0;
  const embedsLimitReached = (form.profile.embeds?.length || 0) >= limits.embeds;
  const aboutDisabled = !limits.about;
  const bannerImageDisabled = !limits.bannerImage;
  const mapDisabled = !limits.map;
  const resumeDisabled = !limits.resume;

  const handleDragEnd = <T extends ReorderableProfileKeys>(type: T) => (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active?.id || !over?.id || active.id === over.id) return;
    const sectionItems = form.profile[type] as ProfileTypeMap[T];
    const oldIndex = sectionItems.findIndex((i) => i.id === active.id);
    const newIndex = sectionItems.findIndex((i) => i.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove([...sectionItems], oldIndex, newIndex);
      setForm(prev => ({ ...prev, profile: { ...prev.profile, [type]: reordered as any } }));
      showToast('Reordered successfully', 'success');
    }
  };

  useEffect(() => { if (form.profile.avatar) setUploadPreview(form.profile.avatar); }, [form.profile.avatar]);
  useEffect(() => { if (form.profile.bannerImage) setBannerPreview(form.profile.bannerImage); }, [form.profile.bannerImage]);

  const handleImageRemove = () => {
    setForm({ ...form, profile: { ...form.profile, avatar: '' } });
    setUploadPreview(null);
    showToast('Profile image removed', 'success');
  };

  const handleAddLink = (data: Link) => {
    if (!data?.title?.trim() || !isValidUrl(data?.url)) {
      showToast('Enter a title and a valid URL (http/https).', 'error');
      return;
    }
    const updated = [...(form.profile.links || [])];
    if (editLinkIndex !== null) updated[editLinkIndex] = { ...updated[editLinkIndex], ...data };
    else {
      if (linksLimitReached) {
        showToast(`Link limit reached (${limits.links}). Upgrade to add more.`, 'error');
        return;
      }
      updated.push({ ...data, id: data.id || `link-${Date.now()}` });
    }
    setForm({ ...form, profile: { ...form.profile, links: updated } });
    setShowLinkModal(false);
    setEditLinkIndex(null);
    showToast('Link saved', 'success');
  };

  const handleSaveEmbed = (data: Pick<Embed, 'title' | 'url'>) => {
    if (!data.title?.trim() || !isValidUrl(data.url)) {
      showToast('Enter a title and a valid embed URL.', 'error');
      return;
    }
    const updated = [...(form.profile.embeds || [])];
    if (editEmbedIndex !== null) updated[editEmbedIndex] = { ...updated[editEmbedIndex], ...data };
    else {
      if (embedsLimitReached) {
        showToast(`Embed limit reached (${limits.embeds}).`, 'error');
        return;
      }
      updated.push({ id: `embed-${Date.now()}`, ...data });
    }
    setForm({ ...form, profile: { ...form.profile, embeds: updated } });
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

    const normalized: Service = {
      ...data,
      amount: normalizeAmount(data.amount),
    };

    const list = [...(form.profile.services || [])];
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

    setForm({ ...form, profile: { ...form.profile, services: list } });
    setShowServiceModal(false);
    setEditServiceIndex(null);
    showToast('Service saved', 'success');
  };


  const handleSaveFeatured = (newFeatured: FeaturedMedia) => {
    if (!newFeatured.title?.trim() || !isValidUrl(newFeatured.url)) {
      showToast('Featured item needs a title and a valid URL.', 'error');
      return;
    }
    const updated = [...(form.profile.featured || [])];
    if (editFeaturedIndex !== null) {
      const id = updated[editFeaturedIndex].id;
      updated[editFeaturedIndex] = { ...updated[editFeaturedIndex], ...newFeatured, id };
    } else {
      if (featuredLimitReached) {
        showToast(`Featured limit reached (${limits.featured}).`, 'error');
        return;
      }
      updated.push({ ...newFeatured, id: `featured-${Date.now() + Math.random()}` });
    }
    setForm({ ...form, profile: { ...form.profile, featured: updated } });
    setShowFeaturedModal(false);
    setEditFeaturedIndex(null);
    showToast('Featured media saved', 'success');
  };

  const isAvatarSet = Boolean(form.profile.avatar);
  const hasLink = (form.profile.links?.length || 0) > 0;

  const buildNavigateUrl = () => {
    const lat = form.profile.latitude?.trim();
    const lng = form.profile.longitude?.trim();
    if (lat && lng) return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(lat)},${encodeURIComponent(lng)}`;
    const addr = form.profile.fullAddress?.trim();
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
          value={form.profile.fullName}
          onChange={(e) => setForm({ ...form, profile: { ...form.profile, fullName: e.target.value } })}
          onBlur={() => {
            if (!form.profile.fullName?.trim()) showToast('Full name is required.', 'error');
          }}
        />
        <textarea
          className="input my-4"
          rows={3}
          placeholder="Short Bio"
          value={form.profile.bio}
          onChange={(e) => setForm({ ...form, profile: { ...form.profile, bio: e.target.value } })}
        />
        <div className="flex flex-col gap-2 mt-4">
          <label className="font-medium">Cover Banner / Hero Image</label>
          <LockedOverlay enabled={!bannerImageDisabled} mode="overlay">
            {bannerPreview ? (
              <div className="relative w-full">
                <img src={bannerPreview!} alt="Cover Banner" className="w-full h-40 object-cover rounded-lg border" />
                <button
                  onClick={() => { setForm({ ...form, profile: { ...form.profile, bannerImage: '' } }); setBannerPreview(null); showToast('Cover image removed', 'success'); }}
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
                    <SortableContext items={(form.profile.links || []).map((l: Link) => l.id)} strategy={verticalListSortingStrategy}>
                      <div className="grid gap-4">
                        {(form.profile.links || []).map((link: Link, i: number) => (
                          <SortableLink
                            key={link.id}
                            id={link.id}
                            link={link}
                            onEdit={() => { setEditLinkIndex(i); setShowLinkModal(true); }}
                            onDelete={() => {
                              setForm({ ...form, profile: { ...form.profile, links: (form.profile.links || []).filter((_: Link, j: number) => j !== i) } });
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
                    <SortableContext items={(form.profile.headers || []).map((h) => h.id)} strategy={verticalListSortingStrategy}>
                      <div className="grid gap-3">
                        {(form.profile.headers || []).map((header, i: number) => (
                          <SortableLink
                            key={header.id}
                            id={header.id}
                            link={{ ...(header as any), type: 'header' }}
                            onEdit={() => { setEditHeaderIndex(i); setShowHeaderModal(true); }}
                            onDelete={() => {
                              setForm({ ...form, profile: { ...form.profile, headers: (form.profile.headers || []).filter((_: any, j: number) => j !== i) } });
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
                    value={form.profile.about || ''}
                    onChange={(val) => setForm({ ...form, profile: { ...form.profile, about: val } })}
                    placeholder="Tell your story, skills, mission..."
                    disable={aboutDisabled}
                  />
                </LockedOverlay>
              </Section>
            );
          case 'contact':
            return <ContactInfoSection key={key} form={form} setForm={setForm} canUseContact={limits.contact} />;
          case 'location':
            return (
              <Section key={key} title={<span>Business Location <span className="badge-pro">Pro</span></span>}>
                <LockedOverlay enabled={!mapDisabled} mode="notice">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input className="input" placeholder="Full address" value={form.profile.fullAddress || ''} disabled={mapDisabled}
                      onChange={(e) => setForm({ ...form, profile: { ...form.profile, fullAddress: e.target.value } })} />
                    <input className="input" placeholder="Latitude (-90 to 90)" value={form.profile.latitude || ''} disabled={mapDisabled}
                      onChange={(e) => setForm({ ...form, profile: { ...form.profile, latitude: e.target.value } })}
                      onBlur={(e) => {
                        const v = clampLat(e.target.value);
                        if (v === null) showToast('Latitude must be a number between -90 and 90.', 'error');
                        else setForm({ ...form, profile: { ...form.profile, latitude: v } });
                      }}
                    />
                    <input className="input" placeholder="Longitude (-180 to 180)" value={form.profile.longitude || ''} disabled={mapDisabled}
                      onChange={(e) => setForm({ ...form, profile: { ...form.profile, longitude: e.target.value } })}
                      onBlur={(e) => {
                        const v = clampLng(e.target.value);
                        if (v === null) showToast('Longitude must be a number between -180 and 180.', 'error');
                        else setForm({ ...form, profile: { ...form.profile, longitude: v } });
                      }}
                    />
                  </div>
                  <div className="mt-4">
                    <iframe
                      className="rounded-xl w-full h-64 border"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={
                        form.profile.latitude && form.profile.longitude
                          ? `https://www.google.com/maps?q=${form.profile.latitude},${form.profile.longitude}&output=embed`
                          : form.profile.fullAddress
                            ? `https://www.google.com/maps?q=${encodeURIComponent(form.profile.fullAddress)}&output=embed`
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
                        if (!file?.type?.includes('pdf')) {
                          showToast('Please upload a PDF resume.', 'error');
                          return;
                        }
                        if (form.profile.resumeUrl?.startsWith('blob:')) URL.revokeObjectURL(form.profile.resumeUrl);
                        const reader = new FileReader();
                        reader.onload = () => {
                          const blob = new Blob([reader.result as ArrayBuffer], { type: file.type });
                          const url = URL.createObjectURL(blob);
                          setForm({ ...form, profile: { ...form.profile, resumeUrl: url } });
                          showToast('Resume added', 'success');
                        };
                        reader.readAsArrayBuffer(file);
                      }}
                    />
                    {form.profile.resumeUrl && (
                      <div className={styles.resumeActions}>
                        <a href={form.profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">View Resume</a>
                        <button
                          className="btn-destructive"
                          onClick={() => {
                            if (form.profile.resumeUrl?.startsWith('blob:')) URL.revokeObjectURL(form.profile.resumeUrl);
                            setForm({ ...form, profile: { ...form.profile, resumeUrl: '' } });
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
                    <SortableContext items={(form.profile.featured || []).map((f: FeaturedMedia) => f.id)} strategy={verticalListSortingStrategy}>
                      <div className="grid gap-3">
                        {(form.profile.featured || []).map((featured: FeaturedMedia, i: number) => (
                          <SortableFeaturedMediaItem
                            key={featured.id}
                            id={featured.id}
                            media={featured}
                            onEdit={() => { setEditFeaturedIndex(i); setShowFeaturedModal(true); }}
                            onDelete={() => {
                              setForm({ ...form, profile: { ...form.profile, featured: (form.profile.featured || []).filter((_: any, j: number) => j !== i) } });
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
                    <SortableContext items={(form.profile.embeds || []).map((e: Embed) => e.id)} strategy={verticalListSortingStrategy}>
                      <div className="grid gap-3">
                        {(form.profile.embeds || []).map((embed: Embed, i: number) => (
                          <SortableLink
                            key={embed.id}
                            id={embed.id}
                            link={{ ...embed, type: 'embed' }}
                            onEdit={() => { setEditEmbedIndex(i); setShowEmbedModal(true); }}
                            onDelete={() => {
                              setForm({ ...form, profile: { ...form.profile, embeds: (form.profile.embeds || []).filter((_: any, j: number) => j !== i) } });
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
                    <SortableContext items={(form.profile.services || []).map((s: Service) => s.id)} strategy={verticalListSortingStrategy}>
                      <div className="grid gap-3">
                        {(form.profile.services || []).map((service: Service, i: number) => (
                          <SortableService
                            key={service.id}
                            id={service.id}
                            service={service}
                            onEdit={() => { setEditServiceIndex(i); setShowServiceModal(true); }}
                            onDelete={() => {
                              setForm({ ...form, profile: { ...form.profile, services: (form.profile.services || []).filter((_: any, j: number) => j !== i) } });
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
                    <SortableContext items={(form.profile.testimonials || []).map((t: Testimonial) => t.id)} strategy={verticalListSortingStrategy}>
                      <div className="grid gap-3">
                        {(form.profile.testimonials || []).map((t: Testimonial, i: number) => (
                          <SortableTestimonial
                            key={t.id}
                            id={t.id}
                            testimonial={t}
                            onEdit={() => { setEditTestimonialIndex(i); setShowTestimonialModal(true); }}
                            onDelete={() => {
                              setForm({ ...form, profile: { ...form.profile, testimonials: (form.profile.testimonials || []).filter((_: any, j: number) => j !== i) } });
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
                    <SortableContext items={(form.profile.faqs || []).map((f: FAQ) => f.id)} strategy={verticalListSortingStrategy}>
                      <div className="grid gap-3">
                        {(form.profile.faqs || []).map((faq: FAQ, i: number) => (
                          <SortableFAQ
                            key={faq.id}
                            id={faq.id}
                            faq={faq}
                            onEdit={() => { setEditFAQIndex(i); setShowFAQModal(true); }}
                            onDelete={() => {
                              setForm({ ...form, profile: { ...form.profile, faqs: (form.profile.faqs || []).filter((_: any, j: number) => j !== i) } });
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
        <LockedOverlay enabled={limits.showSubscribers} mode="overlay">
          <ToggleSwitch
            label="Show Subscribe Section"
            checked={!form.subscriberSettings.subscriberSettings.hideSubscribeButton}
            onChange={(checked) =>
              setForm((prev) => ({
                ...prev,
                subscriberSettings: {
                  ...prev.subscriberSettings,
                  subscriberSettings: {
                    ...prev.subscriberSettings.subscriberSettings,
                    hideSubscribeButton: !checked,
                  },
                },
              }))
            }
            isPro={plan !== 'free'}
            description="Collect emails for launches, offers and updates."
          />
        </LockedOverlay>
      </Section>

      <ProfileTagsSection form={form} setForm={setForm} limit={limits.tags} />

      {showLinkModal && (
        <LinkFormModal
          onSave={handleAddLink}
          onClose={() => { setShowLinkModal(false); setEditLinkIndex(null); }}
          initialData={editLinkIndex !== null ? form.profile.links[editLinkIndex] : undefined}
        />
      )}

      {showHeaderModal && (
        <HeaderFormModal
          initialData={editHeaderIndex !== null ? form.profile.headers?.[editHeaderIndex] : undefined}
          onClose={() => setShowHeaderModal(false)}
          onSave={(newHeader) => {
            if (!newHeader?.title?.trim()) { showToast('Header title is required.', 'error'); return; }
            const updated = [...(form.profile.headers || [])];
            if (editHeaderIndex !== null) updated[editHeaderIndex] = { ...updated[editHeaderIndex], ...newHeader };
            else updated.push({ ...newHeader, id: `header-${Date.now() + Math.random()}` });
            setForm({ ...form, profile: { ...form.profile, headers: updated } });
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
              setForm({ ...form, profile: { ...form.profile, avatar: val } });
              setUploadPreview(val);
              showToast('Profile image updated', 'success');
            } else {
              const reader = new FileReader();
              reader.onload = () => {
                setForm({ ...form, profile: { ...form.profile, avatar: reader.result as string } });
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
          initialData={editEmbedIndex !== null ? form.profile.embeds[editEmbedIndex] : undefined}
        />
      )}

      {showTestimonialModal && (
        <TestimonialFormModal
          onClose={() => setShowTestimonialModal(false)}
          initialData={editTestimonialIndex !== null ? form.profile.testimonials?.[editTestimonialIndex] : undefined}
          onSave={(newTestimonial) => {
            if (!newTestimonial?.name?.trim() || !newTestimonial?.message?.trim()) {
              showToast('Testimonial name and message are required.', 'error');
              return;
            }
            if (editTestimonialIndex !== null) {
              const updated = [...(form.profile.testimonials || [])];
              updated[editTestimonialIndex] = { ...updated[editTestimonialIndex], ...newTestimonial };
              setForm({ ...form, profile: { ...form.profile, testimonials: updated } });
            } else {
              if (testimonialsLimitReached) { showToast(`Testimonials limit reached (${limits.testimonials}).`, 'error'); return; }
              const id = `testimonial-${Date.now() + Math.random()}`;
              setForm({
                ...form,
                profile: {
                  ...form.profile,
                  testimonials: [...(form.profile.testimonials || []), { ...newTestimonial, id }],
                },
              });
            }
            setShowTestimonialModal(false);
            showToast('Testimonial saved', 'success');
          }}
        />
      )}

      {showFAQModal && (
        <FAQFormModal
          onClose={() => setShowFAQModal(false)}
          initialData={editFAQIndex !== null ? form.profile.faqs?.[editFAQIndex] : undefined}
          onSave={(newFaq) => {
            if (!newFaq?.question?.trim() || !newFaq?.answer?.trim()) {
              showToast('FAQ question and answer are required.', 'error');
              return;
            }
            if (editFAQIndex !== null) {
              const updated = [...(form.profile.faqs || [])];
              updated[editFAQIndex] = { ...updated[editFAQIndex], ...newFaq };
              setForm({ ...form, profile: { ...form.profile, faqs: updated } });
            } else {
              if (faqsLimitReached) { showToast(`FAQ limit reached (${limits.faqs}).`, 'error'); return; }
              const id = `faq-${Date.now() + Math.random()}`;
              setForm({
                ...form,
                profile: {
                  ...form.profile,
                  faqs: [...(form.profile.faqs || []), { ...newFaq, id }],
                },
              });
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
          initialData={
            editServiceIndex !== null ? form.profile.services[editServiceIndex] : undefined
          }
        />
      )}


      {showFeaturedModal && (
        <FeaturedMediaModal
          onClose={() => setShowFeaturedModal(false)}
          onSave={handleSaveFeatured}
          initialData={editFeaturedIndex !== null ? form.profile.featured?.[editFeaturedIndex] : undefined}
        />
      )}

      {showUploadBannerModal && (
        <UploadModal
          onClose={() => setShowUploadBannerModal(false)}
          onSelectImage={(val) => {
            if (typeof val === 'string') {
              setForm({ ...form, profile: { ...form.profile, bannerImage: val } });
              setBannerPreview(val);
              setShowUploadBannerModal(false);
              showToast('Cover image updated', 'success');
            } else if (val instanceof File) {
              const reader = new FileReader();
              reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                  setForm({ ...form, profile: { ...form.profile, bannerImage: reader.result } });
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
