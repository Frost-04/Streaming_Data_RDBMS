package com.sushma.output.OutputMonitor.controller;

import com.sushma.output.OutputMonitor.dto.StreamIdRequest;
import com.sushma.output.OutputMonitor.service.OutputStreamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/output")
public class OutputStreamController {
    @Autowired
    private OutputStreamService outputStreamService;

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/window")
    public ResponseEntity<?> getStreamOutput(@RequestBody StreamIdRequest request) {
        try {
            Long streamId = request.getStreamId();

            if (streamId == null) {
                return ResponseEntity.badRequest().body("Stream ID is required.");
            }

            List<Map<String, Object>> tableData = outputStreamService.getTableDataByStreamId(streamId);
            return ResponseEntity.ok(tableData);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/summary")
    public ResponseEntity<?> getSummaryOutput(@RequestBody StreamIdRequest request) {
        try {
            Long streamId = request.getStreamId();

            if (streamId == null) {
                return ResponseEntity.badRequest().body("Stream ID is required.");
            }

            List<Map<String, Object>> tableData = outputStreamService.getSummaryDataByStreamId(streamId);
            return ResponseEntity.ok(tableData);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
