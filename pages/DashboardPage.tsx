import PieChartCard from "@/components/dashboard/PieChartCard";import SoilValuesChartCad from "@/components/dashboard/SoilValuesChartCad";
import ValueInputCard from "@/components/dashboard/ValueInputCard";
import WeatherHistoryChartCard from "@/components/dashboard/WeatherHistoryChartCard";

const DashboardPage = () => {
  return (
    <main className="w-full space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Overview of your workspace activity and performance.
        </p>
      </header>

      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full"
      >
 
          <SoilValuesChartCad />
          <WeatherHistoryChartCard />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* <div className="  ">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Weekly performance
            </h2>
            <span className="text-xs text-muted-foreground">Last 7 days</span>
          </div>
          <div className="mt-6 grid h-40 place-items-center rounded-xl border border-dashed border-border/70 text-sm text-muted-foreground">
            Chart placeholder
          </div>
        </div> */}
        <ValueInputCard />
        <PieChartCard />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">
            Upcoming tasks
          </h2>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/70 px-3 py-2">
              <span>Field inspection</span>
              <span>Tomorrow</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/70 px-3 py-2">
              <span>Sensor calibration</span>
              <span>Friday</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Notes</h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Keep your data sources updated to get the most accurate insights.
            You can manage integrations from Settings.
          </p>
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;
