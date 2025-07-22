import { UpdateBasicDetailsForm } from "@/components/basic-details-form";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Page() {
  return (
    <main className="flex flex-col items-center">
      <Header />
      <div className="flex min-h-svh w-full items-center justify-center p-5 md:p-10">
        <div className="w-full max-w-sm">
          <UpdateBasicDetailsForm />
        </div>
      </div>
      <Footer/>
    </main>
  );
}
