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

const DesignTab = () => {
    const { form, setForm } = useAdminForm();
    const currentTheme = form.design.theme || 'brand';
    const plan = 'free';
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

    const BrandOffDisabled = !limits.brandingOff;

    return (
        <div className={styles.TabPageMain}>
            <div className={styles.sectionHead}>
                <h3>Choose Your Premium Theme</h3>
                <p>Each theme includes custom styling, animations, and optimized color contrast.</p>
            </div>
            <div className={styles.sectionMain}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {themes.map((theme) => (
                        <div
                            key={theme.id}
                            onClick={() => handleSelectTheme(theme.id)}
                            className={clsx(
                                previewStyles.themeCardWrapper,
                                currentTheme === theme.id && previewStyles.selectedCard
                            )}
                        >
                            <div
                                className={clsx(previewStyles.themePreview, themeStyles[theme.id])}
                                data-theme={theme.id}
                            >
                                <div className={previewStyles.previewAvatar}>AA</div>
                                <div className={previewStyles.previewName}>Your Name</div>
                                <div className={previewStyles.previewTitle}>Creative Tagline</div>
                                <div className={previewStyles.previewButtons}>
                                    <button className={previewStyles.previewButton}>Follow</button>
                                    <button className={previewStyles.previewButton}>Visit</button>
                                </div>
                            </div>
                            <div className={previewStyles.themeName}>
                                {theme.name}
                                {theme.id === 'brand' && <span className={previewStyles.badge}>Default</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.sectionMain}>
                <div className={styles.SecHeadAndBtn}>
                    <h4>Remove Branding <span className="badge-pro">Pro</span></h4>
                </div>
                <LockedOverlay enabled={!BrandOffDisabled} mode="overlay">
                    <ToggleSwitch
                        label="Hide “Made with easysiteme” footer text"
                        checked={form.design.brandingOff || false}
                        onChange={(checked) =>
                            setForm({
                                ...form,
                                design: { ...form.design, brandingOff: checked },
                            })
                        }
                        isPro={false}
                        description="Remove the easysiteme branding from the bottom of your profile."
                    />
                </LockedOverlay>
            </div>

        </div>
    );
};

export default DesignTab;
