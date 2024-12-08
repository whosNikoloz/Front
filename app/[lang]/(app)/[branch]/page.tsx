import { ProductsIndex } from "@/components/products";
import { cookies } from "next/headers";
import React from "react";

const Courses = ({ params }: { params: { branch: string } }) => {
  const branchid = Number(cookies().get("branchid")?.value) || 0;
  const branchName = params.branch;
  return <ProductsIndex branchid={branchid} branchName={branchName} />;
};

export default Courses;
