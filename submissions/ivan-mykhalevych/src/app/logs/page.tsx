import LogsView from "@/components/LogsView";

export default function LogsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:py-16">
      <h1 className="mb-6 text-3xl font-bold">
        <span className="text-accent">Logs</span>
      </h1>
      <LogsView />
    </main>
  );
}
