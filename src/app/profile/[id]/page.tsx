const UserProfile = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>
        Profile Page{" "}
        <span className="text-2xl ml-2 p-2 rounded-md bg-orange-500 text-black">
          {id}
        </span>
      </h1>
    </div>
  );
};

export default UserProfile;