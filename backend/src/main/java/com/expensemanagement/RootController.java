package com.expensemanagement;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping(value = "/", produces = {MediaType.TEXT_HTML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<?> root(
            @RequestHeader(value = "Accept", defaultValue = "*/*") String acceptHeader
    ) {
        if (acceptHeader.contains(MediaType.TEXT_HTML_VALUE)) {
            String html = """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Expense Management Backend</title>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                            background: #09090b;
                            color: #f4f4f5;
                            min-height: 100vh;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 24px;
                        }
                        .card {
                            background: #18181b;
                            border: 1px solid #27272a;
                            border-radius: 16px;
                            padding: 36px;
                            max-width: 540px;
                            width: 100%;
                            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
                        }
                        .badge {
                            display: inline-flex;
                            align-items: center;
                            gap: 6px;
                            padding: 4px 12px;
                            border-radius: 9999px;
                            background: rgba(16, 185, 129, 0.15);
                            color: #34d399;
                            font-size: 13px;
                            font-weight: 600;
                            margin-bottom: 20px;
                        }
                        .badge-dot {
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            background: #10b981;
                            box-shadow: 0 0 8px #10b981;
                        }
                        h1 {
                            font-size: 26px;
                            font-weight: 700;
                            margin-bottom: 10px;
                            letter-spacing: -0.025em;
                            color: #ffffff;
                        }
                        p {
                            color: #a1a1aa;
                            font-size: 14px;
                            line-height: 1.6;
                            margin-bottom: 24px;
                        }
                        .endpoints {
                            background: #09090b;
                            border: 1px solid #27272a;
                            border-radius: 10px;
                            padding: 16px;
                            margin-bottom: 24px;
                        }
                        .endpoint-row {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 8px 0;
                            border-bottom: 1px solid #1f1f23;
                            font-size: 13px;
                        }
                        .endpoint-row:last-child {
                            border-bottom: none;
                        }
                        .endpoint-label {
                            color: #71717a;
                        }
                        .endpoint-value {
                            color: #e4e4e7;
                            font-family: monospace;
                        }
                        .btn-group {
                            display: flex;
                            gap: 12px;
                        }
                        .btn {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            flex: 1;
                            padding: 12px 20px;
                            border-radius: 8px;
                            font-size: 14px;
                            font-weight: 600;
                            text-decoration: none;
                            transition: all 0.2s ease;
                        }
                        .btn-primary {
                            background: #6366f1;
                            color: #ffffff;
                        }
                        .btn-primary:hover {
                            background: #4f46e5;
                        }
                        .btn-secondary {
                            background: #27272a;
                            color: #f4f4f5;
                            border: 1px solid #3f3f46;
                        }
                        .btn-secondary:hover {
                            background: #3f3f46;
                        }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <div class="badge">
                            <span class="badge-dot"></span>
                            API Operational
                        </div>
                        <h1>ExpenseHub Backend API</h1>
                        <p>The Spring Boot REST backend is running successfully and connected to the database. Access the web application via the frontend link below.</p>
                        <div class="endpoints">
                            <div class="endpoint-row">
                                <span class="endpoint-label">Status</span>
                                <span class="endpoint-value" style="color: #34d399;">UP (Port 8080)</span>
                            </div>
                            <div class="endpoint-row">
                                <span class="endpoint-label">Frontend Web App</span>
                                <span class="endpoint-value">http://localhost:5173</span>
                            </div>
                            <div class="endpoint-row">
                                <span class="endpoint-label">Health Check</span>
                                <span class="endpoint-value">/api/health</span>
                            </div>
                            <div class="endpoint-row">
                                <span class="endpoint-label">Auth API</span>
                                <span class="endpoint-value">/api/auth/*</span>
                            </div>
                        </div>
                        <div class="btn-group">
                            <a href="http://localhost:5173" class="btn btn-primary">Open Web App (Port 5173)</a>
                            <a href="/api/health" class="btn btn-secondary">Health Check</a>
                        </div>
                    </div>
                </body>
                </html>
                """;
            return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(html);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("application", "Expense Management Backend API");
        response.put("timestamp", LocalDateTime.now());
        response.put("frontendUrl", "http://localhost:5173");
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(response);
    }

    @GetMapping(value = "/api/health", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "expense-management-backend");
        response.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(response);
    }
}

