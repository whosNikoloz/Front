"use client";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DotsIcon } from "@/components/icons/accounts/dots-icon";
import { InfoIcon } from "@/components/icons/accounts/info-icon";
import { TrashIcon } from "@/components/icons/accounts/trash-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { SettingsIcon } from "@/components/icons/sidebar/settings-icon";
import { TableWrapper } from "@/components/productTable/table";
import { AddProduct } from "./add-product";
import { Toaster } from "react-hot-toast";
import ProductsAPIS from "@/app/api/Product";

interface ProductModel {
  productId: number;
  productNameKa: string;
  productNameEn: string;
  price: string;
  description: string;
  productLogo: string;
}

interface ApiResponse<T> {
  status: boolean;
  result?: T;
}

interface Props {
  branchid: number;
  branchName: string;
}

export const ProductsIndex = ({ branchid, branchName }: Props) => {
  const [Products, setProducts] = useState<ProductModel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track errors
  const ProductAPi = ProductsAPIS();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null); // Reset error on each fetch
      try {
        const statusApi: ApiResponse<any> =
          await ProductAPi.GetProductsByBranchId(branchid);
        if (statusApi.status) {
          setProducts(statusApi.result);
        } else {
          setError("Error fetching products.");
        }
      } catch (error) {
        setError("Error fetching products.");
        console.error("Error fetching Products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [branchid]);

  const handleAddProduct = (newProduct: ProductModel) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleProductDelete = (ProductId: number) => {
    setProducts((prevProducts) =>
      prevProducts.filter((Product) => Product.productId !== ProductId)
    );
  };

  const hanldeProductEdit = (updatedProduct: ProductModel) => {
    setProducts((prevProducts) =>
      prevProducts.map((Product) =>
        Product.productId === updatedProduct.productId
          ? updatedProduct
          : Product
      )
    );
  };

  const handleChangelogo = (newPicture: string, productId: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (
          product.productId === productId &&
          product.productLogo !== newPicture
        ) {
          return { ...product, productLogo: newPicture };
        }
        return product;
      })
    );
  };

  const filteredProducts = Products.filter(
    (product) =>
      product.productNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.productNameKa.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={"/"}>
            <span>Home</span>
          </Link>
          <span> / </span>
        </li>

        <li className="flex gap-2">
          <UsersIcon />
          <span>Products</span>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">All Products</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{ input: "w-full", mainWrapper: "w-full" }}
            placeholder="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SettingsIcon />
          <TrashIcon />
          <InfoIcon />
          <DotsIcon />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <AddProduct onAddNewProduct={handleAddProduct} Branchid={branchid} />
        </div>
      </div>

      <div className="max-w-[95rem] mx-auto w-full">
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <TableWrapper
            Products={filteredProducts}
            branchName={branchName}
            onUpdateProduct={hanldeProductEdit}
            onDeleteProduct={handleProductDelete}
            onChangeLogo={handleChangelogo}
          />
        )}
      </div>

      <Toaster position="bottom-right" />
    </div>
  );
};
