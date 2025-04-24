package com.gaurav.microservices.streamingdata.controller;

import com.gaurav.microservices.streamingdata.service.DynamicTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "http://localhost:5173")
public class DynamicTableController {

    @Autowired
    private DynamicTableService dynamicTableService;

    @PostMapping("/create")
    public ResponseEntity<String> createDynamicTables() {
        try {
            dynamicTableService.createDynamicTables();
            return ResponseEntity.ok("Dynamic tables created successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Failed to create tables: " + e.getMessage());
        }
    }
}