import NotFoundPage from "@/lib/frontend/common/NotFoundPage";

export default function NotFound() {
  return (
    <NotFoundPage
      subtitle="Promotion Page Not Found"
      message="This promotion page could not be found."
      backHref="/"
      backLabel="Go to Home"
    />
  );
}
