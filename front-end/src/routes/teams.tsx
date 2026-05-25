import { Button } from "@/components/base/Button";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  CheckCircle2,
  CalendarCheck,
  DollarSign,
  Search,
  Filter,
  Download,
  Table,
  Network,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ManpowerStatCard } from "@/components/teams/ManpowerStatCard";
import { Breadcrumbs } from "@/components/base/Breadcrumbs";
import { useUsers } from "@/hooks/api/useUsers";
import { Select } from "@/components/base/Select";
import { Pagination } from "@/components/base/Pagination";
import type { User, SkillSet } from "@/types/api";

interface UserSkill {
  id: string;
  userId: string;
  skillSetId: string;
  skillSet?: SkillSet;
}

interface TeamMember extends User {
  skills?: UserSkill[];
}

export const Route = createFileRoute("/teams")({
  component: Teams,
});

function Teams() {
  const { data: users, isLoading, error } = useUsers();
  const [activeTab, setActiveTab] = useState<"TABLE" | "ORG_CHART">("TABLE");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("ALL");
  const [selectedRank, setSelectedRank] = useState("ALL");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Apply filters to users
  const filteredUsers =
    (users as TeamMember[] | undefined)?.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.rank?.name || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSkill =
        selectedSkill === "ALL" ||
        u.skills?.some((s) => s.skillSet?.name === selectedSkill);

      const matchesRank =
        selectedRank === "ALL" || u.rank?.name === selectedRank;

      return matchesSearch && matchesSkill && matchesRank;
    }) || [];

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  
  // Normalize current page to prevent empty page index if filter changes
  const normalizedPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));

  const paginatedUsers = filteredUsers.slice(
    (normalizedPage - 1) * itemsPerPage,
    normalizedPage * itemsPerPage
  );

  // Extract unique skills & ranks dynamically for selectors
  const uniqueSkills = Array.from(
    new Set(
      (users || [])
        .flatMap((u) => (u as TeamMember).skills || [])
        .map((s) => s.skillSet?.name)
        .filter((name): name is string => !!name),
    ),
  );

  const uniqueRanksList = Array.from(
    new Set(
      (users || [])
        .map((u) => u.rank?.name)
        .filter((name): name is string => !!name),
    ),
  );

  // Get unique ranks, sorted by baseSalary descending for Org Chart
  const uniqueRanksForOrg = Array.from(
    new Map(
      filteredUsers
        .map((u) => u.rank)
        .filter((r): r is NonNullable<typeof r> => !!r)
        .map((r) => [r.id, r]),
    ).values(),
  ).sort((a, b) => b.baseSalary - a.baseSalary);

  // Group users into levels by these ranks
  const orgLevels = uniqueRanksForOrg
    .map((rank) => ({
      rankName: rank.name,
      members: filteredUsers.filter((u) => u.rankId === rank.id),
    }))
    .filter((level) => level.members.length > 0);

  if (isLoading) return <div className="p-6">Loading resources...</div>;
  if (error)
    return <div className="p-6 text-error">Error loading resources</div>;

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-surface animate-fade-in">
      {/* Breadcrumbs & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <Breadcrumbs items={[{ label: "Teams" }]} />
          <h2 className="font-bold text-display-lg text-on-surface mb-1">
            Manpower Directory
          </h2>
          <p className="text-on-surface-variant text-body-md">
            Advanced resource allocation and skill mapping engine.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="glass" prefixIcon={<Filter className="w-4 h-4" />}>
            Advanced Filters
          </Button>
          <Button variant="primary" prefixIcon={<Download className="w-4 h-4" />}>
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <ManpowerStatCard
          title="Total Personnel"
          value={filteredUsers.length.toString()}
          change="+0% vs LY"
          icon={Users}
          trend="neutral"
        />
        <ManpowerStatCard
          title="Utilization"
          value="84.2%"
          change="Optimal"
          icon={CheckCircle2}
          trend="neutral"
          accentColor="secondary"
        />
        <ManpowerStatCard
          title="Availability"
          value="156"
          change="32 New"
          icon={CalendarCheck}
          trend="up"
          accentColor="secondary"
        />
        <ManpowerStatCard
          title="Avg. M/M Cost"
          value="₩68,500,000"
          change="Budget Bound"
          icon={DollarSign}
          trend="neutral"
        />
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-outline-variant/30 mb-8 gap-2">
        <button
          onClick={() => setActiveTab("TABLE")}
          className={cn(
            "pb-3 px-4 font-bold text-label-caps tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer",
            activeTab === "TABLE"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface",
          )}
        >
          <Table className="w-4.5 h-4.5" /> Members Table
        </button>
        <button
          onClick={() => setActiveTab("ORG_CHART")}
          className={cn(
            "pb-3 px-4 font-bold text-label-caps tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer",
            activeTab === "ORG_CHART"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface",
          )}
        >
          <Network className="w-4.5 h-4.5" /> Org Chart
        </button>
      </div>

      {/* Search & Filter Strip */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search by name, email, or rank..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-on-surface text-label-md outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Select
            value={selectedSkill}
            onChange={setSelectedSkill}
            options={[
              { value: "ALL", label: "All Skills" },
              ...uniqueSkills.map((skill) => ({ value: skill, label: skill })),
            ]}
            className="min-w-[150px]"
          />
          <Select
            value={selectedRank}
            onChange={setSelectedRank}
            options={[
              { value: "ALL", label: "Rank: All" },
              ...uniqueRanksList.map((rank) => ({ value: rank, label: rank })),
            ]}
            className="min-w-[150px]"
          />
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === "TABLE" && (
        <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-lg mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container/50">
                  <th className="p-4 text-label-caps font-bold text-on-surface-variant tracking-wider">
                    Member
                  </th>
                  <th className="p-4 text-label-caps font-bold text-on-surface-variant tracking-wider">
                    Rank / Role
                  </th>
                  <th className="p-4 text-label-caps font-bold text-on-surface-variant tracking-wider">
                    Monthly Base Salary
                  </th>
                  <th className="p-4 text-label-caps font-bold text-on-surface-variant tracking-wider">
                    Skills
                  </th>
                  <th className="p-4 text-label-caps font-bold text-on-surface-variant tracking-wider">
                    Status
                  </th>
                  <th className="p-4 text-label-caps font-bold text-on-surface-variant tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-outline-variant/50 hover:bg-interaction-hover transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              member.avatarUrl ||
                              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                            }
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover border border-outline-variant"
                          />
                          <div>
                            <div className="font-bold text-on-surface text-label-md">
                              {member.name}
                            </div>
                            <div className="text-label-sm text-on-surface-variant">
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-label-md font-semibold text-on-surface">
                          {member.rank?.name || "Employee"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-mono font-bold text-primary">
                          ₩{(member.rank?.baseSalary || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {member.skills && member.skills.length > 0 ? (
                            member.skills.map((s, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-primary-container/10 border border-primary/20 text-primary text-[10px] font-bold rounded"
                              >
                                {s.skillSet?.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-outline text-label-sm">
                              No skills mapped
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                          Available
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="px-3 py-1.5 text-label-sm font-bold border border-outline hover:border-primary text-on-surface hover:text-primary rounded-lg transition-colors cursor-pointer">
                          View Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-on-surface-variant"
                    >
                      No members matched the active filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "ORG_CHART" && (
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-8 shadow-lg mb-8 min-h-[400px] flex items-center justify-center overflow-x-auto">
          {orgLevels.length > 0 ? (
            <div className="flex flex-col items-center gap-14 py-4 relative w-full">
              {orgLevels.map((level, levelIdx) => (
                <div
                  key={level.rankName}
                  className="flex flex-col items-center w-full relative"
                >
                  {/* Rank Badge */}
                  <div className="px-4 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary font-bold text-label-caps tracking-widest mb-6 shadow-sm">
                    {level.rankName}
                  </div>

                  {/* Level Members */}
                  <div className="flex flex-wrap justify-center gap-8 z-10">
                    {level.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex flex-col items-center bg-surface-container border border-outline-variant hover:border-primary/50 hover:shadow-primary/5 transition-all duration-300 rounded-xl p-5 w-[240px] text-center shadow-md group relative cursor-pointer hover:scale-102"
                      >
                        <div className="relative mb-3">
                          <img
                            src={
                              member.avatarUrl ||
                              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                            }
                            alt={member.name}
                            className="w-16 h-16 rounded-full border-2 border-outline-variant group-hover:border-primary object-cover transition-colors"
                          />
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-secondary rounded-full border-2 border-surface-container"></span>
                        </div>

                        <h4 className="text-headline-md font-bold text-on-surface group-hover:text-primary transition-colors">
                          {member.name}
                        </h4>
                        <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mt-1 font-semibold">
                          {member.rank?.name}
                        </p>
                        <p className="text-body-sm text-outline mt-2 truncate max-w-full">
                          {member.email}
                        </p>

                        {/* Cost */}
                        <div className="mt-4 text-label-md font-bold font-mono text-primary bg-primary-container/10 border border-primary-container/20 px-3 py-1 rounded-full shadow-inner">
                          ₩{(member.rank?.baseSalary || 0).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Vertical Connector Line (except for last level) */}
                  {levelIdx < orgLevels.length - 1 && (
                    <div className="absolute bottom-[-56px] left-1/2 -translate-x-1/2 w-0.5 h-14 bg-linear-to-b from-outline-variant to-primary/30"></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-on-surface-variant py-8">
              No members matched the criteria to construct an organization
              chart.
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-label-md text-on-surface-variant">
          Showing {paginatedUsers.length > 0 ? (normalizedPage - 1) * itemsPerPage + 1 : 0} - {Math.min(normalizedPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
        </p>
        <Pagination
          currentPage={normalizedPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
