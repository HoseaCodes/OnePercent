/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
// app/resources/shared/[id]/page.js
import { useEffect, useState } from "react";

export default function SharedResource({ params }) {
  const [resource, setResource] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResource() {
      try {
        const response = await fetch(`/api/resources/shared/${params.id}`);
        if (!response.ok)
          throw new Error("Resource not found or not accessible");
        setResource(await response.json());
      } catch (err) {
        setError(err.message);
      }
    }
    fetchResource();
  }, [params.id]);

  if (error) return <div>Error: {error}</div>;
  if (!resource) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      {/* <ResourceView resource={resource} shared /> */}
    </div>
  );
}
