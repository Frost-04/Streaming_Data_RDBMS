package com.gaurav.microservices.streamingdata.controller;

import com.gaurav.microservices.streamingdata.entity.DynamicTableMetadata;
import com.gaurav.microservices.streamingdata.service.DataRetrievalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/retrieve")
public class DataRetrievalController {

    @Autowired
    private DataRetrievalService dataRetrievalService;

    @PostMapping("/getStreamColsTableData")
    public ResponseEntity<List<Map<String, Object>>> getStreamColsTableData(@RequestBody Map<String, Long> requestBody) {
        Long streamId = requestBody.get("streamId");
        if (streamId == null) {
            return ResponseEntity.badRequest().build();
        }

        List<Map<String, Object>> columns = dataRetrievalService.getStreamColsTableData(streamId);
        return ResponseEntity.ok(columns);
    }
    @PostMapping("/getStreamQueriesTableData")
    public ResponseEntity<List<Map<String, Object>>> getStreamQueryTableData(@RequestBody Map<String, Long> requestBody) {
        Long streamId = requestBody.get("streamId");
        if (streamId == null) {
            return ResponseEntity.badRequest().build();
        }

        List<Map<String, Object>> queries = dataRetrievalService.getStreamQueriesTableData(streamId);
        return ResponseEntity.ok(queries);
    }
}