'use client';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Page() {

    useEffect(() => {
        document.title = 'Payment Successful';
    }, []);

    return (
        <main className="py-20 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 text-center">
                <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 shadow-sm">
                    <h1 className="text-2xl font-extrabold mb-4">Payment successful</h1>
                    <p className="text-gray-700 mb-6">Thank you — your plan has been upgraded. You can now return to the admin and continue customizing your page.</p>
                    <div className="flex items-center justify-center gap-4">
                        <Link
                            href="/admin"
                            className="px-5 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                        >
                            Go to Admin
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
