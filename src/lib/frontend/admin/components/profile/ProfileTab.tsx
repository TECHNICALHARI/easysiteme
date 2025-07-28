'use client';

import { useState, useEffect, ActionDispatch, FC, useRef } from 'react';
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

import { ImagePlus, FileText, Youtube, Link as LinkIcon, X, Pencil, Trash2, MapPin } from 'lucide-react';
import styles from '@/styles/admin.module.css';
import SortableLink from './SortableLink';
import LinkFormModal from './LinkFormModal';
import CustomModal from '../../../common/CustomModal';
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
import { FormData, ProfileTypeMap, ReorderableProfileKeys } from '../../../types/form';
import { PLAN_FEATURES } from '@/config/PLAN_FEATURES';
import LockedOverlay from '../../layout/LockedOverlay';
import ResumeUpload, { ResumeUploadRef } from './ResumeUpload';


interface props {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>
}



const ProfileTab: FC<props> = ({ form, setForm }) => {
  const plan = 'premium';
  const limits = PLAN_FEATURES[plan];

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [showHeaderModal, setShowHeaderModal] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('');
  const [editHeaderIndex, setEditHeaderIndex] = useState<number | null>(null);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(form.profile.avatar || null);

  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [editEmbedIndex, setEditEmbedIndex] = useState<number | null>(null);

  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editTestimonialIndex, setEditTestimonialIndex] = useState<number | null>(null);
  const [testimonialName, setTestimonialName] = useState('');
  const [testimonialMessage, setTestimonialMessage] = useState('');
  const [testimonialAvatar, setTestimonialAvatar] = useState('');
  const [testimonialAvatarPreview, setTestimonialAvatarPreview] = useState<string | null>(null);
  const [showTestimonialUpload, setShowTestimonialUpload] = useState(false);

  const [showFAQModal, setShowFAQModal] = useState(false);
  const [editFAQIndex, setEditFAQIndex] = useState<number | null>(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');

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

  const handleDragEnd = <T extends ReorderableProfileKeys>(type: T) => (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active?.id || !over?.id || active.id === over.id) return;

    const sectionItems = form.profile[type] as ProfileTypeMap[T];

    const oldIndex = sectionItems.findIndex((i) => i.id === active.id);
    const newIndex = sectionItems.findIndex((i) => i.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove([...sectionItems], oldIndex, newIndex);

      setForm((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [type]: reordered as any,
        },
      }));
    }
  };



  const handleImageRemove = () => {
    setForm({ ...form, profile: { ...form.profile, avatar: '' } });
    setUploadPreview(null);
  };

  const handleAddLink = (data: any) => {
    const updated = [...form.profile.links];
    if (editIndex !== null) {
      updated[editIndex] = data;
    } else {
      updated.push({ ...data, id: `link-${Date.now()}` });
    }
    setForm({ ...form, profile: { ...form.profile, links: updated } });
    setShowModal(false);
    setEditIndex(null);
  };

  const handleSaveEmbed = (data: { title: string; url: string }) => {
    const updated = [...(form.profile.embeds || [])];
    if (editEmbedIndex !== null) {
      updated[editEmbedIndex] = { ...updated[editEmbedIndex], ...data };
    } else {
      updated.push({ ...data, id: `embed-${Date.now()}` });
    }
    setForm({ ...form, profile: { ...form.profile, embeds: updated } });
    setShowEmbedModal(false);
    setEditEmbedIndex(null);
  };

  const handleSaveService = (data: any) => {
    const updated = [...(form.profile.services || [])];
    const newData = {
      id: editServiceIndex !== null ? form.profile.services[editServiceIndex].id : `service-${Date.now()}`,
      ...data,
    };
    if (editServiceIndex !== null) {
      updated[editServiceIndex] = newData;
    } else {
      updated.push(newData);
    }
    setForm({ ...form, profile: { ...form.profile, services: updated } });
    setShowServiceModal(false);
    setEditServiceIndex(null);
  };

  const handleSaveFeatured = (newFeatured: any) => {
    const updated = [...(form.profile.featured || [])];
    if (editFeaturedIndex !== null) {
      updated[editFeaturedIndex] = { ...updated[editFeaturedIndex], ...newFeatured };
    } else {
      const id = `featured-${Date.now() + Math.random()}`;
      updated.push({ ...newFeatured, id });
    }
    setForm({ ...form, profile: { ...form.profile, featured: updated } });
    setShowFeaturedModal(false);
    setEditFeaturedIndex(null);
  };

  useEffect(() => {
    if (form.profile.avatar) setUploadPreview(form.profile.avatar);
  }, [form.profile.avatar]);

  useEffect(() => {
    if (testimonialAvatar) setTestimonialAvatarPreview(testimonialAvatar);
  }, [testimonialAvatar]);

  useEffect(() => {
    if (form.profile.bannerImage) setBannerPreview(form.profile.bannerImage);
  }, [form.profile.bannerImage]);



  const headersLimitReached = (form.profile.headers ?? []).length >= limits.headers;
  const linksLimitReached = (form.profile.links ?? []).length >= limits.links;

  const isServicesEnabled = limits.faqs > 0;
  const servicesLimitReached = (form.profile.services?.length || 0) >= limits.services;
  const showServicesLimitNotice = isServicesEnabled && servicesLimitReached;


  const isfaqsEnabled = limits.faqs > 0;
  const faqsLimitReached = (form.profile.faqs?.length || 0) >= limits.faqs;
  const showFaqsLimitNotice = isfaqsEnabled && faqsLimitReached;

  const isTestimonialsEnabled = limits.testimonials > 0;
  const testimonialsLimitReached = (form.profile.testimonials?.length || 0) >= limits.testimonials;
  const showTestimonialsLimitNotice = isTestimonialsEnabled && testimonialsLimitReached;


  const isFeaturedEnabled = limits.featured > 0;
  const featuredLimitReached = (form.profile.featured?.length || 0) >= limits.featured;
  const showFeaturedLimitNotice = isFeaturedEnabled && featuredLimitReached;
  // const postsLimitReached = (form.profile.posts ?? []).length >= limits.posts;
  const isEmbedEnabled = limits.embeds > 0;
  const embedsLimitReached = (form.profile.embeds?.length || 0) >= limits.embeds;
  const showLimitMessage = isEmbedEnabled && embedsLimitReached;

  const aboutDisabled = !limits.about;
  const bannerImageDisabled = !limits.bannerImage;
  const contactDisabled = !limits.contact;
  const mapDisabled = !limits.map;
  const resumeDisabled = !limits.resume;
  const customThemeDisabled = !limits.customTheme;

  return (
    <>
      <div className={styles.TabPageMain}>
        <div className={styles.sectionHead}>
          <h3>Set Up Your Profile</h3>
          <p>Personalize your page with your name, image, bio, contact info, embeds, and more.</p>
        </div>

        <div className={styles.sectionMain}>
          <div className={styles.sectionHead}><h3>👤 Profile Information</h3></div>
          <div className={styles.linkFormInputImg}>
            <div>
              <input
                className="input"
                type="text"
                placeholder="Full Name"
                value={form.profile.fullName}
                onChange={(e) => setForm({ ...form, profile: { ...form.profile, fullName: e.target.value } })}
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
                <LockedOverlay enabled={!bannerImageDisabled} mode='overlay'>
                  {bannerPreview ? (
                    <div className="relative w-full">
                      <img
                        src={bannerPreview}
                        alt="Cover Banner"
                        className="w-full h-40 object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => {
                          setForm({ ...form, profile: { ...form.profile, bannerImage: '' } });
                          setBannerPreview(null);
                        }}
                        className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white"
                        title="Remove Image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className={styles.SecHeadAndBtn}>
                      <button className="btn-primary" onClick={() => setShowUploadBannerModal(true)}>
                        Upload Cover Image
                      </button>
                    </div>
                  )}
                </LockedOverlay>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
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
                    <ImagePlus className="text-gray-400" size={24} />
                    <span className="text-xs text-gray-500 mt-1">Upload Image</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.sectionMain}>
          <div className={styles.SecHeadAndBtn}>
            <h4 className={styles.sectionLabel}>About <span className="badge-pro">Pro</span></h4>
          </div>
          <LockedOverlay enabled={!aboutDisabled} mode='notice'>
            <RichTextEditor
              value={form.profile.about || ''}
              onChange={(val) => setForm({ ...form, profile: { ...form.profile, about: val } })}
              placeholder="Tell your story, skills, mission..."
              disable={aboutDisabled}
            />
          </LockedOverlay>
        </div>

        <div className={styles.sectionMain}>
          <div className={styles.SecHeadAndBtn}>
            <h4>Headers</h4>
            <button
              className="btn-primary"
              onClick={() => setShowHeaderModal(true)}
              disabled={headersLimitReached}
            >
              + Add Header
            </button>
          </div>
          <LockedOverlay
            mode='notice'
            enabled={!headersLimitReached}
            limitReached={headersLimitReached}
          >
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd('headers')}>
              <SortableContext items={form.profile.headers.map((h: any) => h.id)} strategy={verticalListSortingStrategy}>
                <div className="grid gap-3">
                  {form.profile.headers.map((header: any, i: number) => (
                    <SortableLink
                      key={header.id}
                      id={header.id}
                      link={{ ...header, type: 'header' }}
                      onEdit={() => {
                        setEditHeaderIndex(i);
                        setHeaderTitle(header.title);
                        setShowHeaderModal(true);
                      }}
                      onDelete={() =>
                        setForm({
                          ...form,
                          profile: {
                            ...form.profile,
                            headers: form.profile.headers.filter((_, j) => j !== i),
                          },
                        })
                      }
                      isHeader
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </LockedOverlay>
        </div>

        <div className={styles.sectionMain}>
          <div className={styles.SecHeadAndBtn}>
            <h4>Links</h4>
            <button
              className="btn-primary"
              onClick={() => setShowModal(true)}
              disabled={linksLimitReached}
            >
              + Add Link
            </button>
          </div>
          <LockedOverlay
            mode='notice'
            enabled={!linksLimitReached}
            limitReached={linksLimitReached}
          >
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd('links')}>
              <SortableContext items={form.profile.links.map((l: any) => l.id)} strategy={verticalListSortingStrategy}>
                <div className="grid gap-4">
                  {form.profile.links.map((link: any, i: number) => (
                    <SortableLink
                      key={link.id}
                      id={link.id}
                      link={link}
                      onEdit={() => {
                        setEditIndex(i);
                        setShowModal(true);
                      }}
                      onDelete={() =>
                        setForm({
                          ...form,
                          profile: {
                            ...form.profile,
                            links: form.profile.links.filter((_, j) => j !== i),
                          },
                        })
                      }
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </LockedOverlay>
        </div>

        {limits.contact && (
          <ContactInfoSection form={form} setForm={setForm} />
        )}

        <div className={styles.sectionMain}>
          <div className={styles.SecHeadAndBtn}>
            <h4 className={styles.sectionLabel}>
              <MapPin size={18} className="inline-block mr-1 mb-1 text-gray-700" />
              Business Location <span className="badge-pro">Pro</span>
            </h4>
          </div>
          <LockedOverlay enabled={!mapDisabled} mode='notice'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="input"
                placeholder="Enter your business or coaching location (e.g. Building name, street, area, city)"
                value={form.profile.fullAddress || ''}
                disabled={mapDisabled}
                onChange={(e) => setForm({ ...form, profile: { ...form.profile, fullAddress: e.target.value } })}
              />
              <input
                className="input"
                type="text"
                placeholder="Latitude (optional)"
                value={form.profile.latitude || ''}
                disabled={mapDisabled}
                onChange={(e) => setForm({ ...form, profile: { ...form.profile, latitude: e.target.value } })}
              />
              <input
                className="input"
                type="text"
                placeholder="Longitude (optional)"
                value={form.profile.longitude || ''}
                disabled={mapDisabled}
                onChange={(e) => setForm({ ...form, profile: { ...form.profile, longitude: e.target.value } })}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              To find your coordinates:
              <ol className="list-decimal ml-5 mt-1 space-y-1">
                <li>Open <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Maps</a>.</li>
                <li>Right-click your location and choose <strong>“What’s here?”</strong>.</li>
                <li>Copy the coordinates shown at the bottom (e.g. <code>28.5355, 77.3910</code>).</li>
                <li>Paste latitude in the first field, longitude in the second.</li>
              </ol>
            </p>
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
              ></iframe>

              <a
                href={
                  form.profile.latitude && form.profile.longitude
                    ? `https://www.google.com/maps/dir/?api=1&destination=${form.profile.latitude},${form.profile.longitude}`
                    : form.profile.fullAddress
                      ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(form.profile.fullAddress)}`
                      : `https://www.google.com/maps?q=28.6139,77.2090`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-3 inline-block"
              >
                Navigate Here
              </a>

              {mapDisabled && !form.profile.latitude && !form.profile.longitude && !form.profile.fullAddress && (
                <p className="text-xs text-center text-gray-500 mt-2 italic">
                  This is a sample location preview. Upgrade to set your business location.
                </p>
              )}
            </div>

          </LockedOverlay>
        </div>

        <div className={styles.sectionMain}>
          <div className={styles.SecHeadAndBtn}>
            <h4 className={styles.sectionLabel}>
              <FileText size={18} className="inline-block mr-1 mb-1 text-gray-700" />
              Upload Resume <span className="badge-pro">Pro</span>
            </h4>
          </div>
          <LockedOverlay enabled={!resumeDisabled}>
            <div className={styles.resumeUploadBox}>
              <ResumeUpload
                ref={resumeRef}
                onSelectFile={(file) => {
                  if (form.profile.resumeUrl?.startsWith('blob:')) {
                    URL.revokeObjectURL(form.profile.resumeUrl);
                  }

                  const reader = new FileReader();
                  reader.onload = () => {
                    const blob = new Blob([reader.result as ArrayBuffer], { type: file.type });
                    const url = URL.createObjectURL(blob);
                    setForm({
                      ...form,
                      profile: { ...form.profile, resumeUrl: url },
                    });
                  };
                  reader.readAsArrayBuffer(file);
                }}
              />

              {form.profile.resumeUrl && (
                <div className={styles.resumeActions}>
                  <a
                    href={form.profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    View Resume
                  </a>
                  <button
                    className="btn-destructive"
                    onClick={() => {
                      if (form.profile.resumeUrl?.startsWith('blob:')) {
                        URL.revokeObjectURL(form.profile.resumeUrl);
                      }
                      setForm({
                        ...form,
                        profile: { ...form.profile, resumeUrl: '' },
                      });
                      resumeRef.current?.reset();
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </LockedOverlay>
        </div>

        <div className={styles.sectionMain}>
          <div className={styles.SecHeadAndBtn}>
            <h4>
              Featured Media{" "}
              <Youtube size={16} className="inline-block ml-1 mb-1" />{" "}
              <span className="badge-pro">Pro</span>
            </h4>
            <button
              className="btn-primary"
              onClick={() => {
                setEditFeaturedIndex(null);
                setShowFeaturedModal(true);
              }}
              disabled={featuredLimitReached}
            >
              + Add Media
            </button>
          </div>
          <LockedOverlay
            enabled={isFeaturedEnabled && !featuredLimitReached}
            limitReached={showFeaturedLimitNotice}
            mode="notice"
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd("featured")}
            >
              <SortableContext
                items={(form.profile.featured || []).map((f: any) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid gap-3">
                  {(form.profile.featured || []).map((featured: any, i: number) => (
                    <SortableFeaturedMediaItem
                      key={featured.id}
                      id={featured.id}
                      media={featured}
                      onEdit={() => {
                        setEditFeaturedIndex(i);
                        setShowFeaturedModal(true);
                      }}
                      onDelete={() =>
                        setForm({
                          ...form,
                          profile: {
                            ...form.profile,
                            featured: form.profile.featured.filter(
                              (_: any, j: number) => j !== i
                            ),
                          },
                        })
                      }
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </LockedOverlay>
        </div>

        <div className={styles.sectionMain}>
          <div className={styles.SecHeadAndBtn}>
            <h4>
              Embed Widgets{" "}
              <LinkIcon size={16} className="inline-block ml-1 mb-1" />{" "}
              <span className="badge-pro">Pro</span>
            </h4>
            <button
              className="btn-primary"
              onClick={() => setShowEmbedModal(true)}
              disabled={embedsLimitReached}
            >
              + Add Embed
            </button>
          </div>
          <LockedOverlay
            enabled={isEmbedEnabled && !embedsLimitReached}
            limitReached={showLimitMessage}
            mode="notice"
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd("embeds")}
            >
              <SortableContext
                items={(form.profile.embeds || []).map((e: any) => e.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid gap-3">
                  {(form.profile.embeds || []).map((embed: any, i: number) => (
                    <SortableLink
                      key={embed.id}
                      id={embed.id}
                      link={{ ...embed, type: "embed" }}
                      onEdit={() => {
                        setEditEmbedIndex(i);
                        setShowEmbedModal(true);
                      }}
                      onDelete={() =>
                        setForm({
                          ...form,
                          profile: {
                            ...form.profile,
                            embeds: form.profile.embeds.filter(
                              (_: any, j: number) => j !== i
                            ),
                          },
                        })
                      }
                      isEmbed
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </LockedOverlay>
        </div>

        <div className={styles.sectionMain}>
          <div className={styles.SecHeadAndBtn}>
            <h4>
              Testimonials <span className="badge-pro">Pro</span>
            </h4>
            <button
              className="btn-primary"
              onClick={() => {
                setEditTestimonialIndex(null);
                setTestimonialName("");
                setTestimonialMessage("");
                setTestimonialAvatar("");
                setTestimonialAvatarPreview(null);
                setShowTestimonialModal(true);
              }}
              disabled={testimonialsLimitReached}
            >
              + Add Testimonial
            </button>
          </div>
          <LockedOverlay enabled={isTestimonialsEnabled && !testimonialsLimitReached} limitReached={showTestimonialsLimitNotice} mode='notice'>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd("testimonials")}
            >
              <SortableContext
                items={(form.profile.testimonials || []).map((t: any) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid gap-3">
                  {(form.profile.testimonials || []).map((t: any, i: number) => (
                    <SortableTestimonial
                      key={t.id}
                      id={t.id}
                      testimonial={t}
                      onEdit={() => {
                        setEditTestimonialIndex(i);
                        setTestimonialName(t.name);
                        setTestimonialMessage(t.message);
                        setTestimonialAvatar(t.avatar || "");
                        setTestimonialAvatarPreview(t.avatar || "");
                        setShowTestimonialModal(true);
                      }}
                      onDelete={() =>
                        setForm({
                          ...form,
                          profile: {
                            ...form.profile,
                            testimonials: form.profile.testimonials.filter(
                              (_: any, j: number) => j !== i
                            ),
                          },
                        })
                      }
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </LockedOverlay>
        </div>
        <div className={styles.sectionMain}>
          <div className={styles.SecHeadAndBtn}>
            <h4>FAQs <span className="badge-pro">Pro</span></h4>
            <button
              className="btn-primary"
              onClick={() => {
                setEditFAQIndex(null);
                setFaqQuestion('');
                setFaqAnswer('');
                setShowFAQModal(true);
              }}
              disabled={faqsLimitReached}
            >
              + Add FAQ
            </button>
          </div>
          <LockedOverlay enabled={isfaqsEnabled && !faqsLimitReached} limitReached={showFaqsLimitNotice} mode='notice'>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd('faqs')}>
              <SortableContext items={form.profile.faqs.map((f: any) => f.id)} strategy={verticalListSortingStrategy}>
                <div className="grid gap-3">
                  {form.profile.faqs.map((faq: any, i: number) => (
                    <SortableFAQ
                      key={faq.id}
                      id={faq.id}
                      faq={faq}
                      onEdit={() => {
                        setEditFAQIndex(i);
                        setFaqQuestion(faq.question);
                        setFaqAnswer(faq.answer);
                        setShowFAQModal(true);
                      }}
                      onDelete={() =>
                        setForm({
                          ...form,
                          profile: {
                            ...form.profile,
                            faqs: form.profile.faqs.filter((_: any, j: number) => j !== i),
                          },
                        })
                      }
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </LockedOverlay>
        </div>

        <div className={styles.sectionMain}>
          <div className={styles.SecHeadAndBtn}>
            <h4>Services <span className="badge-pro">Pro</span></h4>
            <button
              className="btn-primary"
              onClick={() => {
                setEditServiceIndex(null);
                setShowServiceModal(true);
              }}
              disabled={servicesLimitReached}
            >
              + Add Service
            </button>
          </div>
          <LockedOverlay enabled={isServicesEnabled && !servicesLimitReached} limitReached={showServicesLimitNotice} mode='notice'>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd('services')}>
              <SortableContext items={form.profile.services.map((s: any) => s.id)} strategy={verticalListSortingStrategy}>
                <div className="grid gap-3">
                  {form.profile.services.map((service: any, i: number) => (
                    <SortableService
                      key={service.id}
                      id={service.id}
                      service={service}
                      onEdit={() => {
                        setEditServiceIndex(i);
                        setShowServiceModal(true);
                      }}
                      onDelete={() =>
                        setForm({
                          ...form,
                          profile: {
                            ...form.profile,
                            services: form.profile.services.filter((_: any, j: number) => j !== i),
                          },
                        })
                      }
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </LockedOverlay>
        </div>
       
          <ProfileTagsSection
            form={form}
            setForm={setForm}
            limit={limits.tags}
          />
      
      </div>

      {showModal && (
        <LinkFormModal
          onSave={handleAddLink}
          onClose={() => {
            setShowModal(false);
            setEditIndex(null);
          }}
          initialData={editIndex !== null ? form.profile.links[editIndex] : undefined}
        />
      )}

      {showHeaderModal && (
        <HeaderFormModal
          initialData={editHeaderIndex !== null ? form.profile.headers?.[editHeaderIndex] : undefined}
          onClose={() => setShowHeaderModal(false)}
          onSave={(newHeader) => {
            const updated = [...form.profile.headers];
            if (editHeaderIndex !== null) {
              updated[editHeaderIndex] = {
                ...updated[editHeaderIndex],
                ...newHeader,
              };
            } else {
              const id = `header-${Date.now() + Math.random()}`;
              updated.push({ ...newHeader, id });
            }
            setForm({ ...form, profile: { ...form.profile, headers: updated } });
            setShowHeaderModal(false);
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
            }
            else {
              const reader = new FileReader();
              reader.onload = () => {
                setForm({ ...form, profile: { ...form.profile, avatar: reader.result as string } });
                setUploadPreview(reader.result as string)
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
          onClose={() => {
            setShowEmbedModal(false);
            setEditEmbedIndex(null);
          }}
          initialData={
            editEmbedIndex !== null ? form.profile.embeds[editEmbedIndex] : undefined
          }
        />
      )}


      {showTestimonialModal && (
        <TestimonialFormModal
          onClose={() => setShowTestimonialModal(false)}
          initialData={
            editTestimonialIndex !== null ? form.profile.testimonials?.[editTestimonialIndex] : undefined
          }
          onSave={(newTestimonial) => {
            if (editTestimonialIndex !== null) {
              const updated = [...form.profile.testimonials];
              updated[editTestimonialIndex] = { ...updated[editTestimonialIndex], ...newTestimonial };
              setForm({ ...form, profile: { ...form.profile, testimonials: updated } });
            } else {
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
          }}
        />
      )}

      {showFAQModal && (
        <FAQFormModal
          onClose={() => setShowFAQModal(false)}
          initialData={editFAQIndex !== null ? form.profile.faqs?.[editFAQIndex] : undefined}
          onSave={(newFaq) => {
            if (editFAQIndex !== null) {
              const updated = [...form.profile.faqs];
              updated[editFAQIndex] = { ...updated[editFAQIndex], ...newFaq };
              setForm({ ...form, profile: { ...form.profile, faqs: updated } });
            } else {
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
          }}
        />
      )}

      {showTestimonialUpload && (
        <UploadModal
          onClose={() => setShowTestimonialUpload(false)}
          onSelectImage={(val) => {
            if (typeof val === 'string') {
              setTestimonialAvatar(val);
              setTestimonialAvatarPreview(val);
            } else {
              const reader = new FileReader();
              reader.onload = () => {
                if (typeof reader.result === 'string') {
                  setTestimonialAvatar(reader.result);
                  setTestimonialAvatarPreview(reader.result);
                }
              };
              reader.readAsDataURL(val);
            }
            setShowTestimonialUpload(false);
          }}
          showTabs={false}
        />
      )}

      {showServiceModal && (
        <ServiceFormModal
          onClose={() => setShowServiceModal(false)}
          onSave={handleSaveService}
          initialData={editServiceIndex !== null ? {
            ...form.profile.services[editServiceIndex],
            price: form.profile.services[editServiceIndex].price?.toString(),
          } : undefined}
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
            } else if (val instanceof File) {
              const reader = new FileReader();
              reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                  setForm({ ...form, profile: { ...form.profile, bannerImage: reader.result } });
                  setBannerPreview(reader.result);
                }
                setShowUploadBannerModal(false);
              };
              reader.readAsDataURL(val);
            }
          }}
          showTabs={false}
        />
      )}

    </>
  );
}
export default ProfileTab