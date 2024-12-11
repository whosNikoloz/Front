"use client";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DotsIcon } from "@/components/icons/accounts/dots-icon";
import { InfoIcon } from "@/components/icons/accounts/info-icon";
import { TrashIcon } from "@/components/icons/accounts/trash-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { SettingsIcon } from "@/components/icons/sidebar/settings-icon";
import { TableWrapper } from "@/components/branchTable/table";
import { AddBranch } from "./add-branch";
import { Toaster } from "react-hot-toast";
import BranchAPI from "@/app/api/Branch";

interface BranchModel {
  branchId: number;
  branchNameKa: string;
  branchNameEn: string;
  descriptionKa: string;
  descriptionEn: string;
  products: [];
}

interface ApiResponse<T> {
  status: boolean;
  result?: T;
}

export const BranchesIndex = () => {
  const [Branchs, setBranchs] = useState<BranchModel[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const BranchAPi = BranchAPI();

  useEffect(() => {
    const fetchBranchs = async () => {
      try {
        const statusApi: ApiResponse<any> = await BranchAPi.GetBranch();
        if (statusApi.status) {
          setBranchs(statusApi.result);
        } else if (!statusApi.status) {
          console.log("Error fetching Branchs:", statusApi.result);
        }
      } catch (error) {
        console.error("Error fetching Branchs:", error);
      }
    };
    fetchBranchs();
  }, []);

  const handleAddBranch = (newBranch: any) => {
    setBranchs((prevBranchs) => [...prevBranchs, newBranch]);
  };

  const handleBranchDelete = (BranchId: number) => {
    setBranchs((prevBranchs) =>
      prevBranchs.filter((Branch) => Branch.branchId !== BranchId)
    );
  };

  const hanldeBranchEdit = (updatedBranch: BranchModel) => {
    setBranchs((prevBranchs) =>
      prevBranchs.map((Branch) =>
        Branch.branchId === updatedBranch.branchId ? updatedBranch : Branch
      )
    );
  };

  const filteredBranchs = Branchs.filter((Branch) =>
    Branch.branchNameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={"/"}>
            <span>Home</span>
          </Link>
          <span> / </span>{" "}
        </li>

        <li className="flex gap-2">
          <UsersIcon />
          <span>Branches</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">All Branches</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Search Branches"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SettingsIcon />
          <TrashIcon />
          <InfoIcon />
          <DotsIcon />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <AddBranch onAddNewBranch={handleAddBranch} />
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper
          Branchs={filteredBranchs}
          onDeleteBranch={handleBranchDelete}
          onUpdateBranch={hanldeBranchEdit}
        />
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};
