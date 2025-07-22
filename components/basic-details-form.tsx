"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
interface BasicDetails {
  id: number;
  fname: string | '';
  mname: string | '';
  lname: string | '';
  effective_start: string | ''; // ISO date string
  effective_end: string | ''; // ISO date string or null
  uid: string | '';
}

export function UpdateBasicDetailsForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [basicDetail, setBasicDetail] = useState<BasicDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const blankBasicDetails: BasicDetails = {
    id: 0,
    fname: '',
    mname: '',
    lname: '',
    effective_start: '',
    effective_end: '',
    uid: ''
  };
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
      try {
        // Get current user info
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.id) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }
        // Fetch basic details for the current user
        const { data, error } = await supabase
          .from("basic_details")
          .select("*")
          .eq("uid", user.id)
          .is("effective_end", null);
        if (error) {
          setBasicDetail(blankBasicDetails);
        } else {
          setBasicDetail(data.length > 0 ? data[0] : blankBasicDetails);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch basic details");
        
      } finally {
        setLoading(false);
      }
    };

  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  
  const handleUpdateBasicDetails = async (e: React.FormEvent) => {
  e.preventDefault();    
  setIsLoading(true);
  setError(null);

  try {
    if (!basicDetail) throw new Error("No basic detail to update");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) throw new Error("User not authenticated");

    const currentTimestamp = new Date().toISOString();
    console.log(user);
    console.log(basicDetail);
    console.log(basicDetail.uid !== '');
    // 1. Update existing row to set effective_end
    if(basicDetail.uid !== ''){
      const updateResult = await supabase
      .from("basic_details")
      .update({ effective_end: currentTimestamp })
      //.eq("id", basicDetail.id) 
      .eq("uid", basicDetail.uid)
      .is("effective_end", null);

      if (updateResult.error) {
        throw new Error(updateResult.error.message);
      }
    }else{
      basicDetail.uid = user?.id;
    }
    console.log(basicDetail);

    // 2. Insert new row with updated data
    const insertResult = await supabase
      .from("basic_details")
      .insert({
        fname: basicDetail.fname,
        mname: basicDetail.mname,
        lname: basicDetail.lname,
        effective_start: currentTimestamp,
        effective_end: null,
        uid: (basicDetail.uid ),
      });

    if (insertResult.error) {
      throw new Error(insertResult.error.message);
    }

    // Optionally, refetch data or update local state
    //await fetchData();
    router.push("/home");

  } catch (err) {
    setError(err instanceof Error ? err.message : "An error occurred");
  } finally {
    setIsLoading(false);
  }
};

  const handleInputChange = (
    field: keyof BasicDetails,
    value: string
  ) => {
    setBasicDetail(prev => prev ? { ...prev, [field]: value } : null);
    console.log("Called handleInputChange with field: "+field+" value : "+value);
    console.log(basicDetail);
  };
  
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">My Profile</CardTitle>
          <CardDescription>Basic details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateBasicDetails}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="fname">First Name</Label>
                </div>
                <Input id="fname" type="text" placeholder={'First Name'} required value={basicDetail?.fname?basicDetail?.fname:''} onChange={(e) => handleInputChange('fname', e.target.value)} />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="mname">Middle Name</Label>
                </div>
                 <Input id="mname" type="text" placeholder={'Middle Name'} value={basicDetail?.mname?basicDetail?.mname:''} onChange={(e) => handleInputChange('mname', e.target.value)} />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="lname">Last Name</Label>
                </div>
                 <Input id="lname" type="text" placeholder={'Last Name'} required value={basicDetail?.lname?basicDetail?.lname:''} onChange={(e) => handleInputChange('lname', e.target.value)} />
              </div>
              {/* <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="uuid">User Id</Label>
                </div>
                 <Input id="uuid" type="text" placeholder={'uuid'} disabled value={basicDetail?.uid} />
              </div> */}
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Updating Basic Details..." : "Update Details"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
