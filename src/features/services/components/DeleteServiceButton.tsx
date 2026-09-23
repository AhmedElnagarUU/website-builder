"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/ui";

interface DeleteServiceButtonProps {
  siteId: string;
  locale: string;
  serviceId: string;
  serviceName: string;
}

export function DeleteServiceButton({
  siteId,
  locale,
  serviceId,
  serviceName,
}: DeleteServiceButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${serviceName}"?`)) return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        `/${locale}/sites/${siteId}/services/${serviceId}`,
        { method: "DELETE" }
      );
      if (res.status === 409) {
        alert("This service has existing requests and cannot be deleted.");
      } else if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error || "Failed to delete service");
      } else {
        router.refresh();
      }
    } catch {
      alert("Failed to delete service");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button onClick={handleDelete} disabled={isDeleting} variant="default">
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  );
}
