import React, { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  Database,
  Cpu,
  HardDrive,
  Users,
  AlertOctagon,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingDown,
  TrendingUp,
  Zap,
  Globe,
  Radio,
  FileText,
  Eye,
  Sliders,
  ShieldAlert,
  ArrowUpRight,
  Wifi,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const mockSlowApis = [
  {
    endpoint: '/api/v1/receipts/ocr-parse',
    method: 'POST',
    avgLatency: '840 ms',
    p95Latency: '1,420 ms',
    requests: '1,842 calls',
    errorRate: '0.12%',
    status: 'SLOW',
  },
  {
    endpoint: '/api/v1/reports/pdf-export',
    method: 'GET',
    avgLatency: '620 ms',
    p95Latency: '1,050 ms',
    requests: '412 calls',
    errorRate: '0.00%',
    status: 'MODERATE',
  },
  {
    endpoint: '/api/v1/expenses/batch-approve',
    method: 'POST',
    avgLatency: '410 ms',
    p95Latency: '780 ms',
    requests: '984 calls',
    errorRate: '0.00%',
    status: 'MODERATE',
  },
  {
    endpoint: '/api/v1/reimbursements/disburse',
    method: 'POST',
    avgLatency: '350 ms',
    p95Latency: '590 ms',
    requests: '320 calls',
    errorRate: '0.00%',
    status: 'NORMAL',
  },
  {
    endpoint: '/api/v1/analytics/department-trend',
    method: 'GET',
    avgLatency: '185 ms',
    p95Latency: '290 ms',
    requests: '14,200 calls',
    errorRate: '0.02%',
    status: 'FAST',
  },
];

const mockExceptionLogs = [
  {
    id: 'ERR-9921',
    time: '15:38:12 IST',
    relative: '4 mins ago',
    type: 'ReceiptProcessingTimeoutException',
    endpoint: 'POST /api/v1/receipts/ocr-parse',
    user: 'lisa.ray@company.com',
    status: 'Investigating',
    code: '504 Gateway Timeout',
    stackTrace: `com.expensemanagement.exception.ReceiptProcessingTimeoutException: Vision OCR OCR worker timeout after 8000ms
  at com.expensemanagement.service.ReceiptService.extractMetadata(ReceiptService.java:142)
  at com.expensemanagement.controller.ReceiptController.parseReceipt(ReceiptController.java:58)
  at org.springframework.web.method.support.InvocableHandlerMethod.invoke(InvocableHandlerMethod.java:205)`,
  },
  {
    id: 'ERR-9920',
    time: '14:22:05 IST',
    relative: '1 hr ago',
    type: 'RateLimitExceededException (Brute Force Guard)',
    endpoint: 'POST /api/v1/auth/login',
    user: 'unknown (IP 45.142.122.9)',
    status: 'Blocked',
    code: '429 Too Many Requests',
    stackTrace: `com.expensemanagement.security.RateLimitExceededException: IP 45.142.122.9 exceeded threshold of 5 attempts/minute
  at com.expensemanagement.security.RateLimiterFilter.doFilterInternal(RateLimiterFilter.java:84)`,
  },
  {
    id: 'ERR-9919',
    time: '12:15:40 IST',
    relative: '3 hrs ago',
    type: 'InvalidTaxIdentificationException',
    endpoint: 'POST /api/v1/expenses/submit',
    user: 'kevin.v@company.com',
    status: 'Resolved',
    code: '422 Unprocessable Entity',
    stackTrace: `com.expensemanagement.exception.InvalidTaxIdentificationException: GSTIN failed checksum verification
  at com.expensemanagement.service.TaxValidator.validateGST(TaxValidator.java:34)`,
  },
];

const mockUserActivities = [
  { time: '10s ago', user: 'Alex Morgan', action: 'Approved reimbursement batch BATCH-2026-042', role: 'Finance Admin' },
  { time: '35s ago', user: 'Sarah Jenkins', action: 'Uploaded flight receipt (₹53,400)', role: 'Employee' },
  { time: '1m ago', user: 'James Wilson', action: 'Approved pending expense EXP-2026-081', role: 'Manager' },
  { time: '2m ago', user: 'David Kim', action: 'Updated Q4 Engineering budget allocation', role: 'DevOps Lead' },
  { time: '4m ago', user: 'Lisa Ray', action: 'Submitted new travel claim EXP-2026-085', role: 'Employee' },
];

export default function Monitoring() {
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(10); // seconds
  const [lastChecked, setLastChecked] = useState(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedException, setSelectedException] = useState(null);

  // Live telemetry metrics matching the user's specification
  const [metrics, setMetrics] = useState({
    apiResponseTime: 245,
    cpuUsage: 42,
    memoryUsage: 68,
    diskUsage: 54,
    activeUsers: 127,
    errorsToday: 8,
    requestCount: 142850,
    failedRequests: 12,
    errorRate: 0.008,
    apiUptime: 99.98,
    serverUptime: '48d 14h 22m',
  });

  const refreshTelemetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate subtle realistic telemetry fluctuations
      setMetrics((prev) => ({
        ...prev,
        apiResponseTime: Math.floor(240 + Math.random() * 12),
        cpuUsage: Math.floor(40 + Math.random() * 5),
        memoryUsage: Math.floor(67 + Math.random() * 3),
        activeUsers: Math.floor(124 + Math.random() * 6),
      }));
      setLastChecked(new Date().toLocaleTimeString());
      setIsRefreshing(false);
    }, 600);
  };

  useEffect(() => {
    if (!autoRefreshInterval) return;
    const interval = setInterval(() => {
      refreshTelemetry();
    }, autoRefreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefreshInterval]);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header with Live Pulse and Telemetry Refresh */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Application & System Monitoring
            </h1>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1.5 text-[11px] font-semibold">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time infrastructure health, API performance, JVM memory, concurrent sessions, and exception telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-xl border border-border">
            <Clock className="size-3.5" />
            <span>Checked: {lastChecked}</span>
          </div>

          <select
            value={autoRefreshInterval}
            onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
            className="h-9 px-2.5 rounded-xl border border-border bg-background text-xs font-medium text-foreground cursor-pointer focus:outline-none"
          >
            <option value={5}>Auto: 5s</option>
            <option value={10}>Auto: 10s</option>
            <option value={30}>Auto: 30s</option>
            <option value={0}>Pause</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={refreshTelemetry}
            disabled={isRefreshing}
            className="gap-1.5 text-xs h-9 cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Hero ASCII-Aligned Health Overview Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Backend API Status */}
        <Card className="shadow-xs border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Backend API
              </span>
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Healthy</h3>
              </div>
              <p className="text-[10px] text-muted-foreground">Spring Boot v3.2 • Port 8080</p>
            </div>
            <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Server className="size-5" />
            </div>
          </CardContent>
        </Card>

        {/* Frontend Status */}
        <Card className="shadow-xs border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Frontend SPA
              </span>
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Healthy</h3>
              </div>
              <p className="text-[10px] text-muted-foreground">Vite React 18 • 0 Compile Errors</p>
            </div>
            <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Globe className="size-5" />
            </div>
          </CardContent>
        </Card>

        {/* Database Status */}
        <Card className="shadow-xs border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Database (PostgreSQL)
              </span>
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Healthy</h3>
              </div>
              <p className="text-[10px] text-muted-foreground">Pool: 8/20 Active • 0 Deadlocks</p>
            </div>
            <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Database className="size-5" />
            </div>
          </CardContent>
        </Card>

        {/* Server Host Status */}
        <Card className="shadow-xs border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Cloud Host Server
              </span>
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Operational</h3>
              </div>
              <p className="text-[10px] text-muted-foreground">Uptime: {metrics.serverUptime}</p>
            </div>
            <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Radio className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Core KPIs: Response Time, Server Gauges, Users, Errors (Exact match to requested dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* API Response Time */}
        <Card className="shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="p-5 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                API RESPONSE TIME
              </CardTitle>
              <Zap className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-foreground">{metrics.apiResponseTime}</span>
              <span className="text-sm font-semibold text-muted-foreground">ms</span>
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingDown className="size-3" />
              <span>Optimal (SLA benchmark &lt;400 ms)</span>
            </p>
            <div className="mt-3 pt-3 border-t border-border flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>P50: 180 ms</span>
              <span>P95: 380 ms</span>
              <span>P99: 490 ms</span>
            </div>
          </CardContent>
        </Card>

        {/* Server Resources (CPU, Memory, Disk) */}
        <Card className="shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="p-5 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                SERVER VITALS
              </CardTitle>
              <Cpu className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-2.5">
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-muted-foreground">CPU Usage</span>
                <span className="font-bold text-foreground">{metrics.cpuUsage}%</span>
              </div>
              <Progress value={metrics.cpuUsage} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-muted-foreground">Memory / RAM</span>
                <span className="font-bold text-foreground">{metrics.memoryUsage}% (10.8 GB)</span>
              </div>
              <Progress value={metrics.memoryUsage} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-muted-foreground">Disk Storage</span>
                <span className="font-bold text-foreground">{metrics.diskUsage}% (270 GB)</span>
              </div>
              <Progress value={metrics.diskUsage} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* User Monitoring */}
        <Card className="shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="p-5 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                USER ACTIVITY
              </CardTitle>
              <Users className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-foreground">{metrics.activeUsers}</span>
              <span className="text-xs font-medium text-muted-foreground">Active Now</span>
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="size-3" />
              <span>+14.2% concurrent peak</span>
            </p>
            <div className="mt-3 pt-3 border-t border-border flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>Logged-in: 342</span>
              <span>Concurrent: 185</span>
              <span>Sessions: 418</span>
            </div>
          </CardContent>
        </Card>

        {/* Errors Today */}
        <Card className="shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="p-5 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                ERRORS TODAY
              </CardTitle>
              <AlertOctagon className="size-4 text-rose-500" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-foreground">{metrics.errorsToday}</span>
              <span className="text-xs font-medium text-muted-foreground">Exceptions</span>
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="size-3" />
              <span>0.008% Error rate (0.1% SLA)</span>
            </p>
            <div className="mt-3 pt-3 border-t border-border flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>Client 4xx: 5</span>
              <span>Server 5xx: 1</span>
              <span>Auth Blocked: 2</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network & Infrastructure Health Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Activity className="size-4.5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground block">API Request Volume</span>
              <span className="text-base font-bold text-foreground">142,850 Requests</span>
              <span className="text-[10px] text-muted-foreground block">12 failed • 99.98% Success</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Wifi className="size-4.5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground block">Network Throughput</span>
              <span className="text-base font-bold text-foreground">In: 14.8 MB/s • Out: 42.1 MB/s</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">0% Packet loss • Low jitter</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Database className="size-4.5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground block">Database Query Latency</span>
              <span className="text-base font-bold text-foreground">12.4 ms Average</span>
              <span className="text-[10px] text-muted-foreground block">Supabase Connection Pool: Normal</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout: Slow APIs Table & Live User Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slow APIs Performance Table (2 Cols) */}
        <Card className="lg:col-span-2 shadow-xs overflow-hidden">
          <CardHeader className="p-5 pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Slow APIs & Latency Profiler</CardTitle>
                <CardDescription className="text-xs">
                  Profiling response times, call frequencies, and error rates across microservices.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                Top 5 Endpoints
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="text-xs">
                  <TableHead className="w-16 pl-5">Method</TableHead>
                  <TableHead>API Endpoint Route</TableHead>
                  <TableHead className="w-24">Avg Latency</TableHead>
                  <TableHead className="w-24">P95 Latency</TableHead>
                  <TableHead className="w-28">Calls Today</TableHead>
                  <TableHead className="w-20 text-right pr-5">Profile</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSlowApis.map((api, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/40 transition-colors text-xs">
                    <TableCell className="pl-5 font-mono font-bold">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                        api.method === 'POST' ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600'
                      }`}>
                        {api.method}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-foreground font-medium text-[11px]">
                      {api.endpoint}
                    </TableCell>
                    <TableCell className="font-mono font-bold text-foreground">
                      {api.avgLatency}
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      {api.p95Latency}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-[11px]">
                      {api.requests}
                    </TableCell>
                    <TableCell className="text-right pr-5">
                      {api.status === 'SLOW' ? (
                        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px]">
                          Slow
                        </Badge>
                      ) : api.status === 'FAST' ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                          Fast
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          Normal
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Real-time User Activity Feed (1 Col) */}
        <Card className="shadow-xs overflow-hidden">
          <CardHeader className="p-5 pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">User Activity Feed</CardTitle>
                <CardDescription className="text-xs">
                  Live streaming user actions & financial operations.
                </CardDescription>
              </div>
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {mockUserActivities.map((act, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl border border-border/70 bg-muted/20 text-xs">
                <div className="size-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-foreground truncate">{act.user}</span>
                    <span className="text-[10px] text-muted-foreground font-mono shrink-0">{act.time}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{act.action}</p>
                  <span className="text-[10px] text-primary/80 font-medium block mt-0.5">{act.role}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Error & Exception Logs Monitoring Table */}
      <Card className="shadow-xs overflow-hidden">
        <CardHeader className="p-5 pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Exception Logs & Failure Interceptor</CardTitle>
              <CardDescription className="text-xs">
                Inspecting runtime unhandled exceptions, gateway timeouts, and unauthorized security triggers.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-rose-600 dark:text-rose-400 border-rose-500/20 bg-rose-500/5 text-[10px]">
              8 Logged Today
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="text-xs">
                <TableHead className="w-24 pl-5">Log ID</TableHead>
                <TableHead className="w-28">Time</TableHead>
                <TableHead className="w-32">HTTP Status</TableHead>
                <TableHead>Exception Class & Trigger</TableHead>
                <TableHead className="w-48">Target Route</TableHead>
                <TableHead className="w-32">User / IP</TableHead>
                <TableHead className="w-24 text-right pr-5">Stack Trace</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockExceptionLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/40 transition-colors text-xs">
                  <TableCell className="font-mono font-semibold pl-5 text-foreground">{log.id}</TableCell>
                  <TableCell className="text-muted-foreground text-[11px]">{log.relative}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[10px] text-rose-600 border-rose-500/30">
                      {log.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {log.type}
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground text-[11px]">
                    {log.endpoint}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-[11px]">
                    {log.user}
                  </TableCell>
                  <TableCell className="text-right pr-5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedException(log)}
                      className="h-8 px-2 text-xs gap-1 cursor-pointer hover:bg-muted"
                    >
                      <Eye className="size-3.5" />
                      <span>View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stack Trace Modal */}
      {selectedException && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2.5">
                <AlertOctagon className="size-5 text-rose-500" />
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Exception Stack Trace: {selectedException.id}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedException.endpoint} • Status: {selectedException.code}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedException(null)}
                className="size-8 p-0 rounded-full cursor-pointer hover:bg-muted"
              >
                ✕
              </Button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <span className="font-bold text-foreground block mb-1">Exception Details</span>
                <p className="text-muted-foreground">{selectedException.type}</p>
                <div className="mt-2 text-muted-foreground">
                  User: <span className="font-mono text-foreground">{selectedException.user}</span> • Recorded: <span className="font-mono text-foreground">{selectedException.time}</span>
                </div>
              </div>
              <div>
                <span className="font-bold text-foreground block mb-1.5">Stack Trace Log</span>
                <pre className="p-3.5 rounded-xl bg-zinc-950 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed border border-border">
                  {selectedException.stackTrace}
                </pre>
              </div>
            </div>
            <div className="p-4 border-t border-border flex justify-end gap-2 bg-muted/20">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedException(null)}
                className="text-xs cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
