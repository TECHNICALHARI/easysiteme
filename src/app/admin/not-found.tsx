import NotFoundView from "@/lib/frontend/common/NotFoundView";

export default function AdminNotFound() {
  return (
    <NotFoundView
      title="Admin - Page Not Found"
      description="Looks like this admin page doesn't exist."
      homeHref="/admin"
      homeLabel="Go to Admin Dashboard"
    />
  );
}
