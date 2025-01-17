import { Input, Link, Navbar, NavbarContent } from "@nextui-org/react";
import React, { useCallback } from "react";
import { FeedbackIcon } from "../icons/navbar/feedback-icon";
import { GithubIcon } from "../icons/navbar/github-icon";
import { SupportIcon } from "../icons/navbar/support-icon";
import { SearchIcon } from "../icons/searchicon";
import { BurguerButton } from "./burguer-button";
import { NotificationsDropdown } from "./notifications-dropdown";
import UserDropdown from "./user-dropdown";
import { useRouter } from "next/navigation";
import { Locale } from "@/i18n.config";

interface Props {
  children: React.ReactNode;
  lang: Locale;
}

export const NavbarWrapper = ({ children, lang }: Props) => {
  const router = useRouter();

  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <Navbar
        isBordered
        className="w-full"
        classNames={{
          wrapper: "w-full max-w-full",
        }}
      >
        <NavbarContent className="md:hidden">
          <BurguerButton />
        </NavbarContent>
        <NavbarContent className="w-full max-md:hidden">
          <Input
            startContent={<SearchIcon />}
            isClearable
            className="w-full"
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Search..."
          />
        </NavbarContent>
        <NavbarContent
          justify="end"
          className="w-fit data-[justify=end]:flex-grow-0"
        >
          <div className="flex items-center gap-2 max-md:hidden">
            <FeedbackIcon />
            <span>Feedback?</span>
          </div>

          <NotificationsDropdown />

          <div className="max-md:hidden">
            <SupportIcon />
          </div>

          <Link href="https://github.com/whosNikoloz" target={"_blank"}>
            <GithubIcon />
          </Link>
        </NavbarContent>
      </Navbar>
      {children}
    </div>
  );
};
