"use server";
import { fetchApiClient } from "@/lib/oneentry";
import { dummyProducts, dummyCatalogs } from "@/lib/dummyData";

// Server action to fetch related products
export const getRelatedProducts = async (pageId: number, productId: number) => {
  const apiClient = await fetchApiClient();

  if (!pageId) {
    throw new Error("Product ID is required to fetch related products.");
  }

  try {
    const products = await apiClient?.Products.getProductsByPageId(
      pageId,
      undefined,
      "en_US",
      {
        limit: 5,
        offset: 0,
        sortOrder: null,
        sortKey: null,
      }
    );

    // const relatedProducts = [];

    // for (let i = 0; i < products?.total; i++) {
    //   if (relatedProducts.length < 4) {
    //     if (products?.items[i].id !== productId)
    //       relatedProducts.push(products?.items[i]);
    //   } else {
    //     break;
    //   }
    // }
    // return relatedProducts;
    console.log(" ONEENTRY products response:", products);

    // {dummy data logic}

    let productItems: any[] = [];

    // products may be undefined, an IProductsResponse ({ items, total }), or a plain array
    if (!products) {
      console.log("No data from ONEENTRY, using dummy data...");
      // fallback: try to map pageId -> pageUrl via dummyCatalogs and filter dummyProducts by category
      const catalog = dummyCatalogs.find((c) => c.id === pageId);
      const pageUrl = catalog?.pageUrl;

      console.log("Dummy Catalog Found:", catalog);
      console.log("Page URL:", pageUrl);
      if (pageUrl) {
        productItems = dummyProducts.filter((p) =>
          p.categories?.includes(pageUrl)
        );
      } else {
        // no pageUrl match — use all dummy products
        productItems = [...dummyProducts];
      }
      console.log(" Dummy productItems:", productItems);
    } else if (Array.isArray(products)) {
      productItems = products;
      console.log(" Using products as array:", productItems);
    } else if ((products as any).items) {
      productItems = (products as any).items;
      console.log(" Using products.items:", productItems);
    } else {
      console.log(" Using products.items:", productItems);

      // unexpected shape — try to coerce to array
      productItems = Array.isArray((products as any).items)
        ? (products as any).items
        : [];
    }

    // build up to 4 related products excluding the current productId
    const relatedProducts: any[] = [];
    for (
      let i = 0;
      i < productItems.length && relatedProducts.length < 4;
      i++
    ) {
      const item = productItems[i];
      if (item?.id !== productId) {
        relatedProducts.push(item);
      }
    }
    console.log(" Final relatedProducts:");
    console.log(" Final relatedProducts:", relatedProducts);

    return relatedProducts;
    // {dummy data logic}
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    throw new Error("Failed to fetch related products.");
  }
};
