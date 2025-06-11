import { Button } from "@/components/ui/button";
import { fetchProfile } from "@/utils/actions";
import { FaRegUserCircle } from "react-icons/fa";
import { currentUser } from "@clerk/nextjs/server";

import Image from "next/image";
import Link from "next/link";

export default async function UserBtn() {
  const user = await currentUser();
  const hasProfile = user?.privateMetadata?.hasProfile;

  const userInfo = {
    userImage: "",
    userUsername: "",
  };

  if (hasProfile) {
    const profileData = await fetchProfile();



    const { profileImage, username, firstName } = profileData || {};

    userInfo.userImage = profileImage || user?.imageUrl || "";
    userInfo.userUsername = username || firstName || "";
  } else {
    userInfo.userImage = user?.imageUrl ?? "";
    userInfo.userUsername = user?.username || user?.firstName || "";
  }

  // }
  // const profileData = await fetchProfile();

  // const { profileImage, username, firstName } = profileData;

  return (
    <div>
      <Button
        asChild
        variant={"outline"}
        className="flex  items-center gap-2 overflow-hidden"
      >
        <Link href="/dashboard/profile">
          <span className="capitalize">
            {/* {user?.username || user?.firstName || "User"} */}
            {userInfo.userUsername}
          </span>
          <div className="overflow-hidden rounded-full">
            {userInfo.userImage ? (
              <Image
                src={userInfo.userImage}
                alt="User Avatar"
                width={28}
                height={28}
                className="rounded-full transition-transform duration-300 hover:scale-120"
              />
            ) : (
              <div className="w-full h-full text-2xl">
                <FaRegUserCircle
                  size={30}
                  className="w-12 h-12 text-primary  text-5xl"
                />
              </div>
            )}
          </div>
        </Link>
      </Button>
    </div>
  );
}
