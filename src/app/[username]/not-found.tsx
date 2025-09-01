import NotFoundPage from "@/lib/frontend/common/NotFoundPage";

export default function NotFound() {
  return (
    <NotFoundPage
      subtitle="User Not Found"
      message="Sorry, we couldn’t find this username on myeasypage."
      backHref="/"
      backLabel="Go to Home"
    />
  );
}
