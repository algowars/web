import { ProfileProvider } from "./profile-context";
import ProfileInfo from "./profile-info/profile-info";

type ProfileProps = {
  params: Promise<{ username: string }>;
};

export default async function Profile({ params }: ProfileProps) {
  const username = (await params).username;

  return (
    <ProfileProvider username={username}>
      <div className="grid grid-cols-12">
        <div className="col-span-3">
          <ProfileInfo />
        </div>
      </div>
    </ProfileProvider>
  );
}
