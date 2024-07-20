import { isAuthenticated, logout } from "@/lib/utils";
import { redirect } from "next/navigation";

export const Topbar = async () => {
  const auth = await isAuthenticated();

  const user: string | null = auth?.name ?? null;
  return (
    <div className="flex items-center justify-end gap-4 p-3 text-sm text-[#333333]">
      <div>Help</div>
      <div>Orders & Returns</div>
      {user && (
        <div className="flex items-center gap-2">
          <div>
            Hi,
            <span className="px-2 font-bold text-black">
              {user.charAt(0).toUpperCase() + user.slice(1)}
            </span>
          </div>
          <form
            action={async () => {
              "use server";
              await logout();
              redirect("/login");
            }}
          >
            <button type="submit">Logout</button>
          </form>
        </div>
      )}
    </div>
  );
};
