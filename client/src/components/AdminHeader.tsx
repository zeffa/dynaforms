"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { formApi } from "@/services/formApi";

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.push("/");
    router.refresh();
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/admin" className="text-xl font-bold text-gray-900">
          Admin Panel
        </Link>
        <nav className="flex space-x-8">
          <Link
            href="/admin/forms"
            className="text-gray-700 hover:text-indigo-600"
          >
            Forms
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="text-gray-700 hover:text-indigo-600"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
