import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import Products from "@/app/api/Product";
import toast from "react-hot-toast";
import { PlusIcon } from "../icons/plus-icon";

interface ApiResponse<T> {
  status: boolean;
  result?: T;
}

interface Props {
  Branchid: number;
  onAddNewProduct: (newProduct: any) => void;
}

export const AddProduct = ({ onAddNewProduct, Branchid }: Props) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [name_en, setName_en] = useState("");
  const [name_ka, setName_ka] = useState("");
  const [description_en, setDescription_en] = useState("");
  const [description_ka, setDescription_ka] = useState("");
  const [formattedProductName, setFormattedProductName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newProductData = {
      ProductName_ka: name_en,
      ProductName_en: name_ka,
      formattedProductName: formattedProductName,
      description_ka: description_ka,
      description_en: description_en,
      ProductLogo: "", // Assuming you have a way to set this
    };

    setIsLoading(true);
    const ProductAPI = Products();
    const response: ApiResponse<any> = (await ProductAPI.handleAddProduct(
      Branchid,
      newProductData
    )) as ApiResponse<any>;

    setIsLoading(false);

    if (response.status) {
      onAddNewProduct(response.result);
      toast.success("Product added successfully");
      onClose();
    } else {
      toast.error(response.result);
      console.error("Failed to add Product:", response);
    }
  };

  return (
    <div>
      <Button
        onPress={onOpen}
        color="primary"
        startContent={<PlusIcon fill="currentColor" />}
      >
        Add Product
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          <form onSubmit={handleAddProduct}>
            <ModalHeader className="flex flex-col gap-1">
              Add Product
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
                label="Fromatted Name"
                variant="bordered"
                value={formattedProductName}
                onChange={(e) => setFormattedProductName(e.target.value)}
              />
              <Input
                label="Description_en"
                variant="bordered"
                value={description_en}
                onChange={(e) => setDescription_en(e.target.value)}
              />
              <Input
                label="Description_ka"
                variant="bordered"
                value={description_ka}
                onChange={(e) => setDescription_ka(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onClick={onClose}>
                Close
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading}>
                Add Product
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};
