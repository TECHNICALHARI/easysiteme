// app/[username]/layout.tsx

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "#f9fafb", fontFamily: "sans-serif" }}>
        {/* You can add Header here if needed */}
        {children}
        {/* Footer here if needed */}
      </body>
    </html>
  );
}
