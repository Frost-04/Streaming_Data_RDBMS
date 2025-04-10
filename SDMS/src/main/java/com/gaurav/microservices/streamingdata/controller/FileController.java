package com.gaurav.microservices.streamingdata.controller;

import com.gaurav.microservices.streamingdata.entity.StreamColEntity;
import com.gaurav.microservices.streamingdata.entity.StreamMasterEntity;
import com.gaurav.microservices.streamingdata.entity.StreamQueryEntity;
import com.gaurav.microservices.streamingdata.service.FileProcessingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ingestion")
public class FileController {

    @Autowired
    private FileProcessingService fileProcessingService;


    @PostMapping("/stream-master")
    public String createStreamMaster(@RequestBody StreamMasterEntity streamMaster) {
        fileProcessingService.saveStreamMaster(streamMaster);
        return "Stream master saved successfully!";
    }

    @PostMapping("/stream-col")
    public ResponseEntity<String> createStreamCol(@RequestBody StreamColEntity streamCol) {

        boolean result = fileProcessingService.saveStreamCol(streamCol);
        if(result)
            return ResponseEntity.ok("Stream column saved successfully!");
        else
            return ResponseEntity.status(400).body("Failed to save the info");
    }

    @PostMapping("/stream-query")
    public ResponseEntity<String> createStreamQuery(@RequestBody StreamQueryEntity streamQuery) {
        boolean result = fileProcessingService.saveStreamQuery(streamQuery);

        if(result)
            return ResponseEntity.ok("Stream Query saved successfully!");
        else
            return ResponseEntity.status(400).body("Failed to save the info");
    }

    @PostMapping("/generate_tables")
    public ResponseEntity<String> generateTables(@RequestBody StreamQueryEntity streamQuery) {
        boolean result = fileProcessingService.saveStreamQuery(streamQuery);

        if(result)
            return ResponseEntity.ok("Stream Query saved successfully!");
        else
            return ResponseEntity.status(400).body("Failed to save the info");
    }
}
