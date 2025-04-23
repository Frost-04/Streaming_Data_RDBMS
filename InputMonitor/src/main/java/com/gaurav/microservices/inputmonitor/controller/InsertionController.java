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
    public ResponseEntity<Map<String, Object>> insertInBatches(@RequestBody Map<String, Object> request) {
        // Get stream_id from request
        Integer streamId = (Integer) request.get("stream_id");

        if (streamId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Stream ID is required"));
        }

        try {
            // Fetch table name from database using stream_id
            String tableName = insertionService.getStreamNameById(streamId);

            if (tableName == null || tableName.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No table found for stream ID: " + streamId));
            }

            tableName= "sdb_" + tableName;
            // Fetch window_size and window_velocity directly using stream_id
            Map<String, Integer> streamParams = insertionService.getStreamParametersById(streamId);
            int batchSize = streamParams.get("window_size");
            int delaySeconds = streamParams.get("window_velocity");
            System.out.println(batchSize + "    " + delaySeconds);

            Map<String, Object> result = insertionService.insertRowsInBatches(streamId, tableName, batchSize, delaySeconds);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}