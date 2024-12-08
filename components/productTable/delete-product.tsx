"use client";

import React, { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
  Tooltip,
} from "@nextui-org/react";
import { DeleteIcon } from "../icons/table/delete-icon";
import Products from "@/app/api/Product";
import toast from "react-hot-toast";

interface Props {
  ProductId: number;
  LogoPath: string;
  onProductDelete: (ProductId: number) => void;
}
interface ApiResponse<T> {
  status: boolean;
  result?: T;
}

export const DeleteProduct = ({
  ProductId,
  LogoPath,
  onProductDelete,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const ProductAPi = Products();
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleProductRemove = async (ProductId: number) => {
    setIsLoading(true);
    const response: ApiResponse<any> = (await ProductAPi.handleRemoveProduct(
      ProductId,
      LogoPath
    )) as ApiResponse<any>;
    if (response.status) {
      onProductDelete(ProductId);
      setIsLoading(false);
      setIsOpen(false);
      toast.success("User deleted successfully");
    } else {
      setIsLoading(false);
      toast.error(response.result);
      console.error("Failed to delete user:", response);
    }
  };

  return (
    <div>
      <Tooltip content="Delete Product" color="danger">
        <button onClick={handleOpen}>
          <DeleteIcon size={20} fill="#FF0080" />
        </button>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={handleClose} placement="top-center">
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Delete Product
            </ModalHeader>
            <ModalBody>Delete?</ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onClick={handleClose}>
                Close
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                onClick={() => {
                  handleProductRemove(ProductId);
                }}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
};
