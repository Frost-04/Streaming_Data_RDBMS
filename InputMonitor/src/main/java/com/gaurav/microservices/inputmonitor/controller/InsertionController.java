package com.gaurav.microservices.inputmonitor.controller;

import com.gaurav.microservices.inputmonitor.service.InsertionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class InsertionController {

    private final InsertionService insertionService;

    public InsertionController(InsertionService insertionService) {
        this.insertionService = insertionService;
    }

    @PostMapping("/insert")
    public ResponseEntity<Map<String, Object>> insertIntoTable(@RequestBody Map<String, String> request) {
        String tableName = request.get("tableName");

        if (tableName == null || tableName.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Table name is required"));
        }

        try {
            Map<String, Object> result = insertionService.insertRow(tableName);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
