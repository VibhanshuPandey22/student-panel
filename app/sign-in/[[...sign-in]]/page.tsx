import { SignIn } from "@clerk/nextjs";
import type { LocalizationResource } from "@clerk/types"; // Only if available

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <SignIn
        appearance={{
          elements: {
            card: "shadow-lg border border-gray-300 rounded-xl",
            headerTitle: "text-gray-900 text-xl font-semibold",
            formButtonPrimary:
              "bg-gray-900 hover:bg-black text-white font-medium",
            footerActionText: "text-sm text-gray-600",
            // footerActionLink: "text-blue-600 hover:text-blue-800",
          },
        }}
      />
    </div>
  );
}
