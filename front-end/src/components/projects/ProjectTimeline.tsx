import React from "react";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/base/GlassCard";
import { Button } from "@/components/base/Button";

interface Project {
  id: string;
  status: "ACTIVE" | "AT RISK" | "COMPLETED" | "ON HOLD";
  title: string;
  avatars: string[];
  avatarMore?: number;
  progress: number;
  variant: string;
  startDate: string | Date;
  endDate: string | Date;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
}

interface ProjectTimelineProps {
  projects: Project[];
  viewTab?: "Week" | "Month";
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  projects,
  viewTab = "Week",
}) => {
  // 기준일자 상태 (오늘로 초기화)
  const [anchorDate, setAnchorDate] = React.useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  // 주/월 탭이 바뀌면 기준일을 오늘로 리셋
  React.useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setAnchorDate(today);
  }, [viewTab]);

  // 주간 뷰의 시작 요일을 '월요일'로 고정하는 헬퍼 함수
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    // 0 = 일요일, 1 = 월요일, ..., 6 = 토요일
    // 월요일 기준으로 맞춰주기 위해: 일요일이면 -6일, 그 외에는 1-day 만큼 뺌
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // 기준일 및 뷰 타입에 따라 날짜 목록 동적 생성
  const dates = React.useMemo(() => {
    const arr = [];
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (viewTab === "Week") {
      // 주 단위 모드: anchorDate가 속한 주의 월요일부터 7일간
      const startOfWeek = getStartOfWeek(anchorDate);
      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);

        arr.push({
          day: dayNames[d.getDay()],
          date: String(d.getDate()),
          isToday: d.getTime() === today.getTime(),
          isWeekend: d.getDay() === 0 || d.getDay() === 6,
          fullDateStr: d.toISOString().split("T")[0],
          rawDate: d,
        });
      }
    } else {
      // 월 단위 모드: anchorDate가 속한 달의 1일부터 마지막 날까지
      const year = anchorDate.getFullYear();
      const month = anchorDate.getMonth();
      const lastDay = new Date(year, month + 1, 0).getDate();

      for (let i = 1; i <= lastDay; i++) {
        const d = new Date(year, month, i);

        arr.push({
          day: dayNames[d.getDay()],
          date: String(i),
          isToday: d.getTime() === today.getTime(),
          isWeekend: d.getDay() === 0 || d.getDay() === 6,
          fullDateStr: d.toISOString().split("T")[0],
          rawDate: d,
        });
      }
    }
    return arr;
  }, [anchorDate, viewTab]);

  // 이전 페이지로 네비게이션
  const handlePrev = () => {
    setAnchorDate((prev) => {
      const d = new Date(prev);
      if (viewTab === "Week") {
        d.setDate(prev.getDate() - 7);
      } else {
        d.setMonth(prev.getMonth() - 1);
      }
      return d;
    });
  };

  // 다음 페이지로 네비게이션
  const handleNext = () => {
    setAnchorDate((prev) => {
      const d = new Date(prev);
      if (viewTab === "Week") {
        d.setDate(prev.getDate() + 7);
      } else {
        d.setMonth(prev.getMonth() + 1);
      }
      return d;
    });
  };

  // 오늘 날짜로 이동
  const handleToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setAnchorDate(today);
  };

  // 상단 네비게이션 타이틀 문자열 포맷
  const titleStr = React.useMemo(() => {
    if (viewTab === "Week") {
      const startStr = dates[0].rawDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      const endStr = dates[dates.length - 1].rawDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      return `${dates[0].rawDate.getFullYear()}년 ${startStr} ~ ${endStr}`;
    } else {
      return `${anchorDate.getFullYear()}년 ${anchorDate.getMonth() + 1}월`;
    }
  }, [dates, viewTab, anchorDate]);

  // 타임라인 막대바 오프셋, 너비, 그리고 범위 외 포지션 유형 연산
  const getBarProps = (project: Project) => {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const timelineStart = dates[0].rawDate;
    const timelineEnd = dates[dates.length - 1].rawDate;

    // 만약 타임라인 영역과 프로젝트 기간이 전혀 겹치지 않는 경우 (범위 외)
    if (end < timelineStart) {
      return {
        left: 0,
        width: 0,
        statusStyles: "hidden",
        outOfRangeType: "past" as const, // 과거 완료
      };
    }

    if (start > timelineEnd) {
      return {
        left: 0,
        width: 0,
        statusStyles: "hidden",
        outOfRangeType: "future" as const, // 미래 예정
      };
    }

    // 겹치는 구간의 시작점과 종료점 계산
    const effectiveStart = start < timelineStart ? timelineStart : start;
    const effectiveEnd = end > timelineEnd ? timelineEnd : end;

    // timelineStart 대비 시작일 오프셋 일수 구하기
    const leftDays = Math.round(
      (effectiveStart.getTime() - timelineStart.getTime()) /
        (24 * 60 * 60 * 1000),
    );

    // 겹치는 총 일수 구하기
    const activeDays =
      Math.round(
        (effectiveEnd.getTime() - effectiveStart.getTime()) /
          (24 * 60 * 60 * 1000),
      ) + 1;

    const status = project.status;
    const statusStyles =
      status === "ACTIVE"
        ? "bg-secondary/20 text-secondary border-secondary/30"
        : status === "AT RISK"
          ? "bg-error/20 text-error border-error/30"
          : status === "COMPLETED"
            ? "bg-primary/20 text-primary border-primary/30"
            : "bg-on-surface-variant/20 text-on-surface-variant border-on-surface-variant/30";

    return {
      left: leftDays * 80,
      width: activeDays * 80 - 32, // 패딩 마진 16px 고려해 32px 차감
      statusStyles,
      outOfRangeType: "none" as const,
    };
  };

  return (
    <GlassCard className="p-0 overflow-hidden flex flex-col min-h-[400px]">
      {/* 캘린더 네비게이션 컨트롤러 */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-outline-variant/30 bg-surface-container/60 backdrop-blur-md gap-4 select-none z-[11]">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-surface-container-low border border-outline-variant/30 rounded-full p-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              prefixIcon={<ChevronLeft className="w-4 h-4" />}
            />
            <Button
              variant="ghost"
              onClick={handleToday}
              className="px-3 h-8 text-[12px]"
            >
              오늘
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              prefixIcon={<ChevronRight className="w-4 h-4" />}
            />
          </div>
          <span className="text-lg font-bold text-on-surface font-mono">
            {titleStr}
          </span>
        </div>
        <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
          {viewTab === "Week"
            ? "주간 일정 (월요일 기준)"
            : `${anchorDate.getMonth() + 1}월 전체 일정`}
        </div>
      </div>

      {/* 가로 스크롤 영역 */}
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-max flex flex-col">
          {/* 헤더 */}
          <div className="flex border-b border-outline-variant/30 sticky top-0 bg-surface-container/60 backdrop-blur-md z-[10]">
            <div className="w-[280px] p-6 border-r border-outline-variant/30 bg-surface-container-high/90 sticky left-0 z-20 shrink-0 flex items-center shadow-[4px_0_10px_rgba(0,0,0,0.3)]">
              <span className="text-label-caps font-bold text-on-surface-variant tracking-widest">
                Active Projects
              </span>
            </div>
            <div className="flex">
              {dates.map((d, i) => (
                <div
                  key={i}
                  className={cn(
                    "min-w-[80px] w-[80px] h-[72px] flex flex-col items-center justify-center border-r border-outline-variant/10",
                    d.isToday && "bg-primary-container/10 relative",
                    d.isWeekend && "bg-surface-container-low",
                  )}
                >
                  {d.isToday && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
                  )}
                  <span className="text-[10px] font-bold text-on-surface-variant tracking-wider">
                    {d.day}
                  </span>
                  <span
                    className={cn(
                      "text-lg font-mono font-bold mt-0.5",
                      d.isToday ? "text-primary" : "text-on-surface",
                    )}
                  >
                    {d.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 리스트 바디 */}
          <div className="flex-1">
            {projects.map((project) => {
              const { left, width, statusStyles, outOfRangeType } = getBarProps(project);
              const totalTeamCount = project.avatars.length + (project.avatarMore || 0);
              const isHighResource = totalTeamCount >= 3;

              return (
                <div
                  key={project.id}
                  className="flex border-b border-outline-variant/10 hover:bg-interaction-hover transition-colors group min-w-max"
                >
                  {/* 왼쪽 고정 정보 영역 */}
                  <div className="w-[280px] p-6 border-r border-outline-variant/30 bg-surface-container-high/40 group-hover:bg-interaction-hover/40 sticky left-0 z-20 shrink-0 transition-colors shadow-[4px_0_10px_rgba(0,0,0,0.2)]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-on-surface truncate max-w-[180px]">
                        {project.title}
                      </span>
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          project.status === "ACTIVE"
                            ? "bg-secondary shadow-[0_0_8px_var(--color-secondary)]"
                            : project.status === "AT RISK"
                              ? "bg-error shadow-[0_0_8px_var(--color-error)]"
                              : project.status === "COMPLETED"
                                ? "bg-primary"
                                : "bg-on-surface-variant",
                        )}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1 min-h-[16px]">
                      {/* 리소스 고부하 경고 라벨 */}
                      {isHighResource ? (
                        <span className="text-[8px] font-bold bg-error/15 text-error border border-error/20 px-1.5 py-0.5 rounded-full select-none leading-none animate-pulse">
                          RESOURCE HIGH
                        </span>
                      ) : <div />}
                    </div>

                    {/* 4분할 격자 태스크 상태판 */}
                    <div className="grid grid-cols-4 gap-1.5 mt-2 text-center font-mono">
                      <div className="flex flex-col items-center bg-surface-container-low/60 border border-outline-variant/10 rounded-md py-1 px-1">
                        <span className="text-[8px] font-bold text-on-surface-variant/75 uppercase tracking-wider">Total</span>
                        <span className="text-body-sm font-bold text-on-surface mt-0.5">{project.totalTasks}</span>
                      </div>
                      <div className="flex flex-col items-center bg-primary/5 border border-primary/10 rounded-md py-1 px-1">
                        <span className="text-[8px] font-bold text-primary/85 uppercase tracking-wider">Done</span>
                        <span className="text-body-sm font-bold text-primary mt-0.5">{project.completedTasks}</span>
                      </div>
                      <div className="flex flex-col items-center bg-secondary/5 border border-secondary/10 rounded-md py-1 px-1">
                        <span className="text-[8px] font-bold text-secondary/85 uppercase tracking-wider">Active</span>
                        <span className="text-body-sm font-bold text-secondary mt-0.5">{project.inProgressTasks}</span>
                      </div>
                      <div className={cn(
                        "flex flex-col items-center border rounded-md py-1 px-1 transition-all duration-300",
                        project.overdueTasks > 0
                          ? "bg-error/10 border-error/20 text-error animate-[pulse_2s_infinite]"
                          : "bg-surface-container-low/60 border-outline-variant/10 text-on-surface-variant/40"
                      )}>
                        <span className={cn(
                          "text-[8px] font-bold uppercase tracking-wider",
                          project.overdueTasks > 0 ? "text-error/85" : "text-on-surface-variant/40"
                        )}>Overdue</span>
                        <span className={cn(
                          "text-body-sm font-bold mt-0.5",
                          project.overdueTasks > 0 ? "text-error" : "text-on-surface-variant/30"
                        )}>{project.overdueTasks}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <div className="flex -space-x-1.5">
                        {project.avatars.slice(0, 2).map((avatar, i) => (
                          <img
                            key={i}
                            src={avatar}
                            alt="Team"
                            className="w-5 h-5 rounded-full border border-surface-container object-cover"
                          />
                        ))}
                        {project.avatarMore && project.avatarMore > 0 ? (
                          <div className="w-5 h-5 rounded-full bg-surface-container-highest border border-surface-container flex items-center justify-center text-[8px] font-bold text-on-surface">
                            +{project.avatarMore}
                          </div>
                        ) : null}
                      </div>
                      <span className="text-[10px] text-on-surface-variant font-mono">
                        ({totalTeamCount}인 투입)
                      </span>
                    </div>
                  </div>

                  {/* 오른쪽 타임라인 바 영역 */}
                  <div
                    className="relative min-h-[100px] flex items-center px-4"
                    style={{ width: `${dates.length * 80}px` }}
                  >
                    {outOfRangeType !== "none" ? (
                      // 범위 외 프로젝트 방향 지시 배지
                      <div 
                        className="absolute inset-y-0 flex items-center justify-center pointer-events-none"
                        style={{
                          left: "16px",
                          width: `${dates.length * 80 - 32}px`
                        }}
                      >
                        <div className={cn(
                          "px-4 py-1.5 rounded-full border border-dashed text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 backdrop-blur-xs select-none shadow-sm",
                          outOfRangeType === "past"
                            ? "border-outline-variant/30 text-on-surface-variant/30 bg-surface-container-low/20"
                            : "border-secondary/20 text-secondary/50 bg-secondary/5"
                        )}>
                          {outOfRangeType === "past" ? (
                            <>
                              <span className="animate-pulse">←</span>
                              <span>Past Completed (과거 일정 완료)</span>
                            </>
                          ) : (
                            <>
                              <span>Future Scheduled (미래 시작 예정)</span>
                              <span className="animate-pulse">→</span>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      // 범위 내 일반 막대 바 및 내부 진행 게이지
                      <div
                        className={cn(
                          "absolute h-10 rounded-lg border flex items-center px-4 transition-all duration-500 overflow-hidden",
                          statusStyles,
                          project.status === "AT RISK" && "shadow-[0_0_12px_rgba(239,68,68,0.25)] border-error/50",
                        )}
                        style={{ left: `${left + 16}px`, width: `${width}px` }}
                      >
                        {/* 실시간 progress 진행 게이지 바 */}
                        <div
                          className={cn(
                            "absolute left-0 top-0 bottom-0 opacity-15 pointer-events-none transition-all duration-500",
                            project.status === "ACTIVE" ? "bg-secondary" :
                            project.status === "AT RISK" ? "bg-error" :
                            project.status === "COMPLETED" ? "bg-primary" : "bg-on-surface-variant"
                          )}
                          style={{ width: `${project.progress}%` }}
                        />

                        {/* 내용물 텍스트 */}
                        <span className="text-[10px] font-bold tracking-widest uppercase truncate whitespace-nowrap relative z-10">
                          {project.status === "ACTIVE"
                            ? `PHASE 1 • ${project.progress}%`
                            : project.status === "AT RISK"
                              ? `CRITICAL • ${project.progress}%`
                              : project.status === "COMPLETED"
                                ? "DELIVERED"
                                : "ON HOLD"}
                        </span>

                        {project.status === "AT RISK" && (
                          <div className="absolute right-4 top-0 bottom-0 flex items-center justify-center z-10">
                            <div
                              className="absolute inset-0 opacity-20 pointer-events-none"
                              style={{
                                background:
                                  "repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 20px)",
                              }}
                            ></div>
                            <AlertCircle className="w-4 h-4 relative z-10 text-error" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
