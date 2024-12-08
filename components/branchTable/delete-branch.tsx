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
import Levels from "@/app/api/Branch";
import toast from "react-hot-toast";

interface Props {
  branchId: number;
  onBranchDelete: (branchId: number) => void;
}
interface ApiResponse<T> {
  status: boolean;
  result?: T;
}

export const DeleteBranch = ({ branchId, onBranchDelete }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const BranchAPi = Levels();
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleBranchRemove = async (branchId: number) => {
    setIsLoading(true);
    const response: ApiResponse<any> = (await BranchAPi.handleRemoveBranch(
      branchId
    )) as ApiResponse<any>;
    if (response.status) {
      onBranchDelete(branchId);
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
      <Tooltip content="Delete Branch" color="danger">
        <button onClick={handleOpen}>
          <DeleteIcon size={20} fill="#FF0080" />
        </button>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={handleClose} placement="top-center">
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Delete Branch
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
                  handleBranchRemove(branchId);
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
