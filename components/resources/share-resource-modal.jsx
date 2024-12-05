/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
/* eslint-disable import/extensions */

import { useState } from "react";
import { Copy, Globe, Users, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ShareResourceModal({ resource, isOpen, onClose }) {
  if (!isOpen) return null;

  const [shareType, setShareType] = useState("public");
  const [userEmails, setUserEmails] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/resources/${resource._id}`
      : "";

  const handleShare = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const emails =
        shareType === "specific"
          ? userEmails
              .split(",")
              .map((email) => email.trim())
              .filter((email) => email.length > 0)
          : [];

      if (shareType === "specific" && emails.length === 0) {
        setError("Please enter at least one email address");
        return;
      }

      const response = await fetch(`/api/resources/${resource._id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: shareType,
          users: emails,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to share resource");
      }

      // Copy the share URL to clipboard
      if (shareType === "public") {
        await navigator.clipboard.writeText(shareUrl);
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogOverlay onClick={onClose} />
      <DialogContent className="relative max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
        <DialogTitle className="text-lg font-medium leading-tight mb-6">
          Share Resource
        </DialogTitle>

        <div className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setShareType("public")}
              className={`flex-1 p-4 rounded-lg border transition-all ${
                shareType === "public"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Globe className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Public Link</span>
              <p className="text-xs text-gray-500 mt-1">
                Anyone with the link can view
              </p>
            </button>
            <button
              type="button"
              onClick={() => setShareType("specific")}
              className={`flex-1 p-4 rounded-lg border transition-all ${
                shareType === "specific"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Users className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Specific People</span>
              <p className="text-xs text-gray-500 mt-1">
                Share with selected users
              </p>
            </button>
          </div>

          {shareType === "specific" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Addresses
              </label>
              <textarea
                value={userEmails}
                onChange={(e) => setUserEmails(e.target.value)}
                placeholder="Enter email addresses separated by commas"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[80px]"
              />
              <p className="text-xs text-gray-500">
                These users will be granted access to view this resource
              </p>
            </div>
          )}

          {shareType === "public" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Share Link
              </label>
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(shareUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Copy
                    className={`h-4 w-4 ${copied ? "text-green-500" : "text-gray-500"}`}
                  />
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleShare}
              disabled={
                isLoading || (shareType === "specific" && !userEmails.trim())
              }
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Sharing..." : "Share Resource"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
