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

    @PostMapping("/insert-batched")
    public ResponseEntity<Map<String, Object>> insertInBatches(@RequestBody Map<String, String> request) {
        String tableName = request.get("tableName");

        if (tableName == null || tableName.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Table name is required"));
        }

        String origTableName = tableName.length() > 4 ? tableName.substring(4) : tableName;

        // Fetch window_size and window_velocity from stream_master table
        Map<String, Integer> streamParams = insertionService.getStreamParameters(origTableName);
        int batchSize = streamParams.get("window_size");
        int delaySeconds = streamParams.get("window_velocity");
        System.out.println(batchSize + "    " + delaySeconds);

        try {
            Map<String, Object> result = insertionService.insertRowsInBatches(tableName, batchSize, delaySeconds);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
