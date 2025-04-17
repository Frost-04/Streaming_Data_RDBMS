package com.gaurav.microservices.streamingdata.controller;

import com.gaurav.microservices.streamingdata.entity.DataSourceRequest;
import com.gaurav.microservices.streamingdata.entity.StreamColEntity;
import com.gaurav.microservices.streamingdata.entity.StreamMasterEntity;
import com.gaurav.microservices.streamingdata.entity.StreamQueryEntity;
import com.gaurav.microservices.streamingdata.repository.StreamColRepository;
import com.gaurav.microservices.streamingdata.service.DataSourceService;
import com.gaurav.microservices.streamingdata.service.FileProcessingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ingestion")
public class FileController {

    @Autowired
    private FileProcessingService fileProcessingService;

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/stream-master")
    public ResponseEntity<Map<String, Long>> createStreamMaster(@RequestBody StreamMasterEntity streamMaster) {
        // Save the stream master object
        System.out.println("Received StreamMasterEntity: " + streamMaster);

        StreamMasterEntity savedStream = fileProcessingService.savesStreamMaster(streamMaster);

        // Prepare the response with only streamId
        Map<String, Long> response = new HashMap<>();
        response.put("streamId", savedStream.getStreamId()); // Only include the streamId in the response

        return ResponseEntity.ok(response); // Send only the streamId in the response
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/stream-col")
    public ResponseEntity<String> createStreamCol(@RequestBody StreamColEntity streamCol) {
        System.out.println("Received StreamColEntity: " + streamCol);
        boolean result = fileProcessingService.saveStreamCol(streamCol);
        if(result)
            return ResponseEntity.ok("Stream column saved successfully!");
        else
            return ResponseEntity.status(400).body("Failed to save the info");
    }


    @Autowired
    private StreamColRepository streamColRepository;

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/stream-col/{streamId}")
    public ResponseEntity<List<StreamColEntity>> getStreamColsByStreamId(@PathVariable Long streamId) {
        List<StreamColEntity> cols = streamColRepository.findByStream_StreamId(streamId);
        return ResponseEntity.ok(cols);
    }

    @CrossOrigin(origins = "http://localhost:5173")
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

        @Autowired
        private DataSourceService dataSourceService;
        @PostMapping("/data-source")
        public ResponseEntity<?> createDataSource(@RequestBody DataSourceRequest request) {
            // Validate streamId, dataSourceType, dataSourcePath
            // Save to DB and maybe create a table based on it
            boolean created = dataSourceService.handleDataSource(request);

            if (created) {
                return ResponseEntity.ok(Map.of("message", "Data source saved and table created."));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create table.");
            }
        }
    }
