"use server";

import { fetchApiClient } from "@/lib/oneentry";
import { IPagesEntity } from "oneentry/dist/pages/pagesInterfaces";
import { dummyCatalogs } from "@/lib/dummyData";

export const getCatalogs = async (): Promise<IPagesEntity[]> => {
  try {
    const apiClient = await fetchApiClient();
    console.log("api client getCatalog.ts");

    // Get all pages with en_US locale
    const allPages = await apiClient?.Pages.getPages("en_US");
    console.log("pages is fetching ====>???????");
    console.log("pages is fetching ====>", allPages);

    if (!allPages || !Array.isArray(allPages)) {
      console.log("DEBUG: No pages found");
      return [];
    }

    console.log("DEBUG: All pages found:", allPages.length);

    // Return all pages for now, filter on frontend if needed
    // Or add your specific filtering logic here
    const catalogPages = allPages.filter(
      (page) =>
        (page as any).pageType === "CATALOG" ||
        (page as any).marker === "catalog" ||
        page.localizeInfos?.title?.toLowerCase().includes("pizza")
    );
    console.log(allPages[0]);

    console.log("DEBUG: Filtered catalog pages:", catalogPages.length);
    if (catalogPages.length === 0) {
      console.log("No catalog pages found, using dummy catalogs");
      return dummyCatalogs;
    }

    return catalogPages;
  } catch (error) {
    console.error("ERROR in getCatalogs:", error);
    // return [];
    return dummyCatalogs;
  }
};
