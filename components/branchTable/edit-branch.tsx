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
import Branchs from "@/app/api/Branch";
import toast from "react-hot-toast";

interface BranchModel {
  branchId: number;
  branchNameKa: string;
  branchNameEn: string;
  descriptionKa: string;
  descriptionEn: string;
  products: [];
}

interface Props {
  onUpdateBranch: (UpdatedBranch: BranchModel) => void;
  Branch: BranchModel;
}

interface ApiResponse<T> {
  status: boolean;
  result?: T;
}

export const EditBranch = ({ onUpdateBranch, Branch }: Props) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const [name_en, setName_en] = useState(Branch.branchNameEn);
  const [name_ka, setName_ka] = useState(Branch.branchNameKa);
  const [description_en, setDescription_en] = useState(Branch.descriptionEn);
  const [description_ka, setDescription_ka] = useState(Branch.descriptionKa);
  const [isLoading, setIsLoading] = useState(false);

  const BranchAPI = Branchs();

  const handleBranchUpdate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const newBranchData = {
      branchNameEn: name_en,
      branchNameKa: name_ka,
      descriptionEn: description_en,
      descriptionKa: description_ka,
    };

    setIsLoading(true);
    const response: ApiResponse<any> = (await BranchAPI.handleUpdateBranch(
      Branch.branchId,
      newBranchData
    )) as ApiResponse<any>;
    if (response.status) {
      setIsLoading(false);
      onClose();
      onUpdateBranch(response.result);
      toast.success("Branch Updated successfully");
    } else {
      setIsLoading(false);
      toast.error(response.result);
      console.error("Failed to update Branch:", response);
    }
  };

  return (
    <div>
      <Tooltip content="Edit Branch" color="primary">
        <Button isIconOnly className="bg-transparent" onPress={onOpen}>
          <EditIcon size={20} fill="#979797" />
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          <form onSubmit={handleBranchUpdate}>
            <ModalHeader className="flex flex-col gap-1">
              Update Branch
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
                Save
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};
