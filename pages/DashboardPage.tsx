import DashboardWeatherCardWrapper from "@/components/dashboard/DashboardWeatherCardWrapper";
import WeatherHistoryChartCard from "@/components/dashboard/WeatherHistoryChartCard";
import ValueInputCard from "@/components/dashboard/ValueInputCard";
import PieChartCard from "@/components/dashboard/PieChartCard";
import SoilValuesChartCard from "@/components/dashboard/SoilValuesChartCard";

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

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        <SoilValuesChartCard />
        <WeatherHistoryChartCard />
        <DashboardWeatherCardWrapper />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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
