"use client";
import { IPagesEntity } from "oneentry/dist/pages/pagesInterfaces";
import { fetchApiClient } from "@/lib/oneentry";
import { getCatalogs } from "./getCatalog";
import { dummyCatalogs, dummyProducts } from "@/lib/dummyData";

export const getCatalogWithProducts = async () => {
  console.log("function called");
  const apiClient = await fetchApiClient();
  console.log("Fetching catalogs...");
  console.log("apiClient is working ===>", apiClient);

  const catalogs: IPagesEntity[] = await getCatalogs();
  console.log("Raw catalogs from API:", catalogs);

  const catalogWithProducts = [];
  if (catalogs) {
    console.log("catalogs found", catalogs);
    for (const catalog of catalogs) {
      let products;
      try {
        products = await apiClient?.Products.getProductsByPageId(
          catalog.id,
          undefined,
          "en_US",
          {
            limit: 4,
            offset: 0,
            sortOrder: null,
            sortKey: null,
          }
        );
        console.log(`Products for catalog ${catalog.id}:`, products);
      } catch (error) {
        console.error(
          `Error fetching products for catalog ${catalog.id}:`,
          error
        );
        products = null;
      }

      // catalogWithProducts.push({ ...catalog, catalogProducts: products });
      if (!products || !products.items || products.items.length === 0) {
        console.log(
          `No products found for catalog ${catalog.id}, using dummy data`
        );
        // Use dummy products that match this catalog
        const fallbackProducts = {
          items: dummyProducts
            .filter(
              (product) =>
                product.categories?.includes(catalog.pageUrl) ||
                product.categories?.includes("classic-pizzas") // Fallback category
            )
            .slice(0, 4), // Limit to 4 products like the API call
        };
        catalogWithProducts.push({
          ...catalog,
          catalogProducts: fallbackProducts,
        });
      } else {
        catalogWithProducts.push({ ...catalog, catalogProducts: products });
      }
    }

    return catalogWithProducts;
  } else {
    console.log("No catalogs found");
    // Return dummy data structure if no catalogs found
    return dummyCatalogs.map((catalog) => ({
      ...catalog,
      catalogProducts: {
        items: dummyProducts.slice(0, 4),
      },
    }));
  }
};
