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
import Branchs from "@/app/api/Branch";
import toast from "react-hot-toast";
import { PlusIcon } from "../icons/plus-icon";

interface ApiResponse<T> {
  status: boolean;
  result?: T;
}

interface Props {
  onAddNewBranch: (newBranch: any) => void;
}

export const AddBranch = ({ onAddNewBranch }: Props) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [name_en, setName_en] = useState("");
  const [name_ka, setName_ka] = useState("");
  const [description_en, setDescription_en] = useState("");
  const [description_ka, setDescription_ka] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddBranch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newBranchData = {
      BranchName_en: name_en,
      BranchName_ka: name_ka,
      description_en: description_en,
      description_ka: description_ka,
    };

    setIsLoading(true);
    const BranchAPI = Branchs();
    const response: ApiResponse<any> = (await BranchAPI.handleAddBranch(
      newBranchData
    )) as ApiResponse<any>;

    setIsLoading(false);

    if (response.status) {
      onAddNewBranch(response.result);
      toast.success("Branch added successfully");
      onClose();
    } else {
      toast.error(response.result);
      console.error("Failed to add Branch:", response);
    }
  };

  return (
    <div>
      <Button
        onPress={onOpen}
        color="primary"
        startContent={<PlusIcon fill="currentColor" />}
      >
        Add Branch
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          <form onSubmit={handleAddBranch}>
            <ModalHeader className="flex flex-col gap-1">
              Add Branch
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
                Add Branch
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};
