"use client";

import Link from "next/link";

export default function NotFoundPage({
  title = "404",
  subtitle = "Page Not Found",
  message = "Sorry, the page you are looking for doesn’t exist.",
  backHref = "/",
  backLabel = "Go to Home",
}: {
  title?: string;
  subtitle?: string;
  message?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="notfoundWrapper">
      <div className="notfoundBox">
        <h1 className="notfoundTitle">{title}</h1>
        <h2 className="notfoundSubtitle">{subtitle}</h2>
        <p className="notfoundText">{message}</p>
        <Link href={backHref} className="btn-primary mt-4">
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
