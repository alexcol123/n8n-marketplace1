import { SubmitButton } from "@/components/(custom)/(dashboard)/Form/Buttons";
import FormContainer from "@/components/(custom)/(dashboard)/Form/FormContainer";
import FormInput from "@/components/(custom)/(dashboard)/Form/FormInput";
import ImageInputContainer from "@/components/(custom)/(dashboard)/Form/ImageInputContainer";
import TextAreaInput from "@/components/(custom)/(dashboard)/Form/TextAreaInput";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import {
  fetchProfile,
  updateProfileAction,
  updateProfileImageAction,
} from "@/utils/actions";

import { redirect } from "next/navigation";
type UserProfile = {
  profileImage: string;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string
  // other profile properties
};

const ProfilePage = async () => {
  const profile = (await fetchProfile()) as UserProfile;



  if (!profile) {
    redirect("/dashboard");
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">
        Update Your Profile
      </h1>

      <Alert className="mb-6 bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 border-amber-200 dark:border-amber-800/30">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Your username must be unique. If you change it, make sure to choose something that isn&apos;t taken by another user.
        </AlertDescription>
      </Alert>

      <div className="border p-8 rounded-md bg-card shadow-sm">
        <ImageInputContainer
          image={profile.profileImage}
          name={profile.username}
          action={updateProfileImageAction}
          text={"Update Image"}
        />

        <FormContainer action={updateProfileAction}>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <FormInput
              type="text"
              name="firstName"
              label="First Name"
              placeholder="John"
              defaultValue={profile.firstName}
            />

            <FormInput
              type="text"
              name="lastName"
              label="Last Name"
              placeholder="Smith"
              defaultValue={profile.lastName}
            />

            <div className="md:col-span-2">
              <FormInput
                type="text"
                name="username"
                label="Username"
                placeholder="johndoe123"
                defaultValue={profile.username}
                isUnique={true}
                pattern="^[a-zA-Z0-9_]+$"
                minLength={3}
                maxLength={20}
                checkAvailability={true}
                helperText="This will be your unique identifier across the platform."
              />
            </div>

            <TextAreaInput
              name="bio"
              labelText="Bio (under 500 characters)"
              defaultValue={profile?.bio}
            />
          </div>

          <SubmitButton className="mt-10" text="Update Profile" />
        </FormContainer>
      </div>
    </section>
  );
};
export default ProfilePage;