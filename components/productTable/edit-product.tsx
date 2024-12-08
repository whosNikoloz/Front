import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import { EditIcon } from "../icons/table/edit-icon";
import Products from "@/app/api/Product";
import toast from "react-hot-toast";

interface ProductModel {
  productId: number;
  productName_ka: string;
  productName_en: string;
  formattedProductName: string;
  productLogo: string;
}
interface Props {
  onUpdateProduct: (UpdatedProduct: ProductModel) => void;
  Product: ProductModel;
}

interface ApiResponse<T> {
  status: boolean;
  result?: T;
}

export const EditProduct = ({ onUpdateProduct, Product }: Props) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const [name_en, setName_en] = useState(Product.productName_en);
  const [name_ka, setName_ka] = useState(Product.productName_ka);
  const [formattedProductName, setFormattedProductName] = useState(
    Product.formattedProductName
  );
  const [isLoading, setIsLoading] = useState(false);

  const ProductAPI = Products();

  const handleProductUpdate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const newProductData = {
      ProductName_en: name_en,
      ProductName_ka: name_ka,
      logoURL: Product.productLogo, // Assuming you keep the existing logo URL
    };

    setIsLoading(true);
    const response: ApiResponse<any> = (await ProductAPI.handleUpdateProduct(
      Product.productId,
      newProductData
    )) as ApiResponse<any>;
    if (response.status) {
      setIsLoading(false);
      onClose();
      onUpdateProduct(response.result);
      toast.success("Product Updated successfully");
    } else {
      setIsLoading(false);
      toast.error(response.result);
      console.error("Failed to update Product:", response);
    }
  };

  return (
    <div>
      <Tooltip content="Edit Product" color="primary">
        <Button isIconOnly className="bg-transparent" onPress={onOpen}>
          <EditIcon size={20} fill="#979797" />
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          <form onSubmit={handleProductUpdate}>
            <ModalHeader className="flex flex-col gap-1">
              Update Product
            </ModalHeader>
            <ModalBody>
              <Input
                label="Name_en"
                variant="bordered"
                value={name_en}
                onChange={(e) => setName_en(e.target.value)}
              />
              <Input
                label="Name_ka"
                variant="bordered"
                value={name_ka}
                onChange={(e) => setName_ka(e.target.value)}
              />
              <Input
                label="Formated Name"
                variant="bordered"
                value={formattedProductName}
                onChange={(e) => setFormattedProductName(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onClick={onClose}>
                Close
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading}>
                Save
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};
