'use client';

import styles from '@/styles/admin.module.css';
import themeStyles from '@/styles/theme.module.css';
import previewStyles from '@/styles/preview.module.css';
import { useAdminForm } from '@/lib/frontend/admin/context/AdminFormContext';
import clsx from 'clsx';
import ToggleSwitch from '@/lib/frontend/common/ToggleSwitch';
import LockedOverlay from '../../layout/LockedOverlay';
import { PLAN_FEATURES } from '@/config/PLAN_FEATURES';

const themes = [
    { id: 'brand', name: 'Brand' },
    { id: 'aurora', name: 'Aurora' },
    { id: 'frost', name: 'Frost' },
    { id: 'midnight', name: 'Midnight' },
    { id: 'sunset', name: 'Sunset' },
    { id: 'emerald', name: 'Emerald' },
    { id: 'ocean', name: 'Ocean' },
    { id: 'noir', name: 'Noir' },
    { id: 'orchid', name: 'Orchid' },
    { id: 'lemonade', name: 'Lemonade' },
    { id: 'phoenix', name: 'Phoenix' },
    { id: 'pearl', name: 'Pearl' },
    { id: 'blush', name: 'Blush' },
    { id: 'cyber', name: 'Cyber' },
    { id: 'slate', name: 'Slate' },
    { id: 'dawn', name: 'Dawn' },
    { id: 'copper', name: 'Copper' },
    { id: 'myst', name: 'Myst' },
    { id: 'forest', name: 'Forest' },
    { id: 'sand', name: 'Sand' },
    { id: 'ice', name: 'Ice' },
];

const BioLinkCard = ({ themeId, themeName, isSelected, onSelect }: any) => (
    <div
        onClick={() => onSelect(themeId)}
        className={clsx(
            previewStyles.themeCardWrapper,
            isSelected && previewStyles.selectedCard
        )}
    >
        <div className={clsx(previewStyles.themePreview, themeStyles[themeId])} data-theme={themeId}>
            <div className={previewStyles.previewAvatar}>AA</div>
            <div className={previewStyles.previewName}>Your Name</div>
            <div className={previewStyles.previewTitle}>Creative Tagline</div>
            <div className={previewStyles.previewButtons}>
                <button className={previewStyles.previewButton}>Follow</button>
                <button className={previewStyles.previewButton}>Visit</button>
            </div>
        </div>
        <div className={previewStyles.themeName}>
            {themeName}
            {isSelected && <span className={previewStyles.badge}>Selected</span>}
        </div>
    </div>
);

const WebsiteCard = ({ themeId, themeName, isSelected, onSelect }: any) => (
  <div
    onClick={() => onSelect(themeId)}
    className={clsx(
      previewStyles.themeCardWrapper,
      isSelected && previewStyles.selectedCard
    )}
  >
    <div
      className={clsx(previewStyles.themePreview, themeStyles[themeId])}
      data-theme={themeId}
    >
      <div className="w-full text-center py-3">
        <div className="text-base font-semibold">{themeName}</div>
        <div className="text-xs opacity-70">Website Preview</div>
      </div>

      <div className="w-full h-[120px] bg-[var(--color-bg)] rounded-lg shadow-inner p-2 flex flex-col justify-around">
        <div className="h-3 rounded bg-[var(--color-brand)] w-2/3 mx-auto"></div>
        <div className="h-3 rounded bg-[var(--color-brand-dark)] w-5/6 mx-auto"></div>
        <div className="h-3 rounded bg-[var(--color-text)]/40 w-1/2 mx-auto"></div>
        <div className="h-3 rounded bg-[var(--color-text)]/30 w-3/4 mx-auto"></div>
      </div>
    </div>

    <div className={previewStyles.themeName}>
      {themeName}
      {isSelected && <span className={previewStyles.badge}>Selected</span>}
    </div>
  </div>
);

const DesignTab = () => {
    const { form, setForm } = useAdminForm();
    const currentTheme = form.design.theme || 'brand';
    const layoutType = form.design.layoutType || 'bio';
    const plan = form.plan || 'pro';
    const limits = PLAN_FEATURES[plan];

    const handleSelectTheme = (themeId: string) => {
        setForm((prev) => ({
            ...prev,
            design: {
                ...prev.design,
                theme: themeId,
            },
        }));
    };


    return (
        <div className={styles.TabPageMain}>
            <div className={styles.sectionHead}>
                <h3>Customize Your Page Look</h3>
                <p>Pick a layout, apply a theme, and optionally remove easysiteme branding.</p>
            </div>

            <div className={styles.sectionMain}>
                <div className={styles.SecHeadAndBtn}>
                    <h4>Choose Your Layout</h4>
                </div>
                <LockedOverlay enabled={limits.layoutType} mode="overlay">
                    <ToggleSwitch
                        label="Use Full Website Layout"
                        checked={layoutType === 'website'}
                        onChange={(checked) =>
                            setForm((prev) => ({
                                ...prev,
                                design: {
                                    ...prev.design,
                                    layoutType: checked ? 'website' : 'bio',
                                },
                            }))
                        }
                        isPro={plan !== 'free'}
                        description="Choose between a simple link-in-bio style or a full website layout."
                    />
                </LockedOverlay>
            </div>

            <div className={styles.sectionMain}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {themes.map((theme) => (
                        layoutType === 'website' ? (
                            <WebsiteCard
                                key={theme.id}
                                themeId={theme.id}
                                themeName={theme.name}
                                isSelected={currentTheme === theme.id}
                                onSelect={handleSelectTheme}
                            />
                        ) : (
                            <BioLinkCard
                                key={theme.id}
                                themeId={theme.id}
                                themeName={theme.name}
                                isSelected={currentTheme === theme.id}
                                onSelect={handleSelectTheme}
                            />
                        )
                    ))}
                </div>
            </div>

            <div className={styles.sectionMain}>
                <div className={styles.SecHeadAndBtn}>
                    <h4>Remove Branding <span className="badge-pro">Pro</span></h4>
                </div>
                <LockedOverlay enabled={limits.brandingOff} mode="overlay">
                    <ToggleSwitch
                        label="Hide “Made with easysiteme” footer text"
                        checked={form.design.brandingOff || false}
                        onChange={(checked) =>
                            setForm({
                                ...form,
                                design: { ...form.design, brandingOff: checked },
                            })
                        }
                        isPro={true}
                        description="Remove the easysiteme branding from the bottom of your profile."
                    />
                </LockedOverlay>
            </div>
        </div>
    );
};

export default DesignTab;
