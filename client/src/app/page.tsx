"use client";

import Head from "next/head";
import { useRouter } from "next/navigation";
import type React from "react";
import {
  Navbar,
  HeroSection,
  FeaturesSection,
  CTASection,
  Footer,
} from "@/components/home";

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/forms");
  };

  const handleAdminLogin = () => {
    router.push("/admin/forms");
  };

  return (
    <>
      <Head>
        <title>Dynaform -   Dynamic Form Builder</title>
        <meta
          name="description"
          content="A powerful dynamic form builder for creating and managing custom forms"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar onGetStarted={handleGetStarted} onAdminLogin={handleAdminLogin} />
        <HeroSection onGetStarted={handleGetStarted} onAdminLogin={handleAdminLogin} />
        <FeaturesSection />
        <CTASection onGetStarted={handleGetStarted} onAdminLogin={handleAdminLogin} />
        <Footer onGetStarted={handleGetStarted} onAdminLogin={handleAdminLogin} />
      </div>
    </>
  );
};

export default HomePage;
