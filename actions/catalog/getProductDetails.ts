"use server";
import { fetchApiClient } from "@/lib/oneentry";
import { dummyProducts } from "@/lib/dummyData";

export const getProductDetails = async (productId: number) => {
  const apiClient = await fetchApiClient();

  if (!productId) {
    throw new Error("Product ID is required.");
  }

  try {
    const product = await apiClient?.Products.getProductById(
      productId,
      "en_US"
    );
    // {ye dummy data wali logic h }
    if (!product) {
      const fallbackProduct = dummyProducts.find((p) => p.id === productId);
      if (fallbackProduct) {
        console.log(`Using dummy data for product ${productId}`);
        return fallbackProduct;
      }
      return null;
    }

    // {ye dummy data wali logic h }
    return product;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    const fallbackProduct = dummyProducts.find((p) => p.id === productId);
    if (fallbackProduct) {
      console.log(`Using dummy data due to error for product ${productId}`);
      return fallbackProduct;
    }
    throw new Error("Failed to fetch product.");
  }
};
