import { CreateProfileAction } from "@/utils/actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import FormContainer from "./Form/FormContainer";
import FormInput from "./Form/FormInput";
import { SubmitButton } from "./Form/Buttons";

const CreateProfileComponent = async () => {
  const user = await currentUser();
  const hasProfile = user?.privateMetadata.hasProfile;

  

  if (hasProfile) {
    redirect("/dashboard/profile");
  }

  return (
    <section className="container mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-8 capitalize">
        Create Your Profile
      </h1>

      <h2 className="text-primary my-6 font-semibold animate-pulse  ">
        You must create your profile before you can continue to Dashboard
      </h2>
      <div className="border p-8 rounded-md">
        <FormContainer action={CreateProfileAction}>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <FormInput
              type="text"
              name="firstName"
              label="First Name"
              placeholder="John"
            />

            <FormInput
              type="text"
              name="lastName"
              label="Last Name"
              placeholder="Smith"
            />

            <FormInput
              type="text"
              name="username"
              label="Username"
              placeholder="john785"
            />
          </div>

          <SubmitButton className="mt-10" text="create profile " />
        </FormContainer>
      </div>
    </section>
  );
};

export default CreateProfileComponent;
