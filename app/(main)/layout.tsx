import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Navbar />
      <>{children}</>
      {/* Footer */}
      <Footer />
    </>
  );
};

export default layout;
