import React, { useEffect, useState, useTransition } from "react";
import { Sidebar } from "./sidebar.styles";
import { Avatar, Spinner, Tooltip } from "@nextui-org/react";
import { CompaniesDropdown } from "./companies-dropdown";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { PaymentsIcon } from "../icons/sidebar/payments-icon";
import { BalanceIcon } from "../icons/sidebar/balance-icon";
import { AccountsIcon } from "../icons/sidebar/accounts-icon";
import { CustomersIcon } from "../icons/sidebar/customers-icon";
import { DevIcon } from "../icons/sidebar/dev-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { CollapseItems } from "./collapse-items";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { FilterIcon } from "../icons/sidebar/filter-icon";
import { useSidebarContext } from "../layout/layout-context";
import { ChangeLogIcon } from "../icons/sidebar/changelog-icon";
import { usePathname } from "next/navigation";
import ThemeSwitcher from "../theme-switch";
import LanguageSwitcher from "../language-switch";
import { useTranslations } from "@/actions/localisation";
import { Locale } from "@/i18n.config";
import Branchs from "@/app/api/Branch";
import { BranchIcon } from "../icons/sidebar/branch-icon";
import { ProductsIcon } from "../icons/sidebar/products-icon";

interface Props {
  lang: Locale;
}

interface ApiResponse<T> {
  status: boolean;
  result?: T;
}

interface brancheModel {
  brancheId: number;
  brancheName_ka: string;
  brancheName_en: string;
  logoURL: string;
  description_ka: string;
  description_en: string;
}

export const SidebarWrapper = ({ lang }: Props) => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();
  const translations = useTranslations(lang, "SideBar");

  const brancheAPi = Branchs();
  const [Brances, setBranchs] = useState<brancheModel[]>([]);

  useEffect(() => {
    const fetchBranchs = async () => {
      try {
        const fetchedBranchsStatus: ApiResponse<any> =
          await brancheAPi.GetBranch();
        if (!fetchedBranchsStatus.status) {
          console.log("Error fetching Brances:", fetchedBranchsStatus.result);
          return;
        }
        const fetchedBranchs = fetchedBranchsStatus.result;
        setBranchs(fetchedBranchs);
      } catch (error) {
        console.error("Error fetching Brances:", error);
      }
    };

    fetchBranchs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!translations) {
    return <Spinner />;
  }

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title={translations.home}
              icon={<HomeIcon />}
              isActive={pathname === "/"}
              href="/"
            />
            {/* <SidebarMenu title={translations.main_menu}>
              <SidebarItem
                isActive={pathname === "/payments"}
                title={translations.payements}
                icon={<PaymentsIcon />}
              />
              <SidebarItem
                isActive={pathname === "/customers"}
                title={translations.customers}
                icon={<CustomersIcon />}
              />
            </SidebarMenu> */}

            <SidebarMenu title={translations.data}>
              <SidebarItem
                isActive={pathname === "/branches"}
                title={translations.branch}
                icon={<BranchIcon />}
                href="/branches"
              />
              <CollapseItems
                icon={<ProductsIcon />}
                items={Brances.map((branch, index) => ({
                  id: branch.brancheId,
                  name:
                    lang === "en"
                      ? branch.brancheName_en
                      : branch.brancheName_ka,
                }))}
                title={translations.product}
              />
            </SidebarMenu>

            <SidebarMenu title={translations.updates}>
              <SidebarItem
                isActive={pathname === "/changelog"}
                title={translations.changelog}
                icon={<ChangeLogIcon />}
              />
            </SidebarMenu>
          </div>
          <div className="flex flex-col  items-center justify-center gap-6 pt-16 pb-8 px-8 md:pt-10 md:pb-0">
            <div className="flex items-center justify-center gap-6 pt-16 pb-8 px-8 md:pt-10 md:pb-0">
              <Tooltip content={"Settings"} color="primary">
                <div className="max-w-fit">
                  <SettingsIcon />
                </div>
              </Tooltip>
              <Tooltip content={"Adjustments"} color="primary">
                <div className="max-w-fit">
                  <FilterIcon />
                </div>
              </Tooltip>
            </div>
            <div className="flex items-center justify-center gap-6">
              <div className="w-full flex justify-center">
                <div className="max-w-fit">
                  <ThemeSwitcher isSmall={true} />
                </div>
              </div>
              <div className="max-w-fit">
                <LanguageSwitcher isSmall={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
