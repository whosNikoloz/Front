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
import { RenderBranchCell } from "./render-cell";

const columns = [
  { name: "NAME_EN", uid: "name_en" },
  { name: "NAME_KA", uid: "name_ka" },
  { name: "DESCRIPTION_EN", uid: "description_en" },
  { name: "DESCRIPTION_KA", uid: "description_ka" },
  { name: "PRODUCTS", uid: "products" },
  { name: "ACTIONS", uid: "actions" },
];

interface BranchModel {
  branchId: number;
  branchNameKa: string;
  branchNameEn: string;
  descriptionKa: string;
  descriptionEn: string;
  products: [];
}
interface Props {
  Branchs: BranchModel[];
  onDeleteBranch: (Branchid: number) => void;
  onUpdateBranch: (newBranch: BranchModel) => void;
}

export const TableWrapper = ({
  Branchs,
  onDeleteBranch,
  onUpdateBranch,
}: Props) => {
  const [localBranchs, setBranchs] = useState<BranchModel[]>(Branchs);
  useEffect(() => {
    setBranchs(Branchs);
  }, [Branchs]);

  const handleBranchDelete = (BranchId: number) => {
    onDeleteBranch(BranchId);
  };

  const hanldeBranchEdit = (updatedBranch: BranchModel) => {
    onUpdateBranch(updatedBranch);
  };

  if (Branchs.length === 0) {
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
        <TableBody items={localBranchs}>
          {(Branch) => (
            <TableRow key={Branch.branchId}>
              {columns.map((column) => (
                <TableCell key={column.uid}>
                  {RenderBranchCell({
                    Branch: Branch, // Pass the Branch instead of user
                    columnKey: column.uid,
                    onBranchDelete: handleBranchDelete, // Correct function name
                    onBranchEdit: hanldeBranchEdit, // Correct function name
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
