import { Tooltip, Chip } from "@nextui-org/react";
import React from "react";
import { DeleteIcon } from "../icons/table/delete-icon";
import { EditIcon } from "../icons/table/edit-icon";
import { EyeIcon } from "../icons/table/eye-icon";
import { DeleteBranch } from "./delete-branch";
import { EditBranch } from "./edit-branch";

interface BranchModel {
  BranchId: number;
  BranchName_ka: string;
  BranchName_en: string;
  logoURL: string;
  description_ka: string;
  description_en: string;
  products: [];
}

interface Props {
  Branch: BranchModel;
  columnKey: string | React.Key;
  onBranchDelete?: (BranchId: number) => void;
  onBranchEdit?: (Branch: BranchModel) => void;
}

export const RenderBranchCell = ({
  Branch,
  columnKey,
  onBranchDelete,
  onBranchEdit,
}: Props) => {
  // @ts-ignore
  const cellValue = Branch[columnKey];

  const handleBranchRemove = (BranchId: number) => {
    if (onBranchDelete) {
      onBranchDelete(BranchId);
    }
  };

  const CourseCount = Branch.products.length;

  const handleBranchEdit = (updatedBranch: BranchModel) => {
    if (onBranchEdit) {
      onBranchEdit(updatedBranch);
    }
  };

  const handleBranchView = (BranchId: number) => {
    console.log("View Branch", BranchId);
  };

  switch (columnKey) {
    case "name_en":
      return (
        <div className="flex items-center">
          <span>{Branch.BranchName_en}</span>
        </div>
      );
    case "name_ka":
      return (
        <div className="flex items-center">
          <span>{Branch.BranchName_ka}</span>
        </div>
      );
    case "description_ka":
      return <span>{Branch.description_ka}</span>;
    case "description_en":
      return <span>{Branch.description_en}</span>;
    case "courses":
      return <span>{CourseCount}</span>;
    case "actions":
      return (
        <div className="flex items-center gap-4">
          <EditBranch onUpdateBranch={handleBranchEdit} Branch={Branch} />
          <DeleteBranch
            branchId={Branch.BranchId}
            onBranchDelete={handleBranchRemove}
          />
        </div>
      );
    default:
      return <span>{cellValue}</span>;
  }
};
