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
  productName_ka: string;
  productName_en: string;
  formattedProductName: string;
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

  const ProductAPi = ProductsAPIS();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const statusApi: ApiResponse<any> =
          await ProductAPi.GetProductsByLevelId(branchid);
        if (statusApi.status) {
          setProducts(statusApi.result);
          console.log(statusApi.result);
        } else if (!statusApi.status) {
          console.log("Error fetching Products:", statusApi.result);
        }
      } catch (error) {
        console.error("Error fetching Products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = (newProduct: any) => {
    newProduct.subjects = [];
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

  const handleChangelogo = (newPicture: string, ProductId: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((Product) =>
        Product.productId === ProductId
          ? { ...Product, ProductLogo: newPicture }
          : Product
      )
    );
  };
  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={"/"}>
            <span>Home</span>
          </Link>
          <span> / </span>{" "}
        </li>

        <li className="flex gap-2">
          <UsersIcon />
          <span>Products</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">All Products</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Search coruses"
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
        <TableWrapper
          Products={Products}
          branchName={branchName}
          onUpdateProduct={hanldeProductEdit}
          onDeleteProduct={handleProductDelete}
          onChangeLogo={handleChangelogo}
        />
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};
