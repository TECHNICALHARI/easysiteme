// ├─ [username]/                → Subfolder-based user preview (easysiteme.com/rahul)
// │   ├─ layout.tsx
// │   └─ page.tsx               → <Preview /> page


import React from 'react'


export default function UserPreview({ params }: { params: { username: string } }) {
  return (
    <div style={{ maxWidth: "600px", margin: "4rem auto", textAlign: "center" }}>
      <h1>Welcome, {params.username} 👋</h1>
      <p>This is your public preview page.</p>
    </div>
  );
}
