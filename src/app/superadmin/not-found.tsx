import NotFoundPage from "@/lib/frontend/common/NotFoundPage";

export default function NotFound() {
  return (
    <NotFoundPage
      subtitle="Superadmin Page Not Found"
      message="The superadmin route you requested does not exist."
      backHref="/superadmin"
      backLabel="Go to Superadmin Dashboard"
    />
  );
}
