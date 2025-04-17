package com.gaurav.microservices.streamingdata.controller;

import com.gaurav.microservices.streamingdata.service.DynamicTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/tables")
public class DynamicTableController {

    @Autowired
    private DynamicTableService dynamicTableService;

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/create-table/{streamId}")
    public ResponseEntity<String> createTable(@PathVariable Long streamId) {
        dynamicTableService.createDynamicTableForStream(streamId);
        return ResponseEntity.ok("Table created successfully for stream ID: " + streamId);
    }
}
