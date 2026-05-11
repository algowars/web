
import ProfileInfo from "./profile-info/profile-info";
import { useProfileStoreWithQuery } from "./profile-store";

type ProfileProps = {
  username: string;
};

export default function Profile({ username }: ProfileProps) {
  useProfileStoreWithQuery(username);

  return (
      <div className="grid grid-cols-12">
        <div className="col-span-3">
          <ProfileInfo />
        </div>
      </div>
  );
}
