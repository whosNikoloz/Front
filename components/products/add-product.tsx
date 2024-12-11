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
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0); // Ensure the state is typed as number
  const [isLoading, setIsLoading] = useState(false);

  const handleAddProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newProductData = {
      productNameKa: name_en,
      productNameEn: name_ka,
      price: price,
      description: description,
      productLogo: "", // Assuming you have a way to set this
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
                label="Formatted Price"
                variant="bordered"
                value={price.toString()} // Ensure this value is displayed correctly as a number
                onChange={(e) => {
                  const inputValue = e.target.value.replace(/[^0-9.]/g, ""); // Strip non-numeric characters
                  const numericalValue = parseFloat(inputValue) || 0; // Convert to number, default to 0 if invalid
                  setPrice(numericalValue);
                }}
                type="text"
                inputMode="decimal"
              />
              <Input
                label="Description_en"
                variant="bordered"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
