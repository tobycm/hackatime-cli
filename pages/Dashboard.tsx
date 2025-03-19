import { useQuery } from "@tanstack/react-query";
import { Box, Newline, Text } from "ink";
import FunRunningAnimation from "../components/FunRunningAnimation";
import Loading from "../components/Loading";
import { useAppContext } from "../contexts/AppContext";
import { timeAgo } from "../utils";

export default function Dashboard() {
  const { wakatimeConfig, wakatime, screenWidth } = useAppContext();

  if (!wakatimeConfig?.apiKey || !wakatimeConfig?.apiUrl || !wakatime) {
    return <Text>No API key or URL set. Please login first.</Text>;
  }

  const isMobile = screenWidth < 80;

  const user = useQuery({
    queryKey: ["userInfo", wakatimeConfig.apiUrl, wakatimeConfig.apiKey],
    queryFn: async () => (await wakatime.getUser()).data,
  });

  const allTimeSinceToday = useQuery({
    queryKey: ["allTime", wakatimeConfig.apiUrl, wakatimeConfig.apiKey],
    queryFn: async () => (await wakatime.getAllTimeSinceToday()).data,
  });

  const projects = useQuery({
    queryKey: ["projects", wakatimeConfig.apiUrl, wakatimeConfig.apiKey],
    queryFn: async () => (await wakatime.getProjects()).data,
  });

  const todayStats = useQuery({
    queryKey: ["stats", "today", wakatimeConfig.apiUrl, wakatimeConfig.apiKey],
    queryFn: async () => (await wakatime.getStatistics("current", "today")).data,
  });

  const weekStats = useQuery({
    queryKey: ["stats", "week", wakatimeConfig.apiUrl, wakatimeConfig.apiKey],
    queryFn: async () => (await wakatime.getStatistics("current", "week")).data,
  });

  const monthStats = useQuery({
    queryKey: ["stats", "month", wakatimeConfig.apiUrl, wakatimeConfig.apiKey],
    queryFn: async () => (await wakatime.getStatistics("current", "month")).data,
  });

  if (user.isError) return <Text>Error: {String(user.error)}</Text>;
  if (allTimeSinceToday.isError) return <Text>Error: {String(allTimeSinceToday.error)}</Text>;
  if (projects.isError) return <Text>Error: {String(projects.error)}</Text>;
  if (todayStats.isError) return <Text>Error: {String(todayStats.error)}</Text>;
  if (weekStats.isError) return <Text>Error: {String(weekStats.error)}</Text>;
  if (monthStats.isError) return <Text>Error: {String(monthStats.error)}</Text>;

  if (!user.isFetched || !user.data) {
    return <Loading />;
  }

  const lastHeartbeat = new Date(user.data.last_heartbeat_at);
  const timeDelta = Date.now() - lastHeartbeat.getTime();

  return (
    <>
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        height={isMobile ? 1 : 2}
        marginBottom={isMobile ? 1 : 0}>
        <Box display="flex" flexDirection="row" alignItems="center" flexWrap="wrap" marginBottom={1}>
          <Text color="cyan">{wakatimeConfig.apiUrl}</Text>
          <Text> </Text>
          <Text>Dashboard</Text>
        </Box>
        {!isMobile && <FunRunningAnimation maxDots={Math.round(screenWidth / 10)} speed={100} color="green" />}
      </Box>
      <Box display="flex" width="100%" flexDirection={isMobile ? "column" : "row"} justifyContent="space-between">
        <Box display="flex" flexDirection="column" width={isMobile ? "100%" : "55%"}>
          <Text>
            Welcome back, <Text color="blueBright">{user.data.email}</Text>
          </Text>

          {todayStats.data && (
            <Box flexDirection={isMobile ? "column" : "row"} flexWrap="wrap">
              <Text>You have coded for </Text>
              <Text>
                <Text
                  color={
                    todayStats.data.total_seconds < 60 * 5 ? "redBright" : todayStats.data.total_seconds < 60 * 15 ? "yellowBright" : "greenBright"
                  }>
                  {todayStats.data.human_readable_total}
                </Text>{" "}
                today{weekStats.data && ", "}
              </Text>
              {weekStats.data && (
                <Text>
                  <Text
                    color={
                      todayStats.data.total_seconds < 60 * 5 * 5
                        ? "redBright"
                        : todayStats.data.total_seconds < 60 * 15 * 5
                        ? "yellowBright"
                        : "greenBright"
                    }>
                    {weekStats.data.human_readable_total}
                  </Text>{" "}
                  this week{monthStats.data && ", "}
                </Text>
              )}
              {monthStats.data && (
                <Text>
                  <Text
                    color={
                      todayStats.data.total_seconds < 60 * 5 * 20
                        ? "redBright"
                        : todayStats.data.total_seconds < 60 * 15 * 20
                        ? "yellowBright"
                        : "greenBright"
                    }>
                    {monthStats.data.human_readable_total}
                  </Text>{" "}
                  this month
                </Text>
              )}
            </Box>
          )}
        </Box>
        <Box width={isMobile ? "0%" : "5%"} />
        <Box
          display="flex"
          marginTop={isMobile ? 1 : 0}
          flexDirection="column"
          width={isMobile ? "100%" : "40%"}
          alignItems={isMobile ? "flex-start" : "flex-end"}>
          <Box
            flexDirection="row"
            flexWrap="wrap"
            alignItems={isMobile ? "flex-start" : "flex-end"}
            width="100%"
            justifyContent={isMobile ? "flex-start" : "flex-end"}>
            <Text>
              Last heartbeat:{" "}
              <Text color={timeDelta > 1000 * 60 * 60 * 18 ? "red" : timeDelta > 1000 * 60 * 60 ? "yellow" : "green"}>{timeAgo(lastHeartbeat)}</Text>{" "}
            </Text>
            <Text>
              <Text color="gray">({lastHeartbeat.toLocaleString()})</Text>
            </Text>
          </Box>
          {allTimeSinceToday.data && (
            <Box
              flexDirection="row"
              flexWrap="wrap"
              alignItems={isMobile ? "flex-start" : "flex-end"}
              width="100%"
              justifyContent={isMobile ? "flex-start" : "flex-end"}>
              <Text>
                All time coded: <Text color="green">{allTimeSinceToday.data.text}</Text>{" "}
              </Text>
              <Text>
                <Text color="gray">({allTimeSinceToday.data.total_seconds.toLocaleString()} seconds)</Text>
              </Text>
            </Box>
          )}
          <Text>
            <Text color="gray">User ID: {user.data.id}</Text>
          </Text>
        </Box>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text>
          Projects coded <Text color="greenBright">last 24 hours</Text>:
          <Newline />
        </Text>

        {!todayStats.data ? (
          <Loading />
        ) : (
          todayStats.data.projects.map((project) => (
            <Text key={project.name}>
              <Text color={project.total_seconds < 60 * 5 ? "redBright" : project.total_seconds < 60 * 15 ? "yellowBright" : "greenBright"}>
                {project.name}
              </Text>
              : {project.text}
            </Text>
          ))
        )}
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text>
          Projects coded <Text color="greenBright">this week</Text>:
          <Newline />
        </Text>

        {!weekStats.data ? (
          <Loading />
        ) : (
          weekStats.data.projects.map((project) => (
            <Text key={project.name}>
              <Text color={project.total_seconds < 60 * 5 ? "redBright" : project.total_seconds < 60 * 15 ? "yellowBright" : "greenBright"}>
                {project.name}
              </Text>
              : {project.text}
            </Text>
          ))
        )}
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text>
          Projects coded <Text color="greenBright">this month</Text>:
          <Newline />
        </Text>

        {!monthStats.data ? (
          <Loading />
        ) : (
          monthStats.data.projects.map((project) => (
            <Text key={project.name}>
              <Text color={project.total_seconds < 60 * 10 ? "redBright" : project.total_seconds < 60 * 25 ? "yellowBright" : "greenBright"}>
                {project.name}
              </Text>
              : {project.text}
            </Text>
          ))
        )}
      </Box>
    </>
  );
}
