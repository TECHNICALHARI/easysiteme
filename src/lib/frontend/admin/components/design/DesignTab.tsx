'use client';

import styles from '@/styles/admin.module.css';
import themeStyles from '@/styles/theme.module.css';
import previewStyles from '@/styles/preview.module.css';
import { useAdminForm, ProfileDesignSlice } from '@/lib/frontend/admin/context/AdminFormContext';
import clsx from 'clsx';
import ToggleSwitch from '@/lib/frontend/common/ToggleSwitch';
import LockedOverlay from '../../layout/LockedOverlay';
import { PLAN_FEATURES, type PlanType } from '@/config/PLAN_FEATURES';

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

const Section = ({
    title,
    sub,
    right,
    children,
}: {
    title?: string | React.ReactNode;
    sub?: string;
    right?: string | React.ReactNode;
    children: React.ReactNode;
}) => (
    <div className={styles.sectionMain}>
        {(title || right) && (
            <div className={styles.SecHeadAndBtn}>
                {title && <h4 className={styles.sectionLabel}>{title}</h4>}
                {right && <div>{right}</div>}
            </div>
        )}
        {sub && <p className="text-sm text-muted mb-2">{sub}</p>}
        {children}
    </div>
);

const BioLinkCard = ({
    themeId,
    themeName,
    isSelected,
    onSelect,
}: {
    themeId: string;
    themeName: string;
    isSelected: boolean;
    onSelect: (id: string) => void;
}) => (
    <div onClick={() => onSelect(themeId)} className={clsx(previewStyles.themeCardWrapper, isSelected && previewStyles.selectedCard)}>
        <div className={clsx(previewStyles.themePreview, (themeStyles as Record<string, string>)[themeId])} data-theme={themeId}>
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

const WebsiteCard = ({
    themeId,
    themeName,
    isSelected,
    onSelect,
}: {
    themeId: string;
    themeName: string;
    isSelected: boolean;
    onSelect: (id: string) => void;
}) => (
    <div onClick={() => onSelect(themeId)} className={clsx(previewStyles.themeCardWrapper, isSelected && previewStyles.selectedCard)}>
        <div className={clsx(previewStyles.themePreview, (themeStyles as Record<string, string>)[themeId])} data-theme={themeId}>
            <div className="w-full text-center py-3">
                <div className="text-base font-semibold">{themeName}</div>
                <div className="text-xs opacity-70">Website Preview</div>
            </div>

            <div className="w-full h-[120px] bg-[var(--color-bg)] rounded-lg shadow-inner p-2 flex flex-col justify-around">
                <div className="h-3 rounded bg-[var(--color-brand)] w-2/3 mx-auto" />
                <div className="h-3 rounded bg-[var(--color-brand-dark)] w-5/6 mx-auto" />
                <div className="h-3 rounded bg-[var(--color-text)]/40 w-1/2 mx-auto" />
                <div className="h-3 rounded bg-[var(--color-text)]/30 w-3/4 mx-auto" />
            </div>
        </div>
        <div className={previewStyles.themeName}>
            {themeName}
            {isSelected && <span className={previewStyles.badge}>Selected</span>}
        </div>
    </div>
);

export default function DesignTab() {
    const { profileDesign, setProfileDesign, plan } = useAdminForm() as {
        profileDesign: ProfileDesignSlice;
        setProfileDesign: (next: ProfileDesignSlice | ((p: ProfileDesignSlice) => ProfileDesignSlice)) => void;
        plan: PlanType;
    };

    const currentTheme = profileDesign?.design?.theme || 'brand';
    const layoutType = profileDesign?.design?.layoutType || 'bio';
    const limits = PLAN_FEATURES[plan];

    const handleSelectTheme = (themeId: string) => {
        setProfileDesign((prev: any) => ({ ...prev, design: { ...prev.design, theme: themeId } }));
    };

    return (
        <div className={styles.TabPageMain}>
            <div className={styles.sectionHead}>
                <h3>Customize Your Page Look</h3>
                <p>Pick a layout, apply a theme, and optionally remove myeasypage branding.</p>
            </div>

            <Section title="Choose Your Layout" sub="Switch between a simple bio-link page or a full website layout.">
                <LockedOverlay enabled={limits.layoutType} mode="overlay">
                    <ToggleSwitch
                        label="Use Full Website Layout"
                        checked={layoutType === 'website'}
                        onChange={(checked) => setProfileDesign((prev: any) => ({ ...prev, design: { ...prev.design, layoutType: checked ? 'website' : 'bio' } }))}
                        isPro={plan !== 'free'}
                        description="Choose between link-in-bio style or full website."
                    />
                </LockedOverlay>
            </Section>

            <Section title="Choose a Theme" sub="Preview and pick from a wide range of styles.">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {themes.map((theme) =>
                        layoutType === 'website' ? (
                            <WebsiteCard key={theme.id} themeId={theme.id} themeName={theme.name} isSelected={currentTheme === theme.id} onSelect={handleSelectTheme} />
                        ) : (
                            <BioLinkCard key={theme.id} themeId={theme.id} themeName={theme.name} isSelected={currentTheme === theme.id} onSelect={handleSelectTheme} />
                        )
                    )}
                </div>
            </Section>

            <Section>
                <LockedOverlay enabled={limits.brandingOff} mode="overlay">
                    <ToggleSwitch
                        label='Hide “Made with myeasypage” footer text'
                        checked={profileDesign?.design?.brandingOff || false}
                        onChange={(checked) => setProfileDesign((prev: any) => ({ ...prev, design: { ...prev.design, brandingOff: checked } }))}
                        isPro={true}
                        description="Remove myeasypage branding from the bottom of your profile."
                    />
                </LockedOverlay>
            </Section>
        </div>
    );
}
