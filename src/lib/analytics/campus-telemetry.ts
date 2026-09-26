/**
 * CampusLens AI - Real-time Campus Telemetry & Space Utilization Engine
 */

export interface FacilityTelemetry {
  id: string;
  name: string;
  category: "lab" | "library" | "cafeteria" | "sports" | "auditorium";
  capacity: number;
  currentOccupancy: number;
  occupancyPercentage: number;
  status: "available" | "moderate" | "near_capacity" | "full";
  powerEfficiencyKw: number;
  lastUpdated: string;
}

export const CAMPUS_FACILITY_TELEMETRY: FacilityTelemetry[] = [
  {
    id: "fac-lib-01",
    name: "Dr. A.P.J. Abdul Kalam Central Library",
    category: "library",
    capacity: 350,
    currentOccupancy: 210,
    occupancyPercentage: 60,
    status: "moderate",
    powerEfficiencyKw: 18.4,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "fac-lab-01",
    name: "Alan Turing AI & Robotics Research Lab",
    category: "lab",
    capacity: 60,
    currentOccupancy: 54,
    occupancyPercentage: 90,
    status: "near_capacity",
    powerEfficiencyKw: 24.2,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "fac-cafe-01",
    name: "Campus Green Garden Cafeteria",
    category: "cafeteria",
    capacity: 220,
    currentOccupancy: 88,
    occupancyPercentage: 40,
    status: "available",
    powerEfficiencyKw: 12.0,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "fac-aud-01",
    name: "Vikram Sarabhai Main Auditorium",
    category: "auditorium",
    capacity: 800,
    currentOccupancy: 0,
    occupancyPercentage: 0,
    status: "available",
    powerEfficiencyKw: 4.5,
    lastUpdated: new Date().toISOString(),
  },
];

export function getAggregateCampusMetrics() {
  const totalCapacity = CAMPUS_FACILITY_TELEMETRY.reduce((acc, f) => acc + f.capacity, 0);
  const totalOccupancy = CAMPUS_FACILITY_TELEMETRY.reduce((acc, f) => acc + f.currentOccupancy, 0);
  const totalPower = CAMPUS_FACILITY_TELEMETRY.reduce((acc, f) => acc + f.powerEfficiencyKw, 0);

  return {
    totalCapacity,
    totalOccupancy,
    averageOccupancyPercentage: Math.round((totalOccupancy / totalCapacity) * 100),
    totalPowerConsumptionKw: totalPower.toFixed(1),
    monitoredFacilitiesCount: CAMPUS_FACILITY_TELEMETRY.length,
  };
}
