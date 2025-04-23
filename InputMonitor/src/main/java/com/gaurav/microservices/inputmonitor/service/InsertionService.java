package com.gaurav.microservices.inputmonitor.service;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class InsertionService {

    private final InsertionHelperService helperService;

    public InsertionService(InsertionHelperService helperService) {
        this.helperService = helperService;
    }
    public Map<String, Integer> getStreamParametersById(Integer streamId) {
        return helperService.getStreamParametersById(streamId);
    }

    public Map<String, Object> insertRowsInBatches(int streamId, String tableName, int batchSize, int delaySeconds) {
        // Validate table name to prevent SQL injection
        if (!tableName.matches("[a-zA-Z0-9_]+")) {
            throw new IllegalArgumentException("Invalid table name");
        }

        // Get column metadata
        List<Map<String, Object>> columns = helperService.getTableColumns(tableName);
        if (columns.isEmpty()) {
            throw new IllegalArgumentException("Table not found or has no columns");
        }

        try {
            // Read all data from CSV
            List<Map<String, String>> allCsvData = helperService.readCsvData(streamId);
            if (allCsvData.isEmpty()) {
                throw new IllegalArgumentException("CSV file empty or could not be read");
            }

            Map<String, Object> result = new HashMap<>();
            List<Map<String, Object>> allInsertedRows = new ArrayList<>();
            int totalBatches = (int) Math.ceil((double) allCsvData.size() / batchSize);
            int rowsProcessed = 0;

            // Process data in batches
            for (int batchNum = 0; batchNum < totalBatches; batchNum++) {
                // Calculate batch start and end indices
                int startIdx = batchNum * batchSize;
                int endIdx = Math.min(startIdx + batchSize, allCsvData.size());

                // Get current batch
                List<Map<String, String>> batchData = allCsvData.subList(startIdx, endIdx);

                // Process this batch
                List<Map<String, Object>> batchInsertedRows = new ArrayList<>();
                for (Map<String, String> csvRow : batchData) {
                    Map<String, Object> insertedValues = helperService.insertRowFromCsv(tableName, streamId, columns, csvRow);
                    batchInsertedRows.add(insertedValues);
                    allInsertedRows.add(insertedValues);
                }

                rowsProcessed += batchData.size();
                System.out.printf("Batch %d/%d completed: Inserted %d rows (total: %d/%d)%n",
                        batchNum+1, totalBatches, batchData.size(), rowsProcessed, allCsvData.size());

                // If this isn't the last batch, wait for the specified delay
                if (batchNum < totalBatches - 1) {
                    try {
                        System.out.printf("Waiting for %d seconds before processing next batch...%n", delaySeconds);
                        Thread.sleep(delaySeconds * 1000L);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("Batch processing interrupted", e);
                    }
                }
            }


            result.put("message", allInsertedRows.size() + " row(s) inserted successfully in " + totalBatches + " batches");
            result.put("table", tableName);
            result.put("inserted_data", allInsertedRows);
            result.put("batches_processed", totalBatches);

            return result;
        } catch (IOException e) {
            throw new RuntimeException("Failed to read CSV file: " + e.getMessage(), e);
        }
    }

    public String getStreamNameById(int streamId) {
        return helperService.getStreamNameById(streamId);
    }
}