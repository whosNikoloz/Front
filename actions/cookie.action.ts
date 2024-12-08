"use server";

import { cookies } from "next/headers";

export const createCustomCookie = async (name: string, value: string) => {
  cookies().set(name, value, { secure: true });
};

export const deleteCustomCookie = async (name: string) => {
  cookies().delete(name);
};
