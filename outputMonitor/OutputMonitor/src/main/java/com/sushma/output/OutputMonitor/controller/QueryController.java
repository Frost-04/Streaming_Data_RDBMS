package com.sushma.output.OutputMonitor.controller;

import com.sushma.output.OutputMonitor.dto.QueryRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class QueryController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/execute-query")
    public Object executeQuery(@RequestBody QueryRequest request) {
        String rawQuery = request.getRaw_query();

        if (rawQuery == null || rawQuery.trim().isEmpty()) {
            return Map.of("error", "raw_query is required");
        }
        rawQuery = rawQuery.trim();

        // Check only single SELECT query and no ";"
        if (!rawQuery.toLowerCase().startsWith("select") || rawQuery.contains(";")) {
            return Map.of("error", "Only simple SELECT queries without semicolons are allowed");
        }

        try {
            // Execute query
            List<Map<String, Object>> result = jdbcTemplate.queryForList(rawQuery);
            return Map.of("data", result);

        } catch (Exception e) {
            e.printStackTrace();
            return Map.of(
                    "error", "Failed to execute query",
                    "details", e.getMessage()
            );
        }
    }
}