import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
export function Header() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
           <div className="w-full  flex justify-between items-center p-3 px-5 text-sm">{/*max-w-5xl */}
            <div className="flex gap-5 items-center font-bold">
              <Link href={"/"}><h4 className="font-bold text-2xl">PhoenixERP</h4></Link>
              <div className="flex items-center gap-2">
              </div>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
  );
}
