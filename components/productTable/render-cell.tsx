import React from "react";
import { DeleteProduct } from "./delete-product";
import { EditProduct } from "./edit-product";
import Image from "next/image";
import { NoPhotoIcon } from "../icons/table/no-photo-icon";
import ChangeProductLogo from "../products/changeImage/change-logo";

interface ProductModel {
  productId: number;
  productName_ka: string;
  productName_en: string;
  formattedProductName: string;
  productLogo: string;
}

interface Props {
  Product: ProductModel;
  BranchName: string;
  columnKey: string | React.Key;
  onProductDelete?: (ProductId: number) => void;
  onProductEdit?: (Product: ProductModel) => void;
  onChangeLogo(newPicture: string, productId: number): void;
}

export const RenderProductCell = ({
  Product,
  BranchName,
  columnKey,
  onProductDelete,
  onProductEdit,
  onChangeLogo,
}: Props) => {
  // @ts-ignore
  const cellValue = Product[columnKey];

  const handleProductRemove = (ProductId: number) => {
    if (onProductDelete) {
      onProductDelete(ProductId);
    }
  };

  const handleProductEdit = (UpdatedProduct: ProductModel) => {
    if (onProductEdit) {
      onProductEdit(UpdatedProduct);
    }
  };

  const handleProductView = (ProductId: number) => {
    console.log("View Product", ProductId);
  };

  const handleChangeLogo = (newPicture: string, productId: number) => {
    if (onChangeLogo) {
      onChangeLogo(newPicture, productId);
    }
  };

  switch (columnKey) {
    case "logo":
      return (
        <div className="flex items-center">
          {Product.productLogo ? (
            <Image
              src={Product.productLogo}
              alt={Product.productName_en}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <NoPhotoIcon fill="#979797" size={35} />
          )}
        </div>
      );
    case "name_en":
      return (
        <div className="flex items-center">
          <span>{Product.productName_en}</span>
        </div>
      );
    case "name_ka":
      return (
        <div className="flex items-center">
          <span>{Product.productName_ka}</span>
        </div>
      );
    case "f_name":
      return (
        <div className="flex items-center">
          <span>{Product.formattedProductName}</span>
        </div>
      );
    case "actions":
      return (
        <div className="flex items-center gap-4">
          <ChangeProductLogo
            ProductLogo={Product.productLogo}
            Productid={Product.productId}
            ProductName={Product.productName_en}
            onUpdateLogo={handleChangeLogo}
          />
          <EditProduct onUpdateProduct={handleProductEdit} Product={Product} />
          <DeleteProduct
            LogoPath={Product.productLogo}
            ProductId={Product.productId}
            onProductDelete={handleProductRemove}
          />
        </div>
      );
    default:
      return <span>{cellValue}</span>;
  }
};
