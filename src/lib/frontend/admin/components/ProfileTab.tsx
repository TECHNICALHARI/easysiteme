'use client';

import { useState, useEffect } from 'react';
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

import { ImagePlus, MapPin, FileText, Youtube, Link as LinkIcon, X, Pencil, Trash2 } from 'lucide-react';
import styles from '@/styles/admin.module.css';

import SortableLink from './SortableLink';
import LinkFormModal from './LinkFormModal';
import CustomModal from '../../common/CustomModal';
import UploadModal from '../../common/UploadModal';
import EmbedFormModal from './EmbedFormModal';
import RichTextEditor from '../../common/RichTextEditor';
import SortableTestimonial from './SortableTestimonial';
import SortableFAQ from './SortableFAQ';
import ServiceFormModal from './ServiceFormModal';
import SortableService from './SortableService';
import Modal from '../../common/Modal';
import { TestimonialFormModal } from './TestimonialFormModal';
import { FAQFormModal } from './FAQFormModal';
import { HeaderFormModal } from './HeaderFormModal';
import ContactInfoSection from './ContactInfoSection';
import FeaturedMediaModal from './FeaturedMediaModal';
import FeaturedMediaSection from './FeaturedMediaSection';
import SortableFeaturedMediaItem from './FeaturedMediaSection';

const PLAN_LIMITS = {
  free: { links: 3, headers: 1, embeds: 0, contact: false, resume: false, featured: false, about: false, map: false, testimonials: 0, faqs: 0, services: 0 },
  premium: { links: 50, headers: 10, embeds: 10, contact: true, resume: true, featured: true, about: true, map: true, testimonials: 5, faqs: 10, services: 10 },
};

