'use client';

import { useState } from 'react';
import { Users, Pencil, PlusCircle } from 'lucide-react';
import styles from '@/styles/superadmin.module.css';
import AdminTable from '@/lib/frontend/superadmin/AdminTable';
import PlanFormModal from '@/lib/frontend/superadmin/PlanFormModal';
import CustomModal from '@/lib/frontend/common/CustomModal';

export default function PlansPage() {
    const [plans, setPlans] = useState([
        {
            id: 'free',
            name: 'Free',
            price: '₹0',
            features: '2 Custom Links, Fixed Theme, Branding Visible',
            users: 2480,
        },
        {
            id: 'pro',
            name: 'Pro',
            price: '₹199/year',
            features: '5 Links, Profile Image, WhatsApp, Remove Branding',
            users: 843,
        },
        {
            id: 'premium',
            name: 'Premium',
            price: '₹499/year',
            features: '10 Links, Testimonials, Gallery, Custom Sections',
            users: 153,
        },
    ]);

    const allUsers = [
        { id: 1, name: 'Raj Verma', email: 'raj@example.com', plan: 'Free' },
        { id: 2, name: 'Anjali Mehta', email: 'anjali@example.com', plan: 'Pro' },
        { id: 3, name: 'Karan Sinha', email: 'karan@example.com', plan: 'Premium' },
        { id: 4, name: 'Dev Arora', email: 'dev@example.com', plan: 'Pro' },
        { id: 5, name: 'Sonal Tomar', email: 'sonal@example.com', plan: 'Free' },
    ];

    const [showModal, setShowModal] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [showUsersModal, setShowUsersModal] = useState(false);
    const [selectedPlanName, setSelectedPlanName] = useState<string>('');
    const [usersInPlan, setUsersInPlan] = useState<any[]>([]);

    const columns = [
        { key: 'name', label: 'Plan', sortable: true },
        { key: 'price', label: 'Price', sortable: true },
        { key: 'features', label: 'Features' },
        { key: 'users', label: 'Users', sortable: true },
    ];

    const handleSavePlan = (plan: any) => {
        if (editIndex !== null) {
            const updated = [...plans];
            updated[editIndex] = { ...updated[editIndex], ...plan };
            setPlans(updated);
            setEditIndex(null);
        } else {
            setPlans((prev) => [
                ...prev,
                { ...plan, id: `plan-${Date.now()}`, users: 0 },
            ]);
        }
    };

    const openEditModal = (index: number) => {
        setEditIndex(index);
        setShowModal(true);
    };

    const handleViewUsers = (planName: string) => {
        const filtered = allUsers.filter((u) => u.plan === planName);
        setSelectedPlanName(planName);
        setUsersInPlan(filtered);
        setShowUsersModal(true);
    };

    return (
        <div className={styles.screenWrapper}>
            <div className={styles.screenHeader}>
                <h2 className={styles.screenTitle}>Manage Plans</h2>
                <button
                    className={styles.btnPrimary}
                    onClick={() => setShowModal(true)}
                >
                    <PlusCircle size={18} className="mr-2" />
                    Add Plan
                </button>
            </div>

            <AdminTable
                columns={columns}
                data={plans}
                renderActions={(row, index) => (
                    <div className="flex gap-3">
                        <button
                            title="View Users on this Plan"
                            className={styles.actionIcon}
                            onClick={() => handleViewUsers(row.name)}
                        >
                            <Users size={16} />
                        </button>
                        <button
                            title="Edit Plan"
                            className={styles.actionIcon}
                            onClick={() => openEditModal(index)}
                        >
                            <Pencil size={16} />
                        </button>
                    </div>
                )}
            />

            {/* Add/Edit Plan Modal */}
            {showModal && (
                <PlanFormModal
                    onClose={() => {
                        setShowModal(false);
                        setEditIndex(null);
                    }}
                    onSave={handleSavePlan}
                    initialData={editIndex !== null ? plans[editIndex] : undefined}
                />
            )}

            {/* Filtered Users Modal */}
            {showUsersModal && (
                <CustomModal
                    width="800px"
                    onClose={() => setShowUsersModal(false)}
                >
                    <h3 className="text-lg font-bold mb-3 text-brand">
                        Users on "{selectedPlanName}" Plan
                    </h3>

                    <AdminTable
                        columns={[
                            { key: 'name', label: 'Name' },
                            { key: 'email', label: 'Email' },
                        ]}
                        data={usersInPlan}
                    />

                    <div className="text-right mt-4">
                        <button
                            className="text-sm text-muted"
                            onClick={() => setShowUsersModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </CustomModal>
            )}

        </div>
    );
}
