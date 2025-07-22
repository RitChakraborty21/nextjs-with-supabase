import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  const { data:basicDetails ,error :er2} = await supabase.from('basic_details').select('*').eq('uid',user?.sub).is('effective_end', null);
  var uname = null;
  if(basicDetails && basicDetails.length > 0) {
    const basicDetail = basicDetails[0];
    //console.log(basicDetail.fname+" "+basicDetail.lname)
    if(basicDetail.fname != null || basicDetail.fname != undefined){
      uname = basicDetail.fname ;
    }
    if(basicDetail.mname != null || basicDetail.mname != undefined){
      uname=uname+" "+basicDetail.mname;
    }
    if(basicDetail.lname != null || basicDetail.lname != undefined){
      uname=uname+" "+basicDetail.lname;
    }
  } 

  return user ? (
    <div className="flex items-center gap-4">
      <Link href="/profile/update-basicdetails">Hey, {uname?uname:user.email}!</Link>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