export default function ProfileTab({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  const plan = 'premium'; // assume premium
  const limits = PLAN_LIMITS[plan];

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [showHeaderModal, setShowHeaderModal] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('');
  const [editHeaderIndex, setEditHeaderIndex] = useState<number | null>(null);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(form.avatar || null);

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
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (type: 'links' | 'headers' | 'embeds' | 'testimonials' | 'faqs' | 'services' | 'featured') => (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active?.id || !over?.id || active.id === over.id) return;
    const oldIndex = form[type].findIndex((i: any) => i.id === active.id);
    const newIndex = form[type].findIndex((i: any) => i.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(form[type], oldIndex, newIndex);
      setForm({ ...form, [type]: reordered });
    }
  };


  const handleImageRemove = () => {
    setForm({ ...form, avatar: '' });
    setUploadPreview(null);
  };

  const handleAddLink = (data: any) => {
    const updated = [...form.links];
    if (editIndex !== null) {
      updated[editIndex] = data;
    } else {
      updated.push({ ...data, id: `link-${Date.now()}` });
    }
    setForm({ ...form, links: updated });
    setShowModal(false);
    setEditIndex(null);
  };

  const handleSaveHeader = () => {
    const updated = [...form.headers];
    if (editHeaderIndex !== null) {
      updated[editHeaderIndex].title = headerTitle;
    } else {
      updated.push({ id: `header-${Date.now()}`, title: headerTitle });
    }
    setForm({ ...form, headers: updated });
    setHeaderTitle('');
    setEditHeaderIndex(null);
    setShowHeaderModal(false);
  };

  const handleSaveEmbed = (data: { title: string; url: string }) => {
    const updated = [...(form.embeds || [])];
    if (editEmbedIndex !== null) {
      updated[editEmbedIndex] = { ...updated[editEmbedIndex], ...data };
    } else {
      updated.push({ ...data, id: `embed-${Date.now()}` });
    }
    setForm({ ...form, embeds: updated });
    setShowEmbedModal(false);
    setEditEmbedIndex(null);
  };

  const handleSaveTestimonial = () => {
    const updated = [...(form.testimonials || [])];
    const newData = {
      id: editTestimonialIndex !== null ? form.testimonials[editTestimonialIndex].id : `testimonial-${Date.now()}`,
      name: testimonialName,
      message: testimonialMessage,
      avatar: testimonialAvatar,
    };

    if (editTestimonialIndex !== null) {
      updated[editTestimonialIndex] = newData;
    } else {
      updated.push(newData);
    }
    setForm({ ...form, testimonials: updated });
    setShowTestimonialModal(false);
    setEditTestimonialIndex(null);
    setTestimonialName('');
    setTestimonialMessage('');
    setTestimonialAvatar('');
    setTestimonialAvatarPreview(null);
  };
  const handleSaveFAQ = () => {
    const updated = [...(form.faqs || [])];
    const newData = {
      id: editFAQIndex !== null ? form.faqs[editFAQIndex].id : `faq-${Date.now()}`,
      question: faqQuestion,
      answer: faqAnswer,
    };
    if (editFAQIndex !== null) {
      updated[editFAQIndex] = newData;
    } else {
      updated.push(newData);
    }
    setForm({ ...form, faqs: updated });
    setShowFAQModal(false);
    setEditFAQIndex(null);
    setFaqQuestion('');
    setFaqAnswer('');
  };

  const handleSaveService = (data: any) => {
    const updated = [...(form.services || [])];
    const newData = {
      id: editServiceIndex !== null ? form.services[editServiceIndex].id : `service-${Date.now()}`,
      ...data,
    };
    if (editServiceIndex !== null) {
      updated[editServiceIndex] = newData;
    } else {
      updated.push(newData);
    }
    setForm({ ...form, services: updated });
    setShowServiceModal(false);
    setEditServiceIndex(null);
  };

  const handleSaveFeatured = (newFeatured: any) => {
    const updated = [...(form.featured || [])];
    if (editFeaturedIndex !== null) {
      updated[editFeaturedIndex] = { ...updated[editFeaturedIndex], ...newFeatured };
    } else {
      const id = `featured-${Date.now() + Math.random()}`;
      updated.push({ ...newFeatured, id });
    }
    setForm({ ...form, featured: updated });
    setShowFeaturedModal(false);
    setEditFeaturedIndex(null);
  };

  useEffect(() => {
    if (form.avatar) setUploadPreview(form.avatar);
  }, [form.avatar]);

  useEffect(() => {
    if (testimonialAvatar) setTestimonialAvatarPreview(testimonialAvatar);
  }, [testimonialAvatar]);

  return (
    <>
      <div className={styles.TabPageMain}>
        <div className={styles.sectionHead}>
          <h3>Set Up Your Profile</h3>
          <p>Personalize your page with your name, image, bio, contact info, embeds, and more.</p>
        </div>

        {/* Basic Info */}
        <div className={styles.sectionMain}>
          <div className={styles.sectionHead}><h3>👤 Profile Information</h3></div>
          <div className={styles.linkFormInputImg}>
            <div>
              <input
                className="input"
                type="text"
                placeholder="Full Name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
              <textarea
                className="input my-4"
                rows={3}
                placeholder="Short Bio"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
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

        {/* About (Rich Text) */}
        {limits.about && (
          <div className={styles.sectionMain}>
            <div className={styles.SecHeadAndBtn}>
              <h4 className={styles.sectionLabel}>About <span className="badge-pro">Pro</span></h4>
            </div>
            <RichTextEditor
              value={form.about || ''}
              onChange={(val) => setForm({ ...form, about: val })}
              placeholder="Tell your story, skills, mission..."
            />
          </div>
        )}

        {/* Headers */}
        <div className={styles.sectionMain}>
          <div className={styles.SecHeadAndBtn}>
            <h4>Headers</h4>
            <button
              className="btn-primary"
              onClick={() => setShowHeaderModal(true)}
              disabled={form.headers.length >= limits.headers}
            >
              + Add Header
            </button>
          </div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd('headers')}>
            <SortableContext items={form.headers.map((h: any) => h.id)} strategy={verticalListSortingStrategy}>
              <div className="grid gap-3">
                {form.headers.map((header: any, i: number) => (
                  <SortableLink
                    key={header.id}
                    id={header.id}
                    link={{ ...header, type: 'header' }}
                    onEdit={() => { setEditHeaderIndex(i); setHeaderTitle(header.title); setShowHeaderModal(true); }}
                    onDelete={() => setForm({ ...form, headers: form.headers.filter((_: any, j: number) => j !== i) })}
                    isHeader
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Links */}
        <div className={styles.sectionMain}>
          <div className={styles.SecHeadAndBtn}>
            <h4>Links</h4>
            <button className="btn-primary" onClick={() => setShowModal(true)} disabled={form.links.length >= limits.links}>
              + Add Link
            </button>
          </div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd('links')}>
            <SortableContext items={form.links.map((l: any) => l.id)} strategy={verticalListSortingStrategy}>
              <div className="grid gap-4">
                {form.links.map((link: any, i: number) => (
                  <SortableLink
                    key={link.id}
                    id={link.id}
                    link={link}
                    onEdit={() => { setEditIndex(i); setShowModal(true); }}
                    onDelete={() => setForm({ ...form, links: form.links.filter((_: any, j: number) => j !== i) })}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {limits.contact && (
          <ContactInfoSection form={form} setForm={setForm} />
        )}

        {/* Pro: Location (Map) */}
        {limits.map && (
          <div className={styles.sectionMain}>
            <div className={styles.SecHeadAndBtn}>
              <h4>📍 Location <span className="badge-pro">Pro</span></h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="input"
                placeholder="Enter your business or coaching location (e.g. Building name, street, area, city)"
                value={form.fullAddress || ''}
                onChange={(e) => setForm({ ...form, fullAddress: e.target.value })}
              />
              <input
                className="input"
                type="text"
                placeholder="Latitude (optional)"
                value={form.latitude || ''}
                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              />
              <input
                className="input"
                type="text"
                placeholder="Longitude (optional)"
                value={form.longitude || ''}
                onChange={(e) => setForm({ ...form, longitude: e.target.value })}
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
            {(form.latitude && form.longitude) || form.fullAddress ? (
              <div className="mt-4">
                <iframe
                  className="rounded-xl w-full h-64 border"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={form.latitude && form.longitude
                    ? `https://www.google.com/maps?q=${form.latitude},${form.longitude}&output=embed`
                    : `https://www.google.com/maps?q=${encodeURIComponent(form.fullAddress)}&output=embed`
                  }
                  title="Business Location"
                ></iframe>
                <a
                  href={form.latitude && form.longitude
                    ? `https://www.google.com/maps/dir/?api=1&destination=${form.latitude},${form.longitude}`
                    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(form.fullAddress)}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-3 inline-block"
                >
                  Navigate Here
                </a>
              </div>
            ) : null}
          </div>
        )}

        {/* Pro: Resume */}
        {limits.resume && (
          <div className={styles.sectionMain}>
            <div className={styles.SecHeadAndBtn}>
              <h4>Upload Resume <FileText size={16} className="inline-block ml-1 mb-1" /> <span className="badge-pro">Pro</span></h4>
            </div>
            <input
              type="file"
              accept=".pdf"
              className="input"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result === 'string') {
                      setForm({ ...form, resumeUrl: reader.result });
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
        )}
        {limits.featured && (
          <div className={styles.sectionMain}>
            <div className={styles.SecHeadAndBtn}>
              <h4>
                Featured Media <Youtube size={16} className="inline-block ml-1 mb-1" /> <span className="badge-pro">Pro</span>
              </h4>
              <button
                className="btn-primary"
                onClick={() => {
                  setEditFeaturedIndex(null);
                  setShowFeaturedModal(true);
                }}
                disabled={(form.featured || []).length >= 10}
              >
                + Add Media
              </button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd('featured')}>
              <SortableContext items={(form.featured || []).map((f: any) => f.id)} strategy={verticalListSortingStrategy}>
                <div className="grid gap-3">
                  {(form.featured || []).map((featured: any, i: number) => (
                    <SortableFeaturedMediaItem
                      key={featured.id}
                      id={featured.id}
                      media={featured}
                      onEdit={() => {
                        setEditFeaturedIndex(i);
                        setShowFeaturedModal(true);
                      }}
                      onDelete={() => setForm({ ...form, featured: form.featured.filter((_: any, j: number) => j !== i) })}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {limits.embeds > 0 && (
          <div className={styles.sectionMain}>
            <div className={styles.SecHeadAndBtn}>
              <div className={styles.SecHeadAndBtn}>
                <h4>Embed Widgets <LinkIcon size={16} className="inline-block ml-1 mb-1" /> <span className="badge-pro">Pro</span></h4>
              </div>
              <button
                className="btn-primary"
                onClick={() => setShowEmbedModal(true)}
                disabled={(form.embeds || []).length >= limits.embeds}
              >
                + Add Embed
              </button>
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd('embeds')}>
              <SortableContext items={(form.embeds || []).map((e: any) => e.id)} strategy={verticalListSortingStrategy}>
                <div className="grid gap-3">
                  {(form.embeds || []).map((embed: any, i: number) => (
                    <SortableLink
                      key={embed.id}
                      id={embed.id}
                      link={{ ...embed, type: 'embed' }}
                      onEdit={() => { setEditEmbedIndex(i); setShowEmbedModal(true); }}
                      onDelete={() => setForm({ ...form, embeds: form.embeds.filter((_: any, j: number) => j !== i) })}
                      isEmbed
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {limits.testimonials > 0 && (
          <div className={styles.sectionMain}>
            <div className={styles.SecHeadAndBtn}>
              <h4>Testimonials <span className="badge-pro">Pro</span></h4>
              <button
                className="btn-primary"
                onClick={() => {
                  setEditTestimonialIndex(null);
                  setTestimonialName('');
                  setTestimonialMessage('');
                  setTestimonialAvatar('');
                  setTestimonialAvatarPreview(null);
                  setShowTestimonialModal(true);
                }}
                disabled={(form.testimonials || []).length >= limits.testimonials}
              >
                + Add Testimonial
              </button>
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd('testimonials')}>
              <SortableContext items={(form.testimonials || []).map((t: any) => t.id)} strategy={verticalListSortingStrategy}>
                <div className="grid gap-3">
                  {(form.testimonials || []).map((t: any, i: number) => (
                    <SortableTestimonial
                      key={t.id}
                      id={t.id}
                      testimonial={t}
                      onEdit={() => {
                        setEditTestimonialIndex(i);
                        setTestimonialName(t.name);
                        setTestimonialMessage(t.message);
                        setTestimonialAvatar(t.avatar || '');
                        setTestimonialAvatarPreview(t.avatar || '');
                        setShowTestimonialModal(true);
                      }}
                      onDelete={() =>
                        setForm({ ...form, testimonials: form.testimonials.filter((_: any, j: number) => j !== i) })
                      }
                    />
                  ))}
                </div>
              </SortableContext>

            </DndContext>
          </div>
        )}

        {limits.faqs > 0 && (
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
                disabled={(form.faqs || []).length >= limits.faqs}
              >
                + Add FAQ
              </button>
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd('faqs')}>
              <SortableContext items={(form.faqs || []).map((f: any) => f.id)} strategy={verticalListSortingStrategy}>
                <div className="grid gap-3">
                  {(form.faqs || []).map((faq: any, i: number) => (
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
                        setForm({ ...form, faqs: form.faqs.filter((_: any, j: number) => j !== i) })
                      }
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {limits.services > 0 && (
          <div className={styles.sectionMain}>
            <div className={styles.SecHeadAndBtn}>
              <h4>Services <span className="badge-pro">Pro</span></h4>
              <button
                className="btn-primary"
                onClick={() => {
                  setEditServiceIndex(null);
                  setShowServiceModal(true);
                }}
                disabled={(form.services || []).length >= limits.services}
              >
                + Add Service
              </button>
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd('services')}>
              <SortableContext items={(form.services || []).map((s: any) => s.id)} strategy={verticalListSortingStrategy}>
                {(form.services || []).map((service: any, i: number) => (
                  <SortableService
                    key={service.id}
                    id={service.id}
                    service={service}
                    onEdit={() => {
                      setEditServiceIndex(i);
                      setShowServiceModal(true);
                    }}
                    onDelete={() =>
                      setForm({ ...form, services: form.services.filter((_: any, j: number) => j !== i) })
                    }
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )}

      </div>

      {showModal && (
        <LinkFormModal
          onSave={handleAddLink}
          onClose={() => { setShowModal(false); setEditIndex(null); }}
          initialData={editIndex !== null ? form.links[editIndex] : undefined}
        />
      )}

      {showHeaderModal && (
        <HeaderFormModal
          initialData={editHeaderIndex !== null ? form.headers?.[editHeaderIndex] : undefined}
          onClose={() => setShowHeaderModal(false)}
          onSave={(newHeader) => {
            if (editHeaderIndex !== null) {
              const updated = [...form.headers];
              updated[editHeaderIndex] = { ...updated[editHeaderIndex], ...newHeader };
              setForm({ ...form, headers: updated });
            } else {
              const id = `header-${Date.now() + Math.random()}`;
              setForm({ ...form, headers: [...(form.headers || []), { ...newHeader, id }] });
            }
            setShowHeaderModal(false);
          }}
        />
      )}


      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSelectImage={(val) => {
            if (typeof val === 'string') {
              setForm({ ...form, avatar: val });
              setUploadPreview(val);
            }
            setShowUploadModal(false);
          }}
        />
      )}

      {showEmbedModal && (
        <EmbedFormModal
          onSave={handleSaveEmbed}
          onClose={() => { setShowEmbedModal(false); setEditEmbedIndex(null); }}
          initialData={editEmbedIndex !== null ? form.embeds[editEmbedIndex] : undefined}
        />
      )}

      {showTestimonialModal && (
        <TestimonialFormModal
          onClose={() => setShowTestimonialModal(false)}
          initialData={
            editTestimonialIndex !== null ? form.testimonials?.[editTestimonialIndex] : undefined
          }
          onSave={(newTestimonial) => {
            if (editTestimonialIndex !== null) {
              const updated = [...form.testimonials];
              updated[editTestimonialIndex] = { ...updated[editTestimonialIndex], ...newTestimonial };
              setForm({ ...form, testimonials: updated });
            } else {
              const id = `testimonial-${Date.now() + Math.random()}`;
              setForm({ ...form, testimonials: [...(form.testimonials || []), { ...newTestimonial, id }] });
            }
            setShowTestimonialModal(false);
          }}
        />
      )}


      {showFAQModal && (
        <FAQFormModal
          onClose={() => setShowFAQModal(false)}
          initialData={editFAQIndex !== null ? form.faqs?.[editFAQIndex] : undefined}
          onSave={(newFaq) => {
            if (editFAQIndex !== null) {
              const updated = [...form.faqs];
              updated[editFAQIndex] = { ...updated[editFAQIndex], ...newFaq };
              setForm({ ...form, faqs: updated });
            } else {
              const id = `faq-${Date.now() + Math.random()}`;
              setForm({ ...form, faqs: [...(form.faqs || []), { ...newFaq, id }] });
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
          initialData={editServiceIndex !== null ? form.services[editServiceIndex] : undefined}
        />
      )}

       {showFeaturedModal && (
        <FeaturedMediaModal
          onClose={() => setShowFeaturedModal(false)}
          onSave={handleSaveFeatured}
          initialData={editFeaturedIndex !== null ? form.featured?.[editFeaturedIndex] : undefined}
        />
      )}
    </>
  );
}
