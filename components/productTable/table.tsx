"use client";

import React, { useEffect, useState } from "react";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import Products from "@/app/api/Product";
import { RenderProductCell } from "./render-cell";

const columns = [
  { name: "Logo", uid: "logo" },
  { name: "NAME_EN", uid: "name_en" },
  { name: "NAME_KA", uid: "name_ka" },
  { name: "FORMATED NAME", uid: "f_name" },
  { name: "ACTIONS", uid: "actions" },
];

interface ProductModel {
  productId: number;
  productName_ka: string;
  productName_en: string;
  formattedProductName: string;
  productLogo: string;
}

interface Props {
  Products: ProductModel[];
  branchName: string;
  onDeleteProduct: (courseId: number) => void;
  onUpdateProduct: (updatedProduct: ProductModel) => void;
  onChangeLogo: (newPicture: string, courseId: number) => void;
}

export const TableWrapper = ({
  Products,
  branchName,
  onDeleteProduct,
  onUpdateProduct,
  onChangeLogo,
}: Props) => {
  const [localProducts, setProducts] = useState<ProductModel[]>(Products);
  useEffect(() => {
    setProducts(Products);
    console.log(Products);
  }, [Products]);

  const handleProductDelete = (courseId: number) => {
    onDeleteProduct(courseId);
  };

  const hanldeProductEdit = (updatedProduct: ProductModel) => {
    onUpdateProduct(updatedProduct);
  };
  const handleChangeLogo = (newPicture: string, courseId: number) => {
    onChangeLogo(newPicture, courseId);
  };

  if (Products.length === 0) {
    <Spinner />;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={localProducts}>
          {(Product) => (
            <TableRow key={Product.productId}>
              {columns.map((column) => (
                <TableCell key={column.uid}>
                  {RenderProductCell({
                    Product: Product, // Pass the Product instead of user
                    columnKey: column.uid,
                    BranchName: branchName,
                    onProductDelete: handleProductDelete, // Correct function name
                    onProductEdit: hanldeProductEdit, // Correct function name
                    onChangeLogo: handleChangeLogo,
                  })}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
