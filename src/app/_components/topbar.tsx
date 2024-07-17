export const Topbar = () => {
  const user = "akshaygore";
  return (
    <div className="flex items-center justify-end gap-4 p-3 text-sm text-[#333333]">
      <div>Help</div>
      <div>Orders & Returns</div>
      <div>Hi, {user}</div>
    </div>
  );
};
