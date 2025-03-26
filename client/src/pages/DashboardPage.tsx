import Container from "@/components/general/Container";
import DataVisualization from "@/components/general/DataVisualization";
import SelectRoles from "@/components/general/SelectRoles";
import StreakTracker from "@/components/general/StreakTracker";
function DashboardPage() {
  return (
    <div className="h-full w-full p-6 space-y-6">
      <Container>
        <div className="">
          <SelectRoles />
        </div>
        <div className="mt-4 flex justify-between">
          <DataVisualization />
          <StreakTracker />
        </div>
      </Container>
    </div>
  );
}

export default DashboardPage;
